import { useState } from "react";
import { Header, Footer, Inquiry } from "./components/Layout";
import { Hero, Purpose, Ecosystem } from "./sections/Ecosystem";
import {
  Model,
  Technology,
  Community,
  Science,
  FAQ,
  CallToAction,
} from "./sections/Program";
import { usePreferences } from "./i18n/usePreferences";

export function App() {
  const { t } = usePreferences();
  const [activeArea, setActiveArea] = useState(0);
  const [inquiry, setInquiry] = useState<{
    open: boolean;
    area: number | null;
    audience: number;
  }>({ open: false, area: null, audience: 0 });
  const contact = (area: number | null = null, audience = 0) =>
    setInquiry({ open: true, area, audience });
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header onContact={() => contact()} />
      <main id="main">
        <Hero active={activeArea} onSelect={setActiveArea} />
        <Purpose />
        <Ecosystem
          active={activeArea}
          onSelect={setActiveArea}
          onContact={contact}
        />
        <Model />
        <Technology />
        <Community />
        <Science />
        <FAQ />
        <CallToAction onContact={() => contact()} />
      </main>
      <Footer />
      <Inquiry
        open={inquiry.open}
        initialArea={inquiry.area}
        initialAudience={inquiry.audience}
        onClose={() => setInquiry({ ...inquiry, open: false })}
      />
    </div>
  );
}
