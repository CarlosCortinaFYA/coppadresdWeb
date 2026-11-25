import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";

const app = process.env.COP_PLAYWRIGHT_APP_DIR ?? path.resolve(import.meta.dirname, "../../mobile");
const { chromium, expect } = createRequire(path.join(app, "package.json"))("playwright/test");
const web = new URL(process.env.COP_E2E_PAID_WEB_URL);
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(web.hostname));
const database = process.env.COP_E2E_PAID_DATABASE;
const container = process.env.COP_E2E_PAID_DB_CONTAINER;
assert.ok(/^copp_review_[a-z0-9_]+$/.test(database ?? "") && /^[a-z0-9][a-z0-9_.-]+$/i.test(container ?? ""));
const route = "/api/auth/paid-activation/demo";
const browser = await chromium.launch();
function pg(sql) {
  return execFileSync("docker", ["exec", container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1",
    "-U", "postgres", "-d", database, "-c", sql], { encoding: "utf8" }).trim();
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: "es-CO" });
  await page.goto(new URL("/membresia", web).href);
  await page.locator('label.m-plan:has(input[value="monthly"])').click();
  await page.getByRole("button", { name: "Continuar a la demostración" }).click();
  await page.getByRole("textbox", { name: "Correo electrónico", exact: true })
    .fill(`kan116-${randomUUID()}@example.test`);
  await page.getByRole("button", { name: "Iniciar prueba de demostración" }).click();

  const membership = page.getByRole("region", { name: "Estado de la membresía de demostración" });
  const status = membership.getByRole("status");
  const expiry = membership.locator("time");
  await expect(status).toHaveText("En prueba");
  await expect(page.getByRole("button", { name: "Reenviar correo" })).toHaveCount(0);
  await page.reload();
  await expect(status).toHaveText("En prueba");

  async function event(label) {
    const result = page.waitForResponse(r => new URL(r.url()).pathname === route + "/membership-events"
      && r.request().method() === "POST");
    await page.getByRole("button", { name: label, exact: true }).click();
    const response = await result;
    assert.equal(response.status(), 200, await response.text());
    return response.request().postDataJSON();
  }
  const activation = await event("Confirmar pago simulado");
  const { paymentId } = activation;
  assert.match(paymentId, /^[0-9a-f-]{36}$/i);
  await expect(status).toHaveText("Activa");
  const firstExpiry = await expiry.getAttribute("datetime");

  const renewal = await event("Simular renovación");
  await expect(status).toHaveText("Activa");
  const renewedExpiry = await expiry.getAttribute("datetime");
  assert.ok(renewedExpiry > firstExpiry, "El servidor debe extender el periodo.");
  const eventUrl = new URL(route + "/membership-events", web).href;
  const duplicate = await page.request.post(eventUrl, { data: renewal, headers: { Origin: web.origin } });
  assert.equal(duplicate.status(), 200);
  assert.equal((await duplicate.json()).expiresAt.slice(0, 10), renewedExpiry);
  const stale = await page.request.post(eventUrl, {
    data: { ...renewal, eventId: randomUUID() }, headers: { Origin: web.origin },
  });
  assert.equal(stale.status(), 409);
  const foreign = await page.request.post(eventUrl, {
    data: { ...renewal, eventId: randomUUID(), checkoutKey: randomUUID() }, headers: { Origin: web.origin },
  });
  assert.equal(foreign.status(), 404);
  assert.equal(pg(`SELECT count(*) || ':' || sum("AmountCents") FROM auth."PaidMembershipDemoEvents" WHERE "PaymentId" = '${paymentId}';`), "2:3992");
  await event("Simular vencimiento");
  await expect(status).toHaveText("Vencida");
  await page.reload();
  await expect(status).toHaveText("Vencida");
  await event("Simular renovación");
  await expect(status).toHaveText("Activa");
  await event("Simular cancelación");
  await expect(status).toHaveText("Cancelada");
  await page.reload();
  await expect(status).toHaveText("Cancelada");
  await expect(page.getByRole("button", { name: "Simular renovación" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Iniciar prueba de demostración" })).toHaveCount(0);

  console.log("KAN-116: prueba, activación, renovación, vencimiento, cancelación y replay persistentes verificados.");
} finally {
  await browser.close();
}
