import { useEffect, useState } from "react";

/** Rutas de la web. Sin dependencias: History API + `popstate`. */
export const ROUTES = {
  home: "/",
  deleteAccount: "/eliminar-cuenta",
  membership: "/membresia",
  patientChannel: "/atencion-a-la-persona",
} as const;

function normalize(pathname: string): string {
  const clean = pathname.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

const LEGACY_PATIENT_CHANNEL = "/atencion-al-paciente";

function readPathname(): string {
  const { pathname, search, hash } = window.location;
  const route = normalize(pathname);
  if (route !== LEGACY_PATIENT_CHANNEL) return route;

  window.history.replaceState(
    window.history.state,
    "",
    ROUTES.patientChannel + search + hash,
  );
  return ROUTES.patientChannel;
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(readPathname);
  useEffect(() => {
    const sync = () => setPathname(readPathname());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  return pathname;
}

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}
