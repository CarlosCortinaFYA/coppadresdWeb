import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const playwrightApp = process.env.COP_PLAYWRIGHT_APP_DIR ??
  ["../../mobile", "../../antares-paciente"]
    .map(candidate => path.resolve(import.meta.dirname, candidate))
    .find(candidate => existsSync(path.join(candidate, "node_modules/playwright")));
assert.ok(playwrightApp, "Indica el directorio de la app con Playwright.");
const requireFromApp = createRequire(path.join(playwrightApp, "package.json"));
const { chromium, webkit, expect: browserExpect } = requireFromApp("playwright/test");
const expect = browserExpect.configure({ timeout: 15_000 });

function loopback(name) {
  const url = new URL(process.env[name]);
  assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(url.hostname));
  return url;
}
const web = loopback("COP_E2E_PAID_WEB_URL");
const app = loopback("COP_E2E_PAID_APP_URL");
const inbox = loopback("COP_E2E_PAID_INBOX_URL");
assert.equal(app.hostname, web.hostname, "Usa el mismo host para compartir la cookie de sesión.");
const database = process.env.COP_E2E_PAID_DATABASE;
const container = process.env.COP_E2E_PAID_DB_CONTAINER;
assert.ok(/^copp_review_[a-z0-9_]+$/.test(database ?? "") && /^[a-z0-9][a-z0-9_.-]+$/i.test(container ?? ""));
const auth = "/api/auth/paid-activation/demo";
const journey = "/api/v1/wellness/journey";
const expectedRetry = process.env.COP_E2E_EXPECT_GENERATION_RETRY === "true";

function pg(sql) {
  return execFileSync("docker", ["exec", container, "psql", "-X", "-qAt",
    "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", database, "-c", sql], { encoding: "utf8" }).trim();
}

function waitFor(page, route, method) {
  return page.waitForResponse(response => new URL(response.url()).pathname === route &&
    response.request().method() === method, { timeout: 15000 });
}

async function confirmedCheckout(page, email, loseResponse = false) {
  await page.goto(new URL("/membresia", web).href);
  await page.locator('label.m-plan:has(input[value="monthly"])').click();
  await page.getByRole("button", { name: "Continuar a la demostración" }).click();
  const submit = page.getByRole("button", { name: "Confirmar pago simulado" });
  await submit.scrollIntoViewIfNeeded();
  const heading = page.getByRole("heading", { name: "Pago de demostración" });
  await expect(heading).toBeVisible();
  const field = page.getByRole("textbox", { name: "Correo electrónico", exact: true });
  await field.fill(email);
  let paymentId;
  if (loseResponse) {
    const routePattern = "**" + auth + "/confirm";
    await page.route(routePattern, async route => {
      paymentId = route.request().postDataJSON().paymentId;
      const confirmed = await route.fetch();
      assert.equal(confirmed.status(), 202);
      await route.abort("failed");
    }, { times: 1 });
    await submit.click();
    await expect(page.getByRole("alert")).toBeVisible();
  } else {
    const pending = waitFor(page, auth + "/confirm", "POST");
    await submit.click();
    const response = await pending;
    assert.equal(response.status(), 202);
    paymentId = (await response.json()).paymentId;
  }
  assert.match(paymentId, /^[0-9a-f-]{36}$/i);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Revisa tu correo" })).toBeVisible();
  assert.match(await page.locator("body").innerText(), /\$19\.96/);
  assert.equal(pg(`SELECT count(*) FROM auth."PaidActivations" WHERE "PaymentId" = '${paymentId}' AND "Plan" = 'monthly' AND "AmountCents" = 1996;`), "1");
  return paymentId;
}

