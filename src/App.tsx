import { useState } from "react";
import { Header, Footer, Inquiry } from "./components/Layout";
import { Hero, Purpose, Ecosystem } from "./sections/Ecosystem";
import {
  Model,
  Technology,
  Community,
  FAQ,
  CallToAction,
} from "./sections/Program";
import { usePreferences } from "./i18n/usePreferences";
import { ProgramNavigation, ProgramPage } from "./programs/ProgramPage";
import { programs, programList, DEFAULT_PROGRAM_ID } from "./programs/data";
import type { ProgramId } from "./programs/data";

export function App() {
  const { t, language } = usePreferences();
  const [activeProgram, setActiveProgram] =
    useState<ProgramId>(DEFAULT_PROGRAM_ID);
  const [activeArea, setActiveArea] = useState(0);
  const [inquiry, setInquiry] = useState<{
    open: boolean;
    area: number | null;
    audience: number;
  }>({ open: false, area: null, audience: 0 });
  const contact = (area: number | null = null, audience = 0) =>
    setInquiry({ open: true, area, audience });
  const program = programs[activeProgram];
  const links = program.institutional
    ? t.nav.map((label, i) => ({
        label,
        id: ["ecosystem", "model", "technology", "community"][i],
      }))
    : program.sections
        .filter((s) => s.navLabel)
        .map((s) => ({ id: s.id, label: s.navLabel![language] }));
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header onContact={() => contact()} links={links} />
      <main id="main">
        <ProgramNavigation active={activeProgram} onChange={setActiveProgram} />
        {programList
          .filter((p) => p.id !== activeProgram)
          .map((p) => (
            <div
              key={p.id}
              hidden
              role="tabpanel"
              id={`panel-${p.id}`}
              aria-labelledby={`tab-${p.id}`}
            />
          ))}
        <ProgramPage
          key={activeProgram}
          program={program}
          onContact={() => contact()}
        >
          {program.institutional && (
            <>
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
              <FAQ />
              <CallToAction onContact={() => contact()} />
            </>
          )}
        </ProgramPage>
      </main>
      <Footer links={links} />
      <Inquiry
        open={inquiry.open}
        initialArea={inquiry.area}
        initialAudience={inquiry.audience}
        programName={program.name}
        institutional={!!program.institutional}
        onClose={() => setInquiry({ ...inquiry, open: false })}
      />
    </div>
  );
}
