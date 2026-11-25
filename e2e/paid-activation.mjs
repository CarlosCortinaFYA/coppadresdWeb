import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// COP_E2E_PAID_SMOKE_ONLY=true comprueba solo la entrada de la demo en Vite.
// La prueba completa usa el Gateway local, Mailpit con --enable-chaos y una base copp_review_*.
const mobileCandidates = ["../../mobile", "../../antares-paciente"].map((relative) =>
  path.resolve(import.meta.dirname, relative),
);
const mobile = process.env.COP_PLAYWRIGHT_APP_DIR ??
  mobileCandidates.find((dir) => existsSync(path.join(dir, "node_modules/playwright")));
assert.ok(mobile, "Indica la app con Playwright en COP_PLAYWRIGHT_APP_DIR.");
const requireFromApp = createRequire(path.join(mobile, "package.json"));
const { chromium, webkit, expect } = requireFromApp("playwright/test");

function localUrl(value) {
  const url = new URL(value);
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname));
  return url;
}

const web = localUrl(process.env.COP_E2E_PAID_WEB_URL ?? "http://127.0.0.1:5196");
const smokeOnly = process.env.COP_E2E_PAID_SMOKE_ONLY === "true";
const namespace = "/api/auth/paid-activation/demo";
const confirmPath = `${namespace}/confirm`;
const resendPath = `${namespace}/resend`;
const preparePath = `${namespace}/prepare`;
const redeemPath = `${namespace}/redeem`;
const browserOptions = {
  viewport: { width: 390, height: 844 },
  locale: "es-CO",
  reducedMotion: "reduce",
  ignoreHTTPSErrors: true,
};

function responseFor(page, pathname, method = "POST") {
  return page.waitForResponse((response) =>
    new URL(response.url()).pathname === pathname && response.request().method() === method,
  );
}

async function beginCheckout(page, english = false) {
  await page.goto(new URL("/membresia", web).href);
  if (english) await page.getByRole("button", { name: "Cambiar a inglés" }).click();
  await page.locator('label.m-plan:has(input[value="monthly"])').click();
  await page.getByRole("button", {
    name: english ? /Continue to (secure payment|the demo)/i : /Continuar al pago seguro|Continuar a la demostración/,
  }).click();
  await expect(page.getByRole("heading", { name: english ? "Demo payment" : "Pago de demostración" })).toBeVisible();
  const confirm = page.getByRole("button", {
    name: english ? "Confirm simulated payment" : "Confirmar pago simulado",
    exact: true,
  });
  await expect(confirm).toBeVisible();
  await expect(page.locator('input[autocomplete^="cc-"]')).toHaveCount(0);
  return confirm;
}

async function confirmPayment(page, email, english = false) {
  const confirm = await beginCheckout(page, english);
  await page.locator('input[type="email"]').fill(email);
  const pending = responseFor(page, confirmPath);
  await confirm.click();
  const response = await pending;
  assert.equal(response.status(), 202);
  const payload = response.request().postDataJSON();
  assert.deepEqual(Object.keys(payload).sort(), ["email", "language", "paymentId", "plan"]);
  assert.equal(payload.email.toLowerCase(), email.toLowerCase());
  assert.equal(payload.plan, "monthly");
  assert.equal(payload.language, english ? "en" : "es");
  assert.match(payload.paymentId, /^[0-9a-f-]{36}$/i);
  await expect(page.getByText(english ? "Check your email" : "Revisa tu correo", { exact: true })).toBeVisible();
  return payload;
}

async function openWelcome(page, link, english = false) {
  const writes = [];
  const observe = (request) => {
    if (request.method() === "POST" && new URL(request.url()).pathname === redeemPath) writes.push(true);
  };
  page.on("request", observe);
  const prepared = responseFor(page, preparePath);
  await page.goto(link.href);
  assert.equal((await prepared).status(), 204);
  await expect(page.getByRole("heading", { name: english ? "Activate your membership" : "Activa tu membresía" })).toBeVisible();
  const submit = page.getByRole("button", {
    name: english ? "Continue activation" : "Continuar activación",
    exact: true,
  });
  await expect(submit).toBeVisible();
  assert.equal(new URL(page.url()).hash, "", "El token no debe quedarse en la barra de direcciones.");
  assert.equal(writes.length, 0, "Abrir el correo no debe consumir el enlace.");
  page.off("request", observe);
  return submit;
}