async function mailedLink(email, paymentId) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await fetch(new URL("/api/v1/messages", inbox));
    assert.ok(response.ok);
    const { messages } = await response.json();
    for (const message of messages.filter(entry => entry.To.some(address => address.Address === email))) {
      const mail = await fetch(new URL("/api/v1/message/" + message.ID, inbox));
      const { Text } = await mail.json();
      const link = Text.split(/\s+/).find(part => part.startsWith(web.origin + "/activar-membresia#"));
      if (link && new URLSearchParams(new URL(link).hash.slice(1)).get("paymentId") === paymentId)
        return link;
    }
    await delay(250);
  }
  throw new Error("No llegó el correo de bienvenida al buzón de prueba.");
}

async function openWelcome(page, link, reload = false) {
  const prepared = waitFor(page, auth + "/prepare", "POST");
  await page.goto(link);
  assert.equal((await prepared).status(), 204);
  await expect(page.getByRole("button", { name: "Continuar activación" })).toBeVisible();
  assert.equal(new URL(page.url()).hash, "");
  if (reload) {
    await page.reload();
    await expect(page.getByRole("button", { name: "Continuar activación" })).toBeVisible();
  }
}

async function openGoal(page) {
  await page.getByRole("link", { name: "Continúa a tu objetivo" }).click();
  await page.waitForURL(url => url.origin === app.origin && url.searchParams.get("wellnessJourney") === "1", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: "Tu objetivo", exact: true })).toBeVisible({ timeout: 45_000 });
}

async function fillQuestionnaire(page) {
  const next = () => page.getByRole("button", { name: "Continuar", exact: true }).first().click();
  await page.getByRole("button", { name: "Bajar de peso", exact: true }).click();
  await next();
  await page.getByRole("button", { name: "Femenino", exact: true }).click();
  for (const [field, value] of Object.entries({
    name: "Ana", age: "34", heightCm: "165", weightKg: "72", waistCm: "82", targetWeightKg: "65"
  })) {
    await page.locator(`ion-input[data-wl-field="${field}"] input`).fill(value);
  }
  await next();
  await page.locator(".wl-option").filter({ hasText: "Ligero" }).click();
  await next();
  await expect(page.getByText("Preferencias de alimentación", { exact: true })).toBeVisible();
  await next();
  for (const [label, count] of [["Seguridad del ejercicio", 7], ["Seguridad de la nutrición", 6]]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    for (let index = 0; index < count; index++) {
      await page.locator(".wl-question").nth(index).getByRole("button", { name: "No", exact: true }).click();
    }
    await next();
  }
  await page.locator('ion-checkbox[data-wl-field="terms"]').click();
  await next();
  await expect(page.getByText("Revisa tus elecciones", { exact: true })).toBeVisible();
}

function identity(email) {
  assert.match(email, /^[a-z0-9.-]+@example\.(?:invalid|test)$/);
  return pg(`SELECT u."Id", p.id FROM auth."Users" u
    JOIN app.patient_profiles p ON p.user_id = u."Id"
    WHERE u."NormalizedEmail" = upper('${email}') AND p.deleted_at IS NULL;`);
}

