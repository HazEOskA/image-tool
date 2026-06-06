/**
 * Bilingual copy for NEONWERKS.
 *
 * Single source of truth for every translatable string. Both language
 * bundles follow the same shape, so components read e.g. `t.hero.title`
 * regardless of the active language.
 *
 * Brand names ("NEONWERKS", "STRING TUNE", "ASTRODITHER", "SMOOTHIE",
 * "AI PARTICLE SIMULATOR") and universal technical jargon ("GLSL",
 * "Bayer 4×4", "Simplex noise", "textPath") stay in English on purpose.
 */

export type Lang = 'en' | 'pl';

type Tuple2 = readonly [string, string];

export interface Copy {
  langName: { en: string; pl: string };
  nav: {
    overview: string;
    builds: string;
    tools: string;
    demo: string;
    launch: string;
    toggleAria: string;
  };
  hero: {
    badge: string;
    titleA: string;
    titleB: string;
    titleC: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    stats: readonly [Tuple2, Tuple2, Tuple2];
  };
  overview: {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly { title: string; body: string }[];
    values: readonly Tuple2[];
  };
  builds: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly { title: string; body: string }[];
    cta: string;
    featured: {
      tag: string;
      title: string;
      body: string;
      cta: string;
    };
  };
  dropBuilder: {
    eyebrow: string;
    title: string;
    subhead: string;
    pickerLabel: string;
    previewLabel: string;
    deliverablesLabel: string;
    deliverables: readonly [string, string, string, string];
    followupTitle: string;
    followupBody: string;
    followupCta: string;
    selectAria: string;
    selectedHint: string;
  };
  liveProof: {
    eyebrow: string;
    title: string;
    body: string;
    badge: string;
    panelLabel: string;
    points: readonly [string, string, string];
    /** Three module readouts shown as live progress bars in the console. */
    modules: readonly [string, string, string];
    cardCaption: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Strings for the interactive pipeline-graph mini-app. */
    graph: {
      interact: string;
      inspector: string;
      reset: string;
      zoomInAria: string;
      zoomOutAria: string;
      empty: string;
      core: string;
      coreDesc: string;
      throughput: string;
      load: string;
      tags: string;
      statNodes: string;
      statZoom: string;
      statLinks: string;
      selected: string;
      canvasAria: string;
    };
  };
  neonBot: {
    aria: string;
    hint: string;
    tourLabel: string;
    stations: readonly { id: string; name: string; tip: string }[];
    bubble: {
      greeting: string;
      leaveMessage: string;
      showTools: string;
      close: string;
      mailSubject: string;
    };
  };
  pipeline: {
    eyebrow: string;
    title: string;
    description: string;
    liveTag: string;
    cards: {
      stringTune: { concept: string; tags: readonly string[] };
      astrodither: { concept: string; tags: readonly string[] };
      smoothie: { concept: string; tags: readonly string[] };
      particles: { concept: string; tags: readonly string[] };
    };
  };
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    features: readonly Tuple2[];
  };
  laptop: {
    badge: string;
    titleA: string;
    titleB: string;
    body: string;
    btnPrimary: string;
    btnSecondary: string;
    legend: readonly [string, string, string, string];
  };
  cta: {
    badge: string;
    titleA: string;
    titleB: string;
    body: string;
    primary: string;
    secondary: string;
    mailSubject: string;
    mailBody: string;
    specs: readonly Tuple2[];
  };
  footer: {
    tagline: string;
    availability: string;
    stack: string;
    links: { tools: string; demo: string; top: string };
  };
}