async function redeem(page, link, english = false) {
  const submit = await openWelcome(page, link, english);
  return submitWelcome(page, submit);
}

async function submitWelcome(page, submit) {
  const pending = responseFor(page, redeemPath);
  await submit.click();
  return pending;
}

async function resendWelcome(page) {
  const pending = responseFor(page, resendPath);
  await page.getByRole("button", { name: "Reenviar correo de bienvenida", exact: true }).click();
  assert.equal((await pending).status(), 202);
}

async function localMail(inbox, address) {
  const response = await fetch(new URL("/api/v1/messages", inbox));
  assert.ok(response.ok, "No se puede leer el buzón SMTP local.");
  const { messages } = await response.json();
  return messages.filter((message) =>
    message.To.some(({ Address }) => Address.toLowerCase() === address.toLowerCase()),
  );
}

async function expectBrandedWelcome(html, url, english) {
  const preview = await browser.newPage(browserOptions);
  try {
    // No cargar logos remotos al comprobar el HTML recibido en el buzón de prueba.
    await preview.route("**/*", (route) => route.abort());
    await preview.setContent(html);
    await expect(preview.locator("html")).toHaveAttribute("lang", english ? "en" : "es");
    await expect(preview.getByRole("heading", {
      name: english ? "Welcome to Copp Adresd" : "Bienvenido a Copp Adresd", exact: true,
    })).toBeVisible();
    const activate = preview.getByRole("link", {
      name: english ? "Activate your membership" : "Activa tu membresía", exact: true,
    });
    await expect(activate).toBeVisible();
    // Comprobar paridad sin imprimir el enlace de un solo uso si la aserción falla.
    assert.ok(await activate.getAttribute("href") === url.href, "El botón y el texto plano deben apuntar al mismo enlace.");
    await expect(activate).toHaveCSS("display", "inline-block");
    await expect(activate).toHaveCSS("color", "rgb(255, 255, 255)");
    assert.ok(await preview.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  } finally {
    await preview.close();
  }
}

async function welcomeLink(inbox, address, paymentId, exclude = new Set(), english = false) {
  const expectedPath = english ? "/activate-membership" : "/activar-membresia";
  for (let attempt = 0; attempt < 60; attempt++) {
    for (const message of await localMail(inbox, address)) {
      if (exclude.has(message.ID)) continue;
      const response = await fetch(new URL(`/api/v1/message/${message.ID}`, inbox));
      assert.ok(response.ok);
      const { Text, HTML } = await response.json();
      const part = Text.split(/\s+/).find((item) => item.startsWith(`${web.origin}${expectedPath}#`));
      if (!part) continue;
      const url = new URL(part);
      const fragment = new URLSearchParams(url.hash.slice(1));
      if (fragment.get("paymentId") !== paymentId) continue;
      assert.equal(url.search, "");
      assert.ok(fragment.get("token"), "El correo de bienvenida debe incluir el token en el fragmento.");
      await expectBrandedWelcome(HTML, url, english);
      return { id: message.ID, url };
    }
    await delay(250);
  }
  throw new Error("El correo de bienvenida de la compra no llegó al buzón local.");
}

async function setMailFailure(inbox, fail) {
  const response = await fetch(new URL("/api/v1/chaos", inbox), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fail ? { Recipient: { ErrorCode: 451, Probability: 100 } } : {}),
  });
  assert.ok(response.ok, "Habilita --enable-chaos en el buzón Mailpit de prueba.");
}