const browser = await (process.env.COP_E2E_BROWSER === "webkit" ? webkit : chromium).launch();
const contextOptions = { viewport: { width: 390, height: 844 }, locale: "es-CO", reducedMotion: "reduce" };
try {
  const newCustomer = await browser.newContext(contextOptions);
  const freshEmail = "journey-" + randomUUID().slice(0, 8) + "@example.invalid";
  const freshPassword = "Viaje!" + randomUUID().slice(0, 8) + "A7";
  const page = await newCustomer.newPage();
  const paymentId = await confirmedCheckout(page, freshEmail, true);
  const checkoutSession = await page.evaluate(() => sessionStorage.getItem("copp-paid-activation-demo-receipt"));
  await openWelcome(page, await mailedLink(freshEmail, paymentId), true);
  await page.route("**" + auth + "/redeem", async route => {
    const response = await route.fetch();
    assert.equal((await response.json()).status, "setup_required");
    await route.abort("failed");
  }, { times: 1 });
  await page.getByRole("button", { name: "Continuar activación" }).click();
  await expect(page.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
  await page.reload();
  for (const [label, value] of [
    ["Nombre", "Ana"], ["Apellido", "Viaje"], ["Nombre del contacto de emergencia", "Contacto de prueba"],
    ["Teléfono del contacto de emergencia", "+573005550123"], ["Nueva contraseña", freshPassword],
    ["Confirmar contraseña", freshPassword]
  ]) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  const accepted = [
    page.getByRole("checkbox", { name: "Acepto Política de privacidad de prueba" }),
    page.getByRole("checkbox", { name: "Acepto Términos de prueba" })
  ];
  for (const checkbox of accepted) await checkbox.check();
  const completed = waitFor(page, auth + "/complete", "POST");
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  const completion = await completed;
  assert.equal(completion.status(), 200);
  const [userId, profileId] = identity(freshEmail).split("|");
  assert.match(userId, /^[0-9a-f-]{36}$/i);
  assert.match(profileId, /^[0-9a-f-]{36}$/i);
  assert.equal(pg(`SELECT count(*) FROM app.legal_document_acceptances a
    JOIN erp.legal_documents d ON d.current_version_id = a.legal_document_version_id
    WHERE a.user_id = '${userId}' AND d.code LIKE 'paid-demo-%';`), "2");
  assert.equal(pg(`SELECT count(*) FROM auth."PaidActivations" WHERE "PaymentId" = '${paymentId}' AND "LinkedUserId" = '${userId}';`), "1");
  await openGoal(page);
  await fillQuestionnaire(page);

  const validSubmission = waitFor(page, journey + "/submissions", "POST");
  await page.route("**" + journey + "/submissions", async route => {
    const request = route.request();
    const { draft } = request.postDataJSON();
    const blocked = await page.request.post(new URL(journey + "/submissions", app).href, {
      headers: { Authorization: (await request.allHeaders()).authorization },
      data: { submissionId: randomUUID(), draft: { ...draft, age: 17 } }
    });
    assert.equal(blocked.status(), 422);
    assert.equal(pg(`SELECT count(*) FROM app.wellness_journey_generations WHERE patient_id = '${profileId}';`), "0");
    await route.continue();
  }, { times: 1 });
  await page.getByRole("button", { name: "Generar mi plan", exact: true }).click();
  const submitted = await validSubmission;
  assert.equal(submitted.status(), 202);
  const generation = await submitted.json();
  await expect(page.getByRole("heading", { name: "Protocolo de hoy", exact: true })).toBeVisible();
  const retry = page.getByRole("button", { name: "Reintentar", exact: true });
  if (expectedRetry) {
    await expect(retry).toBeVisible();
    await page.reload();
    await expect(retry).toBeVisible();
    await retry.click();
  }
  await expect(page.getByText("Tu plan y tu bandeja están listos", { exact: true })).toBeVisible();
  await expect(retry).toBeHidden();
  await expect(page.getByRole("heading", { name: "Bandeja", exact: true })).toBeVisible();
  const tab = (name) => page.getByRole("navigation", { name: "Navegación principal" }).getByRole("button", { name, exact: true });
  await tab("Nutrición").click();
  await expect(page.getByRole("heading", { name: "Dieta de hoy", exact: true })).toBeVisible();
  await tab("Ejercicio").click();
  await expect(page.getByRole("heading", { name: "Antes de empezar", exact: true })).toBeVisible();
  await tab("Inicio").click();
  await expect(page.getByRole("heading", { name: "Protocolo de hoy", exact: true })).toBeVisible();
  const [latest] = await Promise.all([
    page.waitForResponse(response => new URL(response.url()).pathname === journey + "/latest"
      && response.request().method() === "GET" && response.ok(), { timeout: 45_000 }),
    page.reload({ waitUntil: "domcontentloaded" }),
  ]);
  await expect(page.getByText("Tu plan y tu bandeja están listos", { exact: true })).toBeVisible({ timeout: 45_000 });
  const home = await latest.json();
  assert.equal(home.generationId, generation.generationId);
  assert.equal(home.submissionId, generation.submissionId);
  assert.equal(home.status, "ready");
  assert.equal(home.attempts, expectedRetry ? 2 : 1);
  assert.ok(home.exercise.result.items.length && home.nutrition.result.items.length && home.inbox.items.length);
  assert.equal(pg(`SELECT count(*) FROM app.wellness_journey_generations WHERE patient_id = '${profileId}';`), "1");
  // La ventana de checkout conserva la compra original mientras el cliente entra a la app.
  const checkout = await newCustomer.newPage();
  await checkout.goto(new URL("/membresia", web).href);
  await checkout.evaluate(value => sessionStorage.setItem("copp-paid-activation-demo-receipt", value), checkoutSession);
  await checkout.reload();
  await expect(checkout.getByRole("status", { name: "" }).filter({ hasText: "Activa" })).toBeVisible();
  async function membershipAction(label) {
    const result = waitFor(checkout, auth + "/membership-events", "POST");
    await checkout.getByRole("button", { name: label }).click();
    assert.equal((await result).status(), 200);
  }
  async function refreshApp(expectedStatus) {
    const result = waitFor(page, journey + "/latest", "GET");
    await page.reload({ waitUntil: "domcontentloaded" });
    const response = await result;
    assert.equal(response.status(), expectedStatus);
    return response.json();
  }
  const message = page.getByText("Tu membresía no está activa. Revísala en la web para recuperar el acceso.");
  await membershipAction("Simular vencimiento");
  assert.equal((await refreshApp(403)).code, "membership_inactive");
  await expect(message).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bandeja", exact: true })).toHaveCount(0);
  await membershipAction("Simular renovación");
  assert.equal((await refreshApp(200)).generationId, home.generationId);
  await expect(page.getByText("Tu plan y tu bandeja están listos", { exact: true })).toBeVisible();
  await membershipAction("Simular cancelación");
  const revalidated = waitFor(page, journey + "/latest", "GET");
  await page.bringToFront();
  await page.evaluate(() => window.dispatchEvent(new Event("visibilitychange")));
  const rejected = await revalidated;
  assert.equal(rejected.status(), 403);
  assert.equal((await rejected.json()).code, "membership_inactive");
  const deniedRetry = await page.request.post(new URL(journey + "/generation/" + home.generationId + "/retry", app).href, {
    headers: { Authorization: (await rejected.request().allHeaders()).authorization },
    data: { expectedAttempts: home.attempts },
  });
  assert.equal(deniedRetry.status(), 403);
  assert.equal((await deniedRetry.json()).code, "membership_inactive");
  await expect(message).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bandeja", exact: true })).toHaveCount(0);
  await newCustomer.close();

  const existingEmail = process.env.COP_E2E_PAID_EXISTING_EMAIL;
  const existingPassword = process.env.COP_E2E_PAID_EXISTING_PASSWORD;
  assert.ok(existingPassword);
  const before = identity(existingEmail);
  assert.match(before, /^[0-9a-f-]{36}\|[0-9a-f-]{36}$/i);
  const returningCustomer = await browser.newContext(contextOptions);
  const returning = await returningCustomer.newPage();
  const returningPayment = await confirmedCheckout(returning, existingEmail);
  await openWelcome(returning, await mailedLink(existingEmail, returningPayment));
  await returning.getByRole("button", { name: "Continuar activación" }).click();
  await returning.getByLabel("Contraseña", { exact: true }).fill(existingPassword);
  await returning.getByRole("button", { name: "Iniciar sesión y vincular membresía" }).click();
  await openGoal(returning);
  assert.equal(identity(existingEmail), before);
  assert.equal(pg(`SELECT "LinkedUserId" FROM auth."PaidActivations" WHERE "PaymentId" = '${returningPayment}';`), before.split("|")[0]);
  await returningCustomer.close();
  console.log("Flujo de experiencia del cliente: pago recuperable, alta y consentimientos, sesión móvil, compuertas, generación, accesos de membresía e identidad previa verificados.");
} finally {
  await browser.close();
}
