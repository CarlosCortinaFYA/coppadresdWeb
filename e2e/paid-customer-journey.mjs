import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
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
const databaseUser = process.env.COP_E2E_PAID_DB_USER ?? "postgres";
assert.ok(/^copp_review_[a-z0-9_]+$/.test(database ?? "") && /^[a-z0-9][a-z0-9_.-]+$/i.test(container ?? ""));
assert.match(databaseUser, /^[a-z_][a-z0-9_]*$/i);
const auth = "/api/auth/paid-activation/demo";
const journey = "/api/v1/wellness/journey";
const expectedRetry = process.env.COP_E2E_EXPECT_GENERATION_RETRY === "true";
const verifyAccountLegal = process.env.COP_E2E_KAN119 === "true";
const accountLegal = "/api/v1/me/account-legal-consents";

function pg(sql) {
  return execFileSync("docker", ["--context", "default", "exec", container, "psql", "-X", "-qAt",
    "-v", "ON_ERROR_STOP=1", "-U", databaseUser, "-d", database, "-c", sql], { encoding: "utf8" }).trim();
}

function waitFor(page, route, method) {
  return page.waitForResponse(response => new URL(response.url()).pathname === route &&
    response.request().method() === method, { timeout: 15000 });
}

async function confirmedCheckout(page, email, loseResponse = false, locale = "es") {
  const english = locale === "en";
  await page.goto(new URL("/membresia", web).href);
  await page.locator('label.m-plan:has(input[value="monthly"])').click();
  await page.getByRole("button", { name: english ? "Continue to the demo" : "Continuar a la demostración" }).click();
  const submit = page.getByRole("button", { name: english ? "Confirm simulated payment" : "Confirmar pago simulado" });
  await submit.scrollIntoViewIfNeeded();
  const heading = page.getByRole("heading", { name: english ? "Demo payment" : "Pago de demostración" });
  await expect(heading).toBeVisible();
  const field = page.getByRole("textbox", { name: english ? "Email" : "Correo electrónico", exact: true });
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
  await expect(page.getByRole("heading", { name: english ? "Check your email" : "Revisa tu correo" })).toBeVisible();
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
      const link = Text.split(/\s+/).find(part => ["/activar-membresia#", "/activate-membership#"]
        .some(prefix => part.startsWith(web.origin + prefix)));
      if (link && new URLSearchParams(new URL(link).hash.slice(1)).get("paymentId") === paymentId)
        return link;
    }
    await delay(250);
  }
  throw new Error("No llegó el correo de bienvenida al buzón de prueba.");
}

async function openWelcome(page, link, reload = false, locale = "es") {
  const prepared = waitFor(page, auth + "/prepare", "POST");
  await page.goto(link);
  assert.equal((await prepared).status(), 204);
  const continueLabel = locale === "en" ? "Continue activation" : "Continuar activación";
  await expect(page.getByRole("button", { name: continueLabel })).toBeVisible();
  assert.equal(new URL(page.url()).hash, "");
  if (reload) {
    await page.reload();
    await expect(page.getByRole("button", { name: continueLabel })).toBeVisible();
  }
}

async function openGoal(page) {
  await page.getByRole("link", { name: "Continúa a tu objetivo" }).click();
  await page.waitForURL(url => url.origin === app.origin && url.searchParams.get("wellnessJourney") === "1", { waitUntil: "commit" });
  if (verifyAccountLegal) await confirmPendingDocuments(page);
  await expect(page.getByRole("heading", { name: "Tu objetivo", exact: true })).toBeVisible({ timeout: 45_000 });
}

async function confirmPendingDocuments(page, max = 2) {
  const checkbox = page.getByRole("checkbox", { name: "He leído y acepto el documento mostrado.", exact: true, checked: false });
  const goal = page.getByRole("heading", { name: "Tu objetivo", exact: true });
  await expect(checkbox.or(goal)).toBeVisible({ timeout: 45_000 });
  for (let index = 0; index < max && await checkbox.isVisible(); index++) {
    await checkbox.click();
    const pending = waitFor(page, accountLegal + "/acceptances", "POST");
    await page.getByRole("button", { name: "Aceptar y continuar", exact: true }).click();
    assert.equal((await pending).status(), 200);
    await expect(checkbox.or(goal)).toBeVisible({ timeout: 45_000 });
  }
}

async function loginErp(page, erp, actor) {
  const email = process.env[`COP_E2E_KAN119_${actor}_EMAIL`] ?? "";
  const password = process.env[`COP_E2E_KAN119_${actor}_PASSWORD`];
  assert.match(email, /^[a-z0-9.-]+@example\.invalid$/i);
  assert.ok(password, `Falta la contraseña de la cuenta sintética ${actor}.`);
  const result = await page.request.post(new URL("/api/auth/login", erp).href, {
    data: { email, password, application: "erp" },
  });
  assert.equal(result.status(), 200);
  const { accessToken } = await result.json();
  assert.ok(accessToken, "El operador sintético necesita una sesión autenticada en el ERP.");
  return { Authorization: "Bearer " + accessToken };
}

