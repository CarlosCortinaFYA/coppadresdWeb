import { useEffect, useState } from "react";

/** Rutas de la web. Sin dependencias: History API + `popstate`. */
export const ROUTES = {
  home: "/",
  deleteAccount: "/eliminar-cuenta",
  membership: "/membresia",
  patientChannel: "/atencion-al-paciente",
} as const;

function normalize(pathname: string): string {
  const clean = pathname.replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(() =>
    normalize(window.location.pathname),
  );
  useEffect(() => {
    const sync = () => setPathname(normalize(window.location.pathname));
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
