import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const mobileCandidates = ["../../mobile", "../../antares-paciente"].map((relative) =>
  path.resolve(import.meta.dirname, relative),
);
const playwrightApp = process.env.COP_PLAYWRIGHT_APP_DIR ??
  mobileCandidates.find((dir) => existsSync(path.join(dir, "node_modules/playwright")));
assert.ok(playwrightApp, "Indica la app con Playwright en COP_PLAYWRIGHT_APP_DIR.");
const requireFromApp = createRequire(path.resolve(playwrightApp, "package.json"));
const { chromium, expect } = requireFromApp("playwright/test");
const base = new URL(process.env.COP_E2E_MEMBERSHIP_URL ?? "http://127.0.0.1:5194");
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(base.hostname));

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    locale: "es-CO",
    reducedMotion: "reduce",
  });
  await page.clock.setFixedTime(new Date("2026-01-31T15:00:00Z"));
  const nonReads = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) nonReads.push(request.method());
  });
  await page.goto(new URL("/membresia", base).href);
  await page.locator('label.m-plan:has(input[value="monthly"])').click();
  await page.getByRole("button", { name: /Continuar al pago seguro|Continuar a la demostración/ }).click();
  await expect(page.getByRole("heading", { name: "Pago de demostración" })).toBeVisible();
  await expect(page.locator('input[autocomplete^="cc-"]')).toHaveCount(0);
  await expect(page.locator('input[autocomplete="email"]')).toHaveCount(0);
  await page.getByRole("button", { name: /^Simular pago/ }).click();

  const membership = page.getByRole("region", { name: "Estado de la membresía de demostración" });
  const status = membership.getByRole("status");
  const expiry = membership.locator("time");
  await expect(status).toHaveText("Activa");
  await expect(expiry).toHaveAttribute("datetime", "2026-02-28");
  await page.getByRole("button", { name: "Simular renovación" }).click();
  await expect(status).toHaveText("Activa");
  await expect(expiry).toHaveAttribute("datetime", "2026-03-28");

  await page.getByRole("button", { name: "Simular vencimiento" }).click();
  await expect(status).toHaveText("Vencida");
  await expect(expiry).toHaveAttribute("datetime", "2026-01-31");
  await page.reload();
  await expect(status).toHaveText("Vencida");
  await page.getByRole("button", { name: "Simular renovación" }).click();
  await expect(status).toHaveText("Activa");
  await expect(expiry).toHaveAttribute("datetime", "2026-02-28");
  await page.getByRole("button", { name: "Simular cancelación" }).click();
  await expect(status).toHaveText("Cancelada");
  await page.reload();
  await expect(status).toHaveText("Cancelada");
  await expect(page.getByRole("button", { name: "Simular renovación" })).toHaveCount(0);
  assert.deepEqual(nonReads, [], "La demo no debe enviar pagos ni datos a un servicio.");

  await page.getByRole("button", { name: "Cambiar a inglés" }).click();
  await expect(page.getByRole("region", { name: "Demo membership status" }).getByRole("status"))
    .toHaveText("Canceled");
  console.log("KAN-116: activación, renovación, vencimiento y cancelación demo verificados.");
} finally {
  await browser.close();
}