const en: Copy = {
  langName: { en: 'English', pl: 'Polski' },
  nav: {
    overview: 'Overview',
    builds: 'Builds',
    tools: 'Tools',
    demo: 'Live Demo',
    launch: 'Launch App',
    toggleAria: 'Switch language',
  },
  hero: {
    badge: 'Premium Motion Web Design',
    titleA: 'Premium ',
    titleB: 'Motion Websites',
    titleC: ' & Interactive Demos',
    subhead:
      'NEONWERKS designs and builds premium interactive websites, product demos and motion landing pages — turning static pages into experiences people actually remember.',
    ctaPrimary: 'View Live Demo',
    ctaSecondary: 'See What We Build',
    scroll: 'Scroll',
    stats: [
      ['60', 'FPS fluid motion'],
      ['4', 'Signature tools'],
      ['100%', 'Custom-built'],
    ],
  },
  overview: {
    eyebrow: 'What is NEONWERKS',
    title: 'A motion studio, not just another website',
    description:
      'NEONWERKS is a custom visual pipeline for premium interactive websites. We design the look, animate it around your visitor, and ship a fast, polished site — so your product feels as considered as it actually is.',
    steps: [
      {
        title: 'Design',
        body: 'We start with your brand and story, then shape a visual system — type, color, 3D and motion that all belong to the same world.',
      },
      {
        title: 'Animate',
        body: 'Every element comes alive and reacts to the visitor: type tunes to the cursor, textures shift, 3D follows the pointer and particles respond on contact.',
      },
      {
        title: 'Ship',
        body: 'You get a fast, responsive site engineered to stay smooth at 60 FPS — production-ready code that deploys anywhere, no platform lock-in.',
      },
    ],
    values: [
      ['One coherent experience', 'Type, color, motion and 3D share a single design system, so the whole site reads as one premium experience — not a pile of disconnected effects.'],
      ['Built for 60 FPS', 'The motion runs close to the metal, so interactions stay fluid even with thousands of live particles moving on screen.'],
      ['Custom visual craft', 'Real custom shaders and motion built for your brand — not a recycled template or an off-the-shelf animation pack.'],
      ['Sharp on every screen', 'Looks crisp and runs well everywhere, from ultrawide displays down to phones, with layouts that adapt automatically.'],
    ],
  },
  builds: {
    eyebrow: 'What we build',
    title: 'What You Can Build With NEONWERKS',
    description:
      "Whatever you're launching, NEONWERKS can turn it into a premium interactive experience. These are five of the things we build most — find the closest fit to what you need.",
    items: [
      { title: 'Animated Landing Page', body: 'A premium launch page for products, portfolios and creators — a first impression that lands and stays.' },
      { title: 'Interactive Product Demo', body: 'Turn your product or workflow into a visual, explorable demo that sells it better than any video.' },
      { title: 'AI / SaaS Launch Page', body: 'Make complex software feel clear and trustworthy, with motion that guides attention to what matters.' },
      { title: 'Web3 Visual Experience', body: 'Futuristic launch pages, token dashboards and ecosystem explainers that actually earn attention.' },
      { title: 'Creator / Music Portfolio', body: 'A cinematic personal site for artists, producers and creative brands — built to be felt, not skimmed.' },
    ],
    cta: 'Explore the pipeline',
    featured: {
      tag: 'Case study · Streetwear drop',
      title: 'NIGHTSHIFT SUPPLY — NS-01 Heavy Hoodie',
      body: 'See how a single clothing drop becomes a cinematic landing page with visuals, motion and social-ready launch assets.',
      cta: 'View case study',
    },
  },
  dropBuilder: {
    eyebrow: 'Try it now',
    title: 'Build your streetwear drop in 10 seconds',
    subhead:
      'Pick a vibe. See the launch page direction. Send your product. We build the landing, visuals, and promo assets.',
    pickerLabel: 'Pick a vibe',
    previewLabel: 'Launch page preview',
    deliverablesLabel: 'Included in every drop',
    deliverables: [
      'Landing page',
      'Product visuals',
      'Social promo assets',
      'Mobile-first launch page',
    ],
    followupTitle: 'Want this for your brand?',
    followupBody: 'Send the product. We handle the look, the motion, and the launch assets.',
    followupCta: 'Build my drop',
    selectAria: 'Drop style',
    selectedHint: 'Selected',
  },
  liveProof: {
    eyebrow: 'Live Proof',
    title: 'Live Proof: Interactive Pipeline Graph',
    body:
      'Not a mockup. Not a screenshot. This is a real, running mini-app wiring the four NEONWERKS tools to one engine. Drag the canvas, zoom, and click any node — the inspector and connections react live, the same motion engineering we ship into client builds.',
    badge: 'Live · deployed on Vercel',
    panelLabel: "What you're looking at",
    points: [
      'A fully deployed interactive portfolio — live in production, not a static image.',
      'Control-brain style interface: connected nodes, motion and real-time interaction.',
      'Built with the same pipeline behind every NEONWERKS landing page.',
    ],
    modules: ['Interactive brain', 'Motion engineering', 'Deploy pipeline'],
    cardCaption: 'Real-time interactive system · not a static mockup',
    ctaPrimary: 'Open Live Demo',
    ctaSecondary: 'Build My Visual System',
    graph: {
      interact: 'Drag canvas · scroll to zoom · click a node',
      inspector: 'Tool inspector',
      reset: 'Reset view',
      zoomInAria: 'Zoom in',
      zoomOutAria: 'Zoom out',
      empty: 'Click any node to inspect a live tool',
      core: 'NEON ENGINE',
      coreDesc: 'Shared 60 FPS render core — every tool plugs into one rAF loop.',
      throughput: 'Throughput',
      load: 'GPU load',
      tags: 'Pipeline',
      statNodes: 'Nodes',
      statZoom: 'Zoom',
      statLinks: 'Links',
      selected: 'Selected',
      canvasAria: 'Interactive pipeline graph — drag to pan, scroll to zoom, click a node to inspect it.',
    },
  },
  neonBot: {
    aria: 'NEON BOT — interactive guide. Press and drag it to a tool, or tap to open a message.',
    hint: 'Drag me to a tool · or tap to chat',
    tourLabel: 'Touring the pipeline…',
    stations: [
      { id: 'visual-generator', name: 'Visual Generator', tip: 'We create the first product look.' },
      { id: 'motion-scene', name: 'Motion Scene', tip: 'We add cinematic movement.' },
      { id: 'landing-builder', name: 'Landing Builder', tip: 'We turn the vibe into a launch page.' },
      { id: 'launch-exporter', name: 'Launch Asset Exporter', tip: 'We export promo assets for social.' },
    ],
    bubble: {
      greeting:
        'Hello! This site is owned by OSmenik. Want to cooperate or build something visual, AI-powered, or custom? Leave a message or use the contact form.',
      leaveMessage: 'Leave a message',
      showTools: 'Show me the tools',
      close: 'Close',
      mailSubject: "NEONWERKS — let's cooperate",
    },
  },
  pipeline: {
    eyebrow: 'The Pipeline',
    title: 'Four Tools. One Workflow.',
    description:
      'Each module is a live WebGL simulation. Hover any card to interact — typography tunes to your cursor, shaders dither in real time, the fluid blob chases your pointer, and particles scatter on contact.',
    liveTag: 'live · interactive',
    cards: {
      stringTune: {
        concept: 'Kinetic Typography',
        tags: ['Sine paths', 'textPath', 'Hover-reactive'],
      },
      astrodither: {
        concept: 'Dither Shader',
        tags: ['GLSL', 'Bayer 4×4', 'Low-poly'],
      },
      smoothie: {
        concept: 'Fluid Interpolation',
        tags: ['Lerp damping', 'Simplex noise', 'Morphing mesh'],
      },
      particles: {
        concept: 'Particle Emitter',
        tags: ['3,400 points', 'Repulsion field', 'Additive glow'],
      },
    },
  },
  showcase: {
    eyebrow: 'Live Showcase',
    title: 'All Four Tools, One Surface',
    description:
      'The complete pipeline rendered live — a fluid 3D object from Smoothie, dithered shapes from Astrodither, kinetic particle streams from the Simulator, and typography tuned by String Tune. Move your cursor over the screen to interact.',
    features: [
      ['Performance-first', 'rAF-driven loops & useRef mutation keep React out of the render path — steady 60 FPS.'],
      ['Fully responsive', 'Adaptive DPR, fluid grids and live-measured connectors from mobile to ultrawide.'],
      ['Production GLSL', 'Hand-written simplex noise, Bayer dithering and additive particle shaders — no placeholders.'],
    ],
  },
  laptop: {
    badge: 'Live · v2.0',
    titleA: 'Design',
    titleB: 'in motion.',
    body: 'Typography, shaders, fluid 3D and particles — composed into one interactive surface that reacts to every cursor move.',
    btnPrimary: 'Launch demo',
    btnSecondary: 'View code',
    legend: ['String Tune', 'Astrodither', 'Smoothie', 'Particles'],
  },
  cta: {
    badge: 'Ready when you are',
    titleA: 'Ready to build ',
    titleB: 'in motion?',
    body:
      "Have a launch, a product or a portfolio that deserves more than a static page? Let's build a premium animated site or interactive demo — designed and engineered end to end.",
    primary: 'Start a Motion Build',
    secondary: 'View Interactive Demo',
    mailSubject: 'NEONWERKS Motion Build Inquiry',
    mailBody:
      "Hi — I'd like to talk about a motion website / interactive demo.\n\nProject:\nTimeline:\nBudget range:\n\nThanks!",
    specs: [
      ['Custom', 'Designed + built'],
      ['60 FPS', 'Buttery smooth'],
      ['Motion', 'First-class'],
      ['Fast', 'Production-ready'],
    ],
  },
  footer: {
    tagline: 'Premium Motion Web Design',
    availability:
      'Available for custom motion builds, interactive demos & web experiments.',
    stack: 'Crafted with React · Three.js · Framer Motion · Tailwind',
    links: { tools: 'Tools', demo: 'Demo', top: 'Top' },
  },
};

