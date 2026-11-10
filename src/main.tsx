import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PreferencesProvider } from "./i18n/Preferences";
import { ROUTES, usePathname } from "./router";
import "./styles/index.css";
// Orden de hojas heredado: programs.css va después de index.css.
import "./styles/programs.css";

// Carga diferida: la página de cuenta y su CSS no entran en el grafo estático
// de la home, así que el orden de las hojas de estilo del sitio no cambia.
const DeleteAccountPage = lazy(() =>
  import("./account/DeleteAccountPage").then((m) => ({
    default: m.DeleteAccountPage,
  })),
);
// La membresía es un micro-frontend igual: chunk y CSS independientes.
const MembershipPage = lazy(() =>
  import("./membership/MembershipPage").then((m) => ({
    default: m.MembershipPage,
  })),
);

function Router() {
  const pathname = usePathname();
  if (pathname === ROUTES.deleteAccount) {
    return (
      <Suspense fallback={null}>
        <DeleteAccountPage />
      </Suspense>
    );
  }
  if (pathname === ROUTES.membership) {
    return (
      <Suspense fallback={null}>
        <MembershipPage />
      </Suspense>
    );
  }
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <Router />
    </PreferencesProvider>
  </StrictMode>,
);
