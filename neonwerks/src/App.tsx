import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PipelineGrid from './components/PipelineGrid';
import LiveShowcase from './components/showcase/LiveShowcase';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <PipelineGrid />
        <LiveShowcase />
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
            <p className="font-mono text-[11px] text-white/40">3D Creative Pipeline</p>
          </div>
        </div>
        <p className="font-mono text-xs text-white/40">
          Built with React · Three.js · Framer Motion · Tailwind
        </p>
        <div className="flex gap-5 text-sm text-white/55">
          <a href="#tools" className="transition-colors hover:text-white">Tools</a>
          <a href="#showcase" className="transition-colors hover:text-white">Demo</a>
          <a href="#top" className="transition-colors hover:text-white">Top</a>
        </div>
      </div>
    </footer>
  );
}