const pl: Copy = {
  langName: { en: 'English', pl: 'Polski' },
  nav: {
    overview: 'O projekcie',
    builds: 'Realizacje',
    tools: 'Narzędzia',
    demo: 'Live demo',
    launch: 'Zacznij Motion Build',
    toggleAria: 'Zmień język',
  },
  hero: {
    badge: 'Premium Motion Web Design',
    titleA: 'Premium animowane ',
    titleB: 'strony i interaktywne',
    titleC: ' demo produktów',
    subhead:
      'NEONWERKS tworzy premium animowane strony, interaktywne prezentacje produktów i motion landing pages, które wyglądają jak żywy produkt — nie jak zwykły szablon.',
    ctaPrimary: 'Zobacz demo na żywo',
    ctaSecondary: 'Zobacz, co budujemy',
    scroll: 'Przewiń',
    stats: [
      ['60', 'FPS płynnej animacji'],
      ['4', 'autorskie narzędzia'],
      ['100%', 'szyte na miarę'],
    ],
  },
  overview: {
    eyebrow: 'Czym jest NEONWERKS',
    title: 'Studio motion design, a nie kolejny szablon strony',
    description:
      'NEONWERKS to autorski proces tworzenia premium interaktywnych stron. Projektujemy wygląd, animujemy go wokół odwiedzającego i wdrażamy szybki, dopracowany serwis — żeby Twój produkt wyglądał tak dobrze, jak naprawdę działa.',
    steps: [
      {
        title: 'Projekt',
        body: 'Zaczynamy od Twojej marki i historii, a potem składamy spójny język wizualny — typografię, kolor, 3D i ruch, które należą do jednego świata.',
      },
      {
        title: 'Animacja',
        body: 'Każdy element ożywa i reaguje na odwiedzającego: tekst dostraja się do kursora, tekstury się zmieniają, 3D podąża za myszką, a cząstki reagują na dotyk.',
      },
      {
        title: 'Wdrożenie',
        body: 'Dostajesz szybki, responsywny serwis utrzymujący płynne 60 FPS — gotowy do wdrożenia kod, który postawisz gdziekolwiek, bez uwięzienia w platformie.',
      },
    ],
    values: [
      ['Jedno spójne doświadczenie', 'Typografia, kolor, ruch i 3D dzielą jeden system projektowy, więc cały serwis czyta się jak jedno premium doświadczenie — nie zbiór luźnych efektów.'],
      ['Zaprojektowane na 60 FPS', 'Animacja działa blisko sprzętu, więc interakcje są płynne nawet przy tysiącach cząstek poruszających się na żywo.'],
      ['Autorska oprawa wizualna', 'Prawdziwe, dedykowane shadery i ruch tworzone pod Twoją markę — nie odgrzewany szablon ani gotowy pakiet animacji.'],
      ['Ostry na każdym ekranie', 'Wygląda i działa dobrze wszędzie — od ultrawide po telefony — z układami, które dopasowują się automatycznie.'],
    ],
  },
  builds: {
    eyebrow: 'Co budujemy',
    title: 'Co możesz zbudować z NEONWERKS',
    description:
      'Cokolwiek wprowadzasz na rynek, NEONWERKS zamieni to w premium interaktywne doświadczenie. Oto pięć rzeczy, które budujemy najczęściej — wybierz najbliższą temu, czego potrzebujesz.',
    items: [
      { title: 'Animowana strona startowa', body: 'Premium landing page dla produktów, portfolio i twórców — pierwsze wrażenie, które trafia i zostaje.' },
      { title: 'Interaktywne demo produktu', body: 'Zamień produkt lub workflow w wizualne, klikalne demo, które sprzedaje lepiej niż każde wideo.' },
      { title: 'Strona startowa AI / SaaS', body: 'Pokaż złożone oprogramowanie z klarownością i zaufaniem — ruch prowadzi uwagę tam, gdzie trzeba.' },
      { title: 'Web3 — wizualne doświadczenie', body: 'Futurystyczne landingi, dashboardy tokenów i wyjaśnienia ekosystemów, które realnie zatrzymują uwagę.' },
      { title: 'Portfolio twórcy / muzyka', body: 'Kinowa osobista strona dla artystów, producentów i marek kreatywnych — zbudowana tak, żeby się ją czuło.' },
    ],
    cta: 'Zobacz proces',
    featured: {
      tag: 'Case study · Drop streetwear',
      title: 'NIGHTSHIFT SUPPLY — NS-01 Heavy Hoodie',
      body: 'Zobacz, jak pojedynczy drop ubraniowy staje się kinową landing page z wizualami, animacją i gotowymi materiałami na social media.',
      cta: 'Zobacz case study',
    },
  },
  dropBuilder: {
    eyebrow: 'Wypróbuj teraz',
    title: 'Zbuduj swój drop streetwear w 10 sekund',
    subhead:
      'Wybierz klimat. Zobacz kierunek landing page. Wyślij produkt. My budujemy stronę, wizualizacje i materiały promo.',
    pickerLabel: 'Wybierz klimat',
    previewLabel: 'Podgląd landing page',
    deliverablesLabel: 'W każdym dropie',
    deliverables: [
      'Strona landing',
      'Wizualizacje produktu',
      'Materiały na social media',
      'Mobile-first launch page',
    ],
    followupTitle: 'Chcesz tego dla swojej marki?',
    followupBody: 'Wyślij produkt. My ogarniamy wygląd, animację i materiały launchowe.',
    followupCta: 'Zbuduj mój drop',
    selectAria: 'Styl dropu',
    selectedHint: 'Wybrany',
  },
  liveProof: {
    eyebrow: 'Dowód na żywo',
    title: 'Dowód na żywo: interaktywny graf pipeline',
    body:
      'To nie mockup ani zrzut ekranu. To prawdziwa, działająca mini-aplikacja łącząca cztery narzędzia NEONWERKS z jednym silnikiem. Przeciągaj kanwę, przybliżaj i klikaj węzły — inspektor i połączenia reagują na żywo, na tej samej inżynierii ruchu, którą wdrażamy u klientów.',
    badge: 'Live · wdrożone na Vercel',
    panelLabel: 'Na co patrzysz',
    points: [
      'W pełni wdrożone interaktywne portfolio — żywe na produkcji, nie statyczny obrazek.',
      'Interfejs w stylu control-brain: połączone węzły, ruch i interakcja w czasie rzeczywistym.',
      'Zbudowane na tym samym pipeline, co każda landing page NEONWERKS.',
    ],
    modules: ['Interaktywny mózg', 'Inżynieria ruchu', 'Pipeline wdrożeń'],
    cardCaption: 'System interaktywny w czasie rzeczywistym · nie statyczny mockup',
    ctaPrimary: 'Otwórz demo na żywo',
    ctaSecondary: 'Zbuduj mój system wizualny',
    graph: {
      interact: 'Przeciągaj kanwę · scroll = zoom · kliknij węzeł',
      inspector: 'Inspektor narzędzia',
      reset: 'Resetuj widok',
      zoomInAria: 'Przybliż',
      zoomOutAria: 'Oddal',
      empty: 'Kliknij dowolny węzeł, żeby podejrzeć narzędzie na żywo',
      core: 'NEON ENGINE',
      coreDesc: 'Wspólny rdzeń renderu 60 FPS — każde narzędzie wpina się w jedną pętlę rAF.',
      throughput: 'Przepustowość',
      load: 'Obciążenie GPU',
      tags: 'Pipeline',
      statNodes: 'Węzły',
      statZoom: 'Zoom',
      statLinks: 'Połączenia',
      selected: 'Wybrany',
      canvasAria: 'Interaktywny graf pipeline — przeciągaj, żeby przesuwać, scroll, żeby przybliżać, kliknij węzeł, żeby go podejrzeć.',
    },
  },
  neonBot: {
    aria: 'NEON BOT — interaktywny przewodnik. Przeciągnij go do narzędzia albo dotknij, żeby otworzyć wiadomość.',
    hint: 'Przeciągnij mnie do narzędzia · lub dotknij, by napisać',
    tourLabel: 'Tour po pipeline…',
    stations: [
      { id: 'visual-generator', name: 'Visual Generator', tip: 'Tworzymy pierwszy wygląd produktu.' },
      { id: 'motion-scene', name: 'Motion Scene', tip: 'Dodajemy kinowy ruch.' },
      { id: 'landing-builder', name: 'Landing Builder', tip: 'Zamieniamy klimat w landing page.' },
      { id: 'launch-exporter', name: 'Launch Asset Exporter', tip: 'Eksportujemy materiały promo na social media.' },
    ],
    bubble: {
      greeting:
        'Cześć! Tę stronę prowadzi OSmenik. Chcesz współpracować albo zbudować coś wizualnego, opartego na AI lub custom? Zostaw wiadomość lub użyj formularza kontaktowego.',
      leaveMessage: 'Zostaw wiadomość',
      showTools: 'Pokaż narzędzia',
      close: 'Zamknij',
      mailSubject: 'NEONWERKS — współpraca',
    },
  },
  pipeline: {
    eyebrow: 'Pipeline',
    title: 'Cztery narzędzia. Jeden proces.',
    description:
      'Każdy moduł to żywa symulacja WebGL. Najedź na dowolną kartę, żeby wejść w interakcję — typografia dostraja się do kursora, shadery dithering w czasie rzeczywistym, płynna kropla goni wskaźnik, a cząstki rozpryskują się przy kontakcie.',
    liveTag: 'live · interaktywne',
    cards: {
      stringTune: {
        concept: 'Kinetyczna typografia',
        tags: ['Krzywe sinusoidalne', 'textPath', 'Reaguje na hover'],
      },
      astrodither: {
        concept: 'Shader dithering',
        tags: ['GLSL', 'Bayer 4×4', 'Low-poly'],
      },
      smoothie: {
        concept: 'Płynna interpolacja',
        tags: ['Lerp damping', 'Simplex noise', 'Morphing mesh'],
      },
      particles: {
        concept: 'Emitter cząstek',
        tags: ['3 400 punktów', 'Pole odpychania', 'Glow addytywny'],
      },
    },
  },
  showcase: {
    eyebrow: 'Live showcase',
    title: 'Cztery narzędzia, jedna powierzchnia',
    description:
      'Pełny pipeline na żywo — płynny obiekt 3D z Smoothie, ditherowane kształty z Astrodither, kinetyczne strumienie cząstek z Simulatora i typografia dostrajana przez String Tune. Najedź kursorem na ekran, żeby wejść w interakcję.',
    features: [
      ['Wydajność na pierwszym miejscu', 'Pętle rAF i mutacja przez useRef trzymają Reacta poza ścieżką renderu — stabilne 60 FPS.'],
      ['W pełni responsywne', 'Adaptacyjne DPR, płynne siatki i łączniki mierzone na żywo — od mobile po ultrawide.'],
      ['Produkcyjny GLSL', 'Własnoręczny simplex noise, dithering Bayer i addytywne shadery cząstek — bez zaślepek.'],
    ],
  },
  laptop: {
    badge: 'Live · v2.0',
    titleA: 'Design',
    titleB: 'w ruchu.',
    body: 'Typografia, shadery, płynne 3D i cząstki — złożone w jedną interaktywną powierzchnię, która reaguje na każdy ruch kursora.',
    btnPrimary: 'Otwórz demo',
    btnSecondary: 'Zobacz kod',
    legend: ['String Tune', 'Astrodither', 'Smoothie', 'Cząstki'],
  },
  cta: {
    badge: 'Gotowi, kiedy ty',
    titleA: 'Gotów na ',
    titleB: 'animowaną stronę?',
    body:
      'Masz launch, produkt albo portfolio, które zasługuje na coś więcej niż statyczną stronę? Zbudujmy razem premium animowany serwis lub interaktywne demo — od projektu po wdrożenie.',
    primary: 'Zacznij Motion Build',
    secondary: 'Zobacz interaktywne demo',
    mailSubject: 'NEONWERKS — zapytanie o animowaną stronę',
    mailBody:
      'Cześć — chciał(a)bym porozmawiać o animowanej stronie / interaktywnym demo.\n\nProjekt:\nTermin:\nBudżet:\n\nDzięki!',
    specs: [
      ['Custom', 'Projekt + kod'],
      ['60 FPS', 'Aksamitnie płynne'],
      ['Motion', 'Na pierwszym planie'],
      ['Szybko', 'Gotowe do wdrożenia'],
    ],
  },
  footer: {
    tagline: 'Premium Motion Web Design',
    availability:
      'Dostępny do realizacji motion buildów, interaktywnych demo i eksperymentów webowych.',
    stack: 'Zbudowane z React · Three.js · Framer Motion · Tailwind',
    links: { tools: 'Narzędzia', demo: 'Demo', top: 'Góra' },
  },
};

export const copy: Record<Lang, Copy> = { en, pl };
