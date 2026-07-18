import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import InteractiveDropBuilder from './components/InteractiveDropBuilder';
import LiveProof from './components/LiveProof';
import Builds from './components/Builds';
import PipelineGrid from './components/PipelineGrid';
import LiveShowcase from './components/showcase/LiveShowcase';
import Contact from './components/Contact';
import LaunchCTA from './components/LaunchCTA';
import NeonBot from './components/NeonBot';
import GalaxyBackdrop from './components/GalaxyBackdrop';
import { useLang } from './i18n';

export default function App() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <GalaxyBackdrop />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        <InteractiveDropBuilder />
        <LiveProof />
        <Builds />
        <PipelineGrid />
        <LiveShowcase />
        <Contact />
        <LaunchCTA />
      </main>
      <div className="relative z-10"><Footer /></div>
      <NeonBot />
    </div>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink">
            <span className="h-3 w-3 rounded-full bg-ink-950" />
          </span>
          <div>
            <p className="text-sm font-extrabold tracking-[0.2em] text-white">NEONWERKS</p>
            <p className="font-mono text-[11px] text-white/40">{t.footer.tagline}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs text-white/55">{t.footer.availability}</p>
          <p className="font-mono text-[11px] text-white/35">{t.footer.stack}</p>
        </div>
        <div className="flex gap-5 text-sm text-white/55">
          <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          <a href="#tools" className="transition-colors hover:text-white">{t.footer.links.tools}</a>
          <a href="#showcase" className="transition-colors hover:text-white">{t.footer.links.demo}</a>
          <a href="#top" className="transition-colors hover:text-white">{t.footer.links.top}</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-center font-mono text-[11px] text-white/40">
        Built by OSmenik — AI visuals, landing pages, and product systems.
      </p>
    </footer>
  );
}
