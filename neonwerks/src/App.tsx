import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Builds from './components/Builds';
import PipelineGrid from './components/PipelineGrid';
import LiveShowcase from './components/showcase/LiveShowcase';
import LaunchCTA from './components/LaunchCTA';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Builds />
        <PipelineGrid />
        <LiveShowcase />
        <LaunchCTA />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink">
            <span className="h-3 w-3 rounded-full bg-ink-950" />
          </span>
          <div>
            <p className="text-sm font-extrabold tracking-[0.2em] text-white">NEONWERKS</p>
            <p className="font-mono text-[11px] text-white/40">Premium Motion Web Design</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs text-white/55">
            Available for custom motion builds, interactive demos &amp; web experiments.
          </p>
          <p className="font-mono text-[11px] text-white/35">
            Crafted with React · Three.js · Framer Motion · Tailwind
          </p>
        </div>
        <div className="flex gap-5 text-sm text-white/55">
          <a href="#tools" className="transition-colors hover:text-white">Tools</a>
          <a href="#showcase" className="transition-colors hover:text-white">Demo</a>
          <a href="#top" className="transition-colors hover:text-white">Top</a>
        </div>
      </div>
    </footer>
  );
}