function pg(sql) {
  const container = process.env.COP_E2E_PAID_DB_CONTAINER;
  const database = process.env.COP_E2E_PAID_DATABASE;
  assert.ok(container && /^copp_review_[a-z0-9_]+$/.test(database ?? ""),
    "Usa un contenedor local y una base desechable copp_review_*.");
  return execFileSync("docker", ["--context", "default", "exec", container, "psql", "-X", "-qAt",
    "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", database, "-c", sql], { encoding: "utf8" }).trim();
}

function originalIdentity(email) {
  assert.match(email, /^[a-z0-9.-]+@example\.invalid$/);
  return pg(`SELECT u."Id", p.id FROM auth."Users" u
    JOIN app.patient_profiles p ON p.user_id = u."Id"
    WHERE u."NormalizedEmail" = upper('${email}') AND p.deleted_at IS NULL;`);
}

function activationFor(paymentId) {
  assert.match(paymentId, /^[0-9a-f-]{36}$/i);
  return pg(`SELECT "LinkedUserId", ("RedeemedAt" IS NOT NULL)
    FROM auth."PaidActivations" WHERE "PaymentId" = '${paymentId}';`);
}

const browser = await (process.env.COP_E2E_BROWSER === "webkit" ? webkit : chromium).launch();
try {
  const freshCheckout = await browser.newPage(browserOptions);
  if (smokeOnly) {
    await beginCheckout(freshCheckout);
  } else {
    const inbox = localUrl(process.env.COP_E2E_PAID_INBOX_URL);
    const existingEmail = process.env.COP_E2E_PAID_EXISTING_EMAIL;
    const existingPassword = process.env.COP_E2E_PAID_EXISTING_PASSWORD;
    assert.ok(existingEmail && existingPassword, "Configura el paciente sintético existente.");
    const identityBefore = originalIdentity(existingEmail);
    assert.match(identityBefore, /^[0-9a-f-]{36}\|[0-9a-f-]{36}$/);
    const [userId, profileId] = identityBefore.split("|");
    const freshEmail = `paid-${randomUUID().slice(0, 8)}@example.invalid`;
    const freshWelcome = await browser.newPage(browserOptions);

    await setMailFailure(inbox, true);
    let freshPayment;
    try {
      freshPayment = await confirmPayment(freshCheckout, freshEmail);
      const replayPayloads = [freshPayment, freshPayment, { ...freshPayment, email: "different-paid@example.invalid" }];
      const replays = await Promise.all(replayPayloads.map((data) =>
        freshCheckout.request.post(new URL(confirmPath, web).href, { data }),
      ));
      assert.deepEqual(replays.map((response) => response.status()), [202, 202, 202]);
      assert.equal(activationFor(freshPayment.paymentId), "|f", "El pago permanece pendiente mientras falla el correo.");
      assert.equal(pg(`SELECT "Email" FROM auth."PaidActivations" WHERE "PaymentId" = '${freshPayment.paymentId}';`), freshEmail);
      await expect.poll(() => pg(`SELECT ("EmailAttempts" >= 1 AND "EmailLeaseUntil" IS NULL AND "NextEmailAttemptAt" IS NOT NULL)
        FROM auth."PaidActivations" WHERE "PaymentId" = '${freshPayment.paymentId}';`),
        { message: "El rechazo SMTP debe dejar trabajo listo para reintento." }).toBe("t");
      await delay(5500);
      assert.equal((await localMail(inbox, freshEmail)).length, 0);
    } finally {
      await setMailFailure(inbox, false);
    }
    await freshCheckout.reload();
    await expect(freshCheckout.getByText("Revisa tu correo", { exact: true })).toBeVisible();
    await resendWelcome(freshCheckout);
    const firstLink = await welcomeLink(inbox, freshEmail, freshPayment.paymentId);
    assert.equal((await localMail(inbox, "different-paid@example.invalid")).length, 0);
    await delay(5500);
    await resendWelcome(freshCheckout);
    const currentLink = await welcomeLink(inbox, freshEmail, freshPayment.paymentId, new Set([firstLink.id]));
    const staleWelcome = await browser.newPage(browserOptions);
    const rejected = responseFor(staleWelcome, preparePath);
    await staleWelcome.goto(firstLink.url.href);
    assert.equal((await rejected).status(), 400);
    await expect(staleWelcome.getByRole("alert")).toHaveText("Este enlace de bienvenida no es válido o venció.");
    assert.equal(activationFor(freshPayment.paymentId), "|f", "El enlace sustituido no puede consumir el pago.");
    const replay = await browser.newPage(browserOptions);
    const bothTabs = [freshWelcome, replay];
    const redeemControls = await Promise.all(bothTabs.map((page) => openWelcome(page, currentLink.url)));
    const competingRedemptions = await Promise.all(bothTabs.map((page, index) =>
      submitWelcome(page, redeemControls[index]),
    ));
    assert.deepEqual(competingRedemptions.map((response) => response.status()).toSorted(), [200, 400]);
    const winner = competingRedemptions.findIndex((response) => response.status() === 200);
    assert.equal((await competingRedemptions[winner].json()).status, "setup_required");
    await expect(bothTabs[winner].getByRole("heading", { name: "Continúa la configuración de tu cuenta" })).toBeVisible();
    await expect(bothTabs[1 - winner].getByRole("alert")).toHaveText("Este enlace de bienvenida no es válido o venció.");
    assert.equal(activationFor(freshPayment.paymentId), "|t");
    assert.equal(pg(`SELECT count(*) FROM auth."Users" WHERE "NormalizedEmail" = upper('${freshEmail}');`), "0");

    const returningCheckout = await browser.newPage(browserOptions);
    const returningPayment = await confirmPayment(returningCheckout, existingEmail, true);
    const returningLink = await welcomeLink(inbox, existingEmail, returningPayment.paymentId, new Set(), true);
    const returningWelcome = await browser.newPage(browserOptions);
    const requireLogin = await redeem(returningWelcome, returningLink.url, true);
    assert.equal(requireLogin.status(), 409);
    assert.equal((await requireLogin.json()).code, "sign_in_required");
    assert.equal(activationFor(returningPayment.paymentId), "|f", "El enlace no vincula una cuenta existente por sí solo.");

    const signIn = returningWelcome.getByRole("button", { name: "Sign in and link membership", exact: true });
    const password = returningWelcome.getByLabel("Password", { exact: true });
    await password.fill("IncorrectTestPassword!116");
    const badLogin = responseFor(returningWelcome, "/api/auth/login");
    await signIn.click();
    assert.equal((await badLogin).status(), 401);
    await expect(returningWelcome.getByRole("alert")).toBeVisible();
    assert.equal(activationFor(returningPayment.paymentId), "|f");

    await password.fill(existingPassword);
    const login = responseFor(returningWelcome, "/api/auth/login");
    const link = responseFor(returningWelcome, redeemPath);
    await signIn.click();
    const loginResult = await login;
    assert.equal(loginResult.status(), 200);
    assert.equal(loginResult.request().postDataJSON().application, "app");
    const linked = await link;
    assert.equal(linked.status(), 200);
    assert.equal((await linked.json()).status, "linked");
    await expect(returningWelcome.getByText("Membership linked", { exact: true })).toBeVisible();

    const { accessToken } = await loginResult.json();
    assert.ok(accessToken);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const me = await returningWelcome.request.get(new URL("/api/auth/me", web).href, { headers });
    const profile = await returningWelcome.request.get(new URL("/api/v1/me/patient-profile", web).href, { headers });
    assert.equal(me.status(), 200);
    assert.equal(profile.status(), 200);
    assert.equal((await me.json()).id, userId);
    assert.equal((await profile.json()).patientId, profileId);
    assert.equal(activationFor(returningPayment.paymentId), `${userId}|t`);
    assert.equal(originalIdentity(existingEmail), identityBefore);
    assert.equal(pg(`SELECT count(*) FROM auth."Users" WHERE "NormalizedEmail" = upper('${existingEmail}');`), "1");
    console.log("KAN-116: pago repetido, rechazo SMTP, rotación por reenvío, activación de un uso, inicio de sesión y perfil original verificados.");
  }
} finally {
  await browser.close();
}
