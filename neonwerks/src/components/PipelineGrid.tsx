import { useRef } from 'react';
import SectionHeading from './ui/SectionHeading';
import ConnectingLines from './ConnectingLines';
import StringTuneCard from './cards/StringTuneCard';
import AstroditherCard from './cards/AstroditherCard';
import SmoothieCard from './cards/SmoothieCard';
import ParticleSimulatorCard from './cards/ParticleSimulatorCard';
import { useLang } from '../i18n';

export default function PipelineGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const c0 = useRef<HTMLDivElement>(null);
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);
  const itemRefs = [c0, c1, c2, c3];
  const { t } = useLang();

  return (
    <section id="tools" className="relative mx-auto max-w-7xl px-6 py-24">
      <div id="process" className="mb-14 flex flex-col items-center">
        <SectionHeading
          eyebrow={t.pipeline.eyebrow}
          title={t.pipeline.title}
          description={t.pipeline.description}
        />
      </div>

      <div className="relative">
        <ConnectingLines containerRef={gridRef} itemRefs={itemRefs} />
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          <div ref={c0} data-tool-id="visual-generator">
            <StringTuneCard />
          </div>
          <div ref={c1} data-tool-id="motion-scene">
            <AstroditherCard />
          </div>
          <div ref={c2} data-tool-id="landing-builder">
            <SmoothieCard />
          </div>
          <div ref={c3} data-tool-id="launch-exporter">
            <ParticleSimulatorCard />
          </div>
        </div>
      </div>
    </section>
  );
}
