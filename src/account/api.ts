/**
 * Cliente de la web de eliminación de cuenta. El Auth Service actúa como backend
 * de esta página (patrón BFF): la sesión vive en una cookie HttpOnly +
 * SameSite=Strict que este JavaScript no puede leer. Aquí nunca se recibe ni se
 * guarda un access o refresh token.
 *
 * Producción: VITE_GATEWAY_BASE_URL apunta al gateway público (mismo sitio que
 * la web, por eso la cookie Strict viaja). Desarrollo: vacío → proxy de Vite.
 */

const SESSION_PATH = "/api/auth/account/deletion-session";
// Palabra canónica que espera el backend, sin importar el idioma de la UI.
const CONFIRMATION = "ELIMINAR";

function baseUrl(): string {
  return (import.meta.env.VITE_GATEWAY_BASE_URL ?? "").replace(/\/+$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      // Necesario para que el navegador guarde y envíe la cookie de sesión.
      credentials: "include",
      cache: "no-store",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError("network", 0);
  }
  if (!res.ok) {
    let message = "";
    try {
      const data = (await res.json()) as { message?: string };
      if (typeof data?.message === "string") message = data.message;
    } catch {
      /* cuerpo sin JSON */
    }
    throw new ApiError(message, res.status);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

/** Lo único que devuelve el backend al iniciar la sesión: datos para mostrar. */
export interface SessionSummary {
  firstName: string;
  lastName: string;
  email: string | null;
  expiresAt: string;
}

export interface ContactMethod {
  id: string;
  type: "Email" | "Phone";
  label: string;
}

export interface IdLookupResult {
  contacts: ContactMethod[];
}

export interface DeleteResult {
  purgeAfter: string | null;
  retentionDays: number;
}

/** Canjea (una sola vez) el código que entrega la app por la cookie de sesión. */
export function startFromCode(code: string): Promise<SessionSummary> {
  return request("POST", SESSION_PATH, { code });
}

export function startWithPassword(
  documentNumber: string,
  password: string,
): Promise<SessionSummary> {
  return request("POST", `${SESSION_PATH}/password`, {
    documentNumber,
    password,
  });
}

export function startWithOtp(
  documentNumber: string,
  otp: string,
): Promise<SessionSummary> {
  return request("POST", `${SESSION_PATH}/otp`, { documentNumber, otp });
}

/** Sesión vigente (p. ej. tras recargar la página). 401 si no hay. */
export function getSession(): Promise<SessionSummary> {
  return request("GET", SESSION_PATH);
}

export function confirmDeletion(): Promise<DeleteResult> {
  return request("POST", `${SESSION_PATH}/confirm`, {
    confirmation: CONFIRMATION,
  });
}

export function cancelSession(): Promise<void> {
  return request("DELETE", SESSION_PATH);
}

export function lookupId(documentNumber: string): Promise<IdLookupResult> {
  return request("POST", "/api/auth/id-lookup", {
    documentNumber,
    application: "app",
  });
}

export function sendOtp(
  documentNumber: string,
  contactId: string,
): Promise<unknown> {
  return request("POST", "/api/auth/send-otp", { documentNumber, contactId });
}