async function verifyNewVersion(browser, page, userId, email, password) {
  const erp = loopback("COP_E2E_KAN119_ERP_URL");
  const terms = "paid-demo-terms-es";
  await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("button", { name: "Perfil", exact: true }).click();
  const logout = page.getByRole("button", { name: "Cerrar sesión", exact: true });
  await expect(logout).toBeVisible();
  const editor = await browser.newContext({ locale: "es-CO", acceptDownloads: true });
  const staff = await editor.newPage();
  const headers = await loginErp(staff, erp, "ADMIN");
  const draft = await staff.request.post(new URL(`/api/v1/legal-documents/${terms}/drafts`, erp).href, {
    headers, data: { title: "Términos de prueba", content: "Términos sintéticos KAN-119 v2." },
  });
  assert.equal(draft.status(), 200);
  await staff.goto(new URL("/settings", erp).href);
  await staff.getByRole("button", { name: "Documentación", exact: true }).click();
  await staff.getByRole("button", { name: /Términos de prueba/ }).first().click();
  await staff.getByRole("button", { name: "Publicar", exact: true }).click();
  const published = waitFor(staff, `/api/v1/legal-documents/${terms}/publish`, "POST");
  await staff.getByRole("dialog").getByRole("button", { name: "Publicar", exact: true }).click();
  const publication = await published;
  assert.equal(publication.status(), 200);
  assert.equal((await publication.json()).currentVersion, "2.0");

  await logout.click();
  await page.locator("#login-email input").fill(email);
  await page.locator("#login-password input").fill(password);
  const statusAfterPublication = waitFor(page, accountLegal, "GET");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  const status = await (await statusAfterPublication).json();
  assert.equal(status.acceptanceRequired, true);
  assert.deepEqual(status.documents.filter(document => !document.receiptId).map(document => document.scope), ["account-terms"]);
  await expect(page.getByRole("heading", { name: "Documentos de la cuenta", exact: true })).toBeVisible();
  await expect(page.getByText("Términos sintéticos KAN-119 v2.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Protocolo de hoy", exact: true })).toBeHidden();
  await page.getByRole("checkbox", { name: "He leído y acepto el documento mostrado.", exact: true }).click();
  const acceptance = waitFor(page, accountLegal + "/acceptances", "POST");
  await page.getByRole("button", { name: "Aceptar y continuar", exact: true }).click();
  assert.equal((await acceptance).status(), 200);
  await expect(page.getByRole("heading", { name: "Protocolo de hoy", exact: true })).toBeVisible({ timeout: 45_000 });
  await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("button", { name: "Perfil", exact: true }).click();
  await page.getByText("Privacidad y datos", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Privacidad y datos", exact: true })).toBeVisible();
  await expect(page.getByText("Versión 2.0", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Consentimientos y permisos", exact: true })).toBeVisible();

  const receipts = pg(`SELECT v.major, v.minor, a.id FROM app.legal_document_acceptances a
    JOIN erp.legal_document_versions v ON v.id = a.legal_document_version_id
    JOIN erp.legal_documents d ON d.id = v.document_id
    WHERE a.user_id = '${userId}' AND d.code = '${terms}' ORDER BY v.major, v.minor;`).split("\n");
  assert.deepEqual(receipts.map(row => row.split("|").slice(0, 2).join(".")), ["1.0", "2.0"]);

  await staff.getByRole("button", { name: "Historial de aceptaciones", exact: true }).click();
  await staff.getByLabel("ID de cuenta", { exact: true }).fill(userId);
  await staff.getByLabel("Código del documento", { exact: true }).fill(terms);
  await staff.getByRole("button", { name: "Aplicar filtros", exact: true }).click();
  for (const receipt of receipts) {
    await expect(staff.getByRole("cell", { name: receipt.split("|")[2], exact: true })).toBeVisible();
  }
  const [download] = await Promise.all([
    staff.waitForEvent("download"), staff.getByRole("button", { name: "Descargar CSV", exact: true }).click(),
  ]);
  assert.equal(download.suggestedFilename(), "legal-acceptances.csv");
  const csv = await readFile(await download.path(), "utf8");
  for (const receipt of receipts) assert.ok(csv.includes(receipt.split("|")[2]));
  await editor.close();

  const restricted = await browser.newContext({ locale: "es-CO" });
  const denied = await restricted.newPage();
  const restrictedHeaders = await loginErp(denied, erp, "RESTRICTED");
  for (const path of ["/api/v1/legal-acceptances", "/api/v1/legal-acceptances/export"]) {
    const response = await denied.request.get(new URL(path, erp).href, { headers: restrictedHeaders });
    assert.equal(response.status(), 403);
  }
  await restricted.close();
}

async function verifyEnglishDocuments(browser) {
  const context = await browser.newContext({ ...contextOptions, locale: "en-US" });
  try {
    const page = await context.newPage();
    await page.addInitScript((origin) => {
      if (location.origin === origin) localStorage.setItem("copp-language", "en");
    }, web.origin);
    const email = "journey-en-" + randomUUID().slice(0, 8) + "@example.invalid";
    const password = "Viaje!" + randomUUID().slice(0, 8) + "A7";
    const paymentId = await confirmedCheckout(page, email, false, "en");
    await openWelcome(page, await mailedLink(email, paymentId), false, "en");
    await page.getByRole("button", { name: "Continue activation", exact: true }).click();
    for (const [label, value] of [
      ["First name", "QA"], ["Last name", "English"], ["Emergency contact name", "Synthetic contact"],
      ["Emergency contact phone", "+573005550123"], ["New password", password], ["Confirm password", password],
    ]) await page.getByLabel(label, { exact: true }).fill(value);
    await page.getByRole("checkbox", { name: /Test terms/ }).check();
    await page.getByRole("checkbox", { name: /Test privacy policy/ }).check();
    const completed = waitFor(page, auth + "/complete", "POST");
    await page.getByRole("button", { name: "Create account", exact: true }).click();
    assert.equal((await completed).status(), 200);
    const [userId] = identity(email).split("|");
    assert.match(userId, /^[0-9a-f-]{36}$/i);
    assert.equal(pg(`SELECT count(*) FROM app.legal_document_acceptances a
      JOIN erp.legal_documents d ON d.current_version_id = a.legal_document_version_id
      WHERE a.user_id = '${userId}' AND a.locale = 'en' AND d.code IN ('paid-demo-terms-en','paid-demo-privacy-en');`), "2");
    const checked = waitFor(page, accountLegal, "GET");
    await page.getByRole("link", { name: "Continue to your goal", exact: true }).click();
    const status = await (await checked).json();
    assert.equal(status.locale, "en");
    assert.equal(status.acceptanceRequired, false);
    assert.equal(status.documents.length, 2);
    assert.ok(status.documents.every(document => document.receiptId));
  } finally {
    await context.close();
  }
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
  assert.match(email, /^[a-z0-9.-]+@example\.invalid$/);
  return pg(`SELECT u."Id", p.id FROM auth."Users" u
    JOIN app.patient_profiles p ON p.user_id = u."Id"
    WHERE u."NormalizedEmail" = upper('${email}') AND p.deleted_at IS NULL;`);
}

const browser = process.env.COP_E2E_BROWSER === "webkit"
  ? await webkit.launch()
  : await chromium.launch({ executablePath: process.env.COP_E2E_CHROMIUM_EXECUTABLE });
const contextOptions = { viewport: { width: 390, height: 844 }, locale: "es-CO", reducedMotion: "reduce" };
try {
  const newCustomer = await browser.newContext(contextOptions);
  const freshEmail = "journey-" + randomUUID().slice(0, 8) + "@example.invalid";
  const freshPassword = "Viaje!" + randomUUID().slice(0, 8) + "A7";
  const page = await newCustomer.newPage();
  const paymentId = await confirmedCheckout(page, freshEmail, true);
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
  if (verifyAccountLegal) {
    await page.route("**" + auth + "/complete", async route => {
      const request = route.request().postDataJSON();
      for (const versionIds of [[request.versionIds[0]], [request.versionIds[0], request.versionIds[0]],
        [request.versionIds[0], randomUUID()]]) {
        const rejected = await route.fetch({ postData: { ...request, versionIds } });
        assert.equal(rejected.status(), 409);
        assert.equal((await rejected.json()).code, "document_version_changed");
        assert.equal(identity(freshEmail), "");
      }
      await route.continue();
    }, { times: 1 });
  }
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
  if (verifyAccountLegal) console.log("KAN-119: alta con ambos recibos y acceso a Antares verificados.");
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
  if (verifyAccountLegal) {
    await expect(page.getByRole("heading", { name: "Datos sensibles", exact: true })).toBeVisible();
    await page.getByRole("checkbox", { name: "Acepto el uso de mis datos sensibles para mi plan de bienestar." }).click();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  }
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
  if (verifyAccountLegal) {
    await verifyNewVersion(browser, page, userId, freshEmail, freshPassword);
    console.log("KAN-119: publicación, reingreso, privacidad, historial, CSV y denegación del operador verificados.");
  }
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
  if (verifyAccountLegal) {
    await verifyEnglishDocuments(browser);
    console.log("KAN-119: recibos de la variante inglesa y continuidad a Antares verificados.");
  }
  console.log("Flujo de experiencia del cliente: pago recuperable, alta y consentimientos, sesión móvil, compuerta, generación e identidad previa verificadas.");
} finally {
  await browser.close();
}
