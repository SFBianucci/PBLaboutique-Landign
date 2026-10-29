import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import {
  ArrowRight,
  ArrowUpDown,
  Car,
  Clock,
  Crosshair,
  Hash,
  KeyRound,
  Layers,
  Mail,
  MapPin,
  Phone,
  Plus,
  Star,
  SunDim,
} from 'lucide-react';
import { mountPhotoTour } from './PhotoTour';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const PHONE_LABEL = '11 5715-1222';
const WA = `https://wa.me/5491157151222?text=${encodeURIComponent('¡Hola! Quería hacer una consulta por un trabajo.')}`;
const TEL = 'tel:+541157151222';
const PHONE_FIXED_LABEL = '11 4482-6504';
const TEL_FIXED = 'tel:+541144826504';
const WA_EMPRESAS = `https://wa.me/5491157151222?text=${encodeURIComponent('¡Hola! Somos una empresa o concesionaria y queríamos hacer una consulta.')}`;
const IG = 'https://www.instagram.com/parabrisaslaboutique/';
const MAIL = 'parabrisaslaboutique@hotmail.com';
const ADDRESS = 'Cerrito 2399, Lomas del Mirador, La Matanza';
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Parabrisas La Boutique, Cerrito 2399, Lomas del Mirador')}`;
// ponytail: copiado a mano de la ficha de Google; actualizar si cambia
const RATING = { score: '4.7', count: 173 };

const SERVICES = [
  { icon: Car, title: 'Parabrisas y lunetas', text: 'Colocación y reemplazo de cristales delanteros y traseros.' },
  { icon: Layers, title: 'Cristales laterales', text: 'Puertas, ventiletes y demás piezas de cristalería automotor.' },
  { icon: Crosshair, title: 'Reparación de impactos', text: 'Tratamiento de impactos en parabrisas, según evaluación.' },
  { icon: KeyRound, title: 'Cerrajería', text: 'Cerraduras, llaves y mecanismos de apertura del vehículo.' },
  { icon: ArrowUpDown, title: 'Levantavidrios', text: 'Reparación y reemplazo de mecanismos alzacristales.' },
  { icon: SunDim, title: 'Polarizados', text: 'Colocación de láminas polarizadas.' },
  { icon: Hash, title: 'Grabados', text: 'Grabado de patente en todos los cristales.' },
];

const GLASS_BRANDS = ['Saint-Gobain Sekurit', 'Fuyao', 'XYG', 'Favicur', 'Cristem'];

const INSURERS = [
  'Allianz', 'Answer', 'ATM', 'La Caja', 'Chubb', 'Digna', 'Experta', 'La Equitativa', 'Federación Patronal',
  'Galeno', 'Galicia Seguros', 'La Holando', 'Meridional', 'Iaorana', 'Integrity', 'Mercantil Andina',
  'Metropol', 'Nación', 'Nivel', 'Paraná', 'Provincia', 'Providencia', 'Río Uruguay', 'Rivadavia',
  'Sancor', 'SMG', 'La Segunda', 'Segurcoop', 'San Cristóbal', 'Triunfo', 'Victoria', 'Zurich',
];

const STEPS = [
  { title: 'Nos contactás', text: 'Por WhatsApp o teléfono, con los datos de tu póliza o siniestro.' },
  { title: 'Coordinamos', text: 'Hablamos con la compañía y conseguimos el cristal con nuestros proveedores.' },
  { title: 'Colocamos', text: 'En el taller o a domicilio, según el trabajo. Muchas veces, en el día.' },
  { title: 'Garantía', text: 'Todos los trabajos tienen garantía sobre la mano de obra.' },
];


function useSection(offset: any = ['start start', 'end end']) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  // El suavizado lo pone Lenis. La función identidad evita la aceleración nativa de Motion
  // (ScrollTimeline), que ignora los rangos de useTransform con target + offset.
  const smooth = useTransform(scrollYProgress, (v) => v);
  return [ref, smooth] as const;
}

// Monta una escena three.js en el canvas. three se carga aparte para no frenar la primera pintura.
type Mount = (canvas: HTMLCanvasElement, progress: () => number) => () => void;
function useScene(canvas: RefObject<HTMLCanvasElement | null>, p: MotionValue<number>, load: () => Promise<Mount>) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let alive = true;
    load().then((mount) => {
      if (!alive) return;
      try {
        cleanup = mount(canvas.current!, () => p.get());
      } catch {
        // ponytail: sin WebGL queda el fondo blurreado de Backdrop, no hace falta otro fallback
      }
    });
    return () => {
      alive = false;
      cleanup?.();
    };
  }, [p]);
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-accent">
      <span className="h-px w-8 bg-accent" />
      {children}
    </span>
  );
}

function Backdrop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const x1 = useTransform(p, [0, 1], ['-20vw', '50vw']);
  const y1 = useTransform(p, [0, 1], ['-10vh', '70vh']);
  const x2 = useTransform(p, [0, 1], ['60vw', '-10vw']);
  const y2 = useTransform(p, [0, 1], ['50vh', '-10vh']);
  const imgScale = useTransform(p, [0, 1], [1.1, 1.5]);
  const imgOpacity = useTransform(p, [0, 0.2, 0.5, 0.8, 1], [0.35, 0.12, 0.22, 0.1, 0.25]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <motion.img
        src="/fondo-blur.webp"
        alt=""
        style={reduce ? { opacity: 0.18 } : { scale: imgScale, opacity: imgOpacity }}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      {/* Las luces van en capa propia (will-change): si no, al moverse obligan a redibujar todo el
          fondo en cada frame. Medido con scroll continuo: 12–17 ms → 7 ms por frame. */}
      <motion.div
        style={reduce ? undefined : { x: x1, y: y1 }}
        className="absolute h-[55vmax] w-[55vmax] bg-[radial-gradient(circle,rgb(61_220_132/0.16),transparent_65%)] will-change-transform"
      />
      <motion.div
        style={reduce ? undefined : { x: x2, y: y2 }}
        className="absolute h-[65vmax] w-[65vmax] bg-[radial-gradient(circle,rgb(0_91_46/0.5),transparent_65%)] will-change-transform"
      />
      <div className="grid-lines absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/80" />
    </div>
  );
}

function Nav() {
  const { scrollYProgress } = useScroll();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ scaleX: scrollYProgress }} className="h-0.5 origin-left bg-accent" />
      <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 glass backdrop-blur-xl md:mx-6 lg:mx-auto">
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-sm font-bold uppercase tracking-wider">
            Parabrisas <span className="text-accent">La Boutique</span>
          </span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-mute md:flex">
          <a href="#servicios" className="hover:text-white">Servicios</a>
          <a href="#taller" className="hover:text-white">El taller</a>
          <a href="#aseguradoras" className="hover:text-white">Aseguradoras</a>
          <a href="#contacto" className="hover:text-white">Contacto</a>
        </div>
        <a href={WA} target="_blank" rel="noopener" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink hover:brightness-110">
          WhatsApp
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const [ref, p] = useSection();
  const canvas = useRef<HTMLCanvasElement>(null);
  const contentO = useTransform(p, [0, 0.12], [1, 0]);
  const contentS = useTransform(p, [0, 0.15], [1, 0.9]);
  // sin filter: blur animado (obliga a redibujar el título entero en cada frame); sube y se desvanece
  const contentY = useTransform(p, [0, 0.15], [0, -60]);
  const msgO = useTransform(p, [0.2, 0.28, 0.5, 0.57], [0, 1, 1, 0]);
  const msgY = useTransform(p, [0.2, 0.28], [40, 0]);
  const fixO = useTransform(p, [0.42, 0.48], [0, 1]);
  const msg2O = useTransform(p, [0.7, 0.78, 0.88, 0.96], [0, 1, 1, 0]);
  const hintO = useTransform(p, [0, 0.03], [1, 0]);
  const sceneO = useTransform(p, [0.9, 1], [1, 0]); // funde a negro para empalmar con la trayectoria

  useScene(canvas, p, () => import('./GlassScene').then((m) => m.mountGlassScene));

  return (
    <section id="top" ref={ref} className="relative h-[450vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6">
        <motion.canvas ref={canvas} style={{ opacity: sceneO }} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink)_100%)]" />

        <motion.div style={{ opacity: contentO, scale: contentS, y: contentY }} className="relative max-w-5xl text-center will-change-[transform,opacity]">
          <motion.img
            src="/logo.svg"
            alt="Logo Parabrisas La Boutique"
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 h-20 w-20 md:h-24 md:w-24"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <Eyebrow>Cristalería y cerrajería automotor · Desde 1997</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-9xl"
          >
            Parabrisas
            <br />
            <span className="bg-gradient-to-r from-accent to-emerald-200 bg-clip-text text-transparent">La Boutique</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto mt-8 max-w-xl text-lg text-mute"
          >
            Parabrisas, lunetas, cristales laterales, cerrajería y levantavidrios. Taller cubierto en Lomas del Mirador,
            prestador de más de 30 aseguradoras.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a href={WA} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink hover:brightness-110">
              Pedí tu presupuesto <ArrowRight size={18} />
            </a>
            <a href={MAPS} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 glass hover:bg-white/10">
              <Star size={16} className="fill-accent text-accent" />
              {RATING.score} en Google · {RATING.count} reseñas
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: msgO, y: msgY }} className="pointer-events-none absolute bottom-[12%] max-w-4xl px-6 text-center will-change-[transform,opacity]">
          <p className="font-display text-5xl font-bold leading-tight md:text-7xl">Cada impacto tiene solución.</p>
          <motion.p style={{ opacity: fixO }} className="mt-4 text-xl text-accent md:text-2xl">
            Y la dejamos como nueva.
          </motion.p>
        </motion.div>

        <motion.div style={{ opacity: msg2O }} className="pointer-events-none absolute max-w-4xl px-6 text-center will-change-[opacity]">
          <p className="font-display text-5xl font-bold leading-tight md:text-7xl">Cristal por cristal,</p>
          <p className="mt-2 font-display text-5xl font-bold leading-tight text-accent md:text-7xl">desde 1997.</p>
        </motion.div>

        <motion.div style={{ opacity: hintO }} className="absolute bottom-8 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-mute">
          Deslizá
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-8 w-px bg-accent" />
        </motion.div>
      </div>
    </section>
  );
}

function Fade({ p, range, children, className = '' }: { p: MotionValue<number>; range: [number, number]; children: ReactNode; className?: string }) {
  const opacity = useTransform(p, range, [0.12, 1]);
  const y = useTransform(p, range, [24, 0]);
  return <motion.div style={{ opacity, y }} className={`will-change-[transform,opacity] ${className}`}>{children}</motion.div>;
}

// Dígito de odómetro: una tira 0–9–0 que se desplaza en continuo. Las unidades ruedan siempre;
// cada dígito superior solo rueda mientras el de abajo pasa de 9 a 0 (como un cuentakilómetros).
function Digit({ value, place }: { value: MotionValue<number>; place: number }) {
  const y = useTransform(value, (v) => {
    const whole = Math.floor(v / place) % 10;
    const roll = place === 1 ? v % 1 : Math.max(0, (v % place) - (place - 1));
    return `${-(whole + roll)}em`;
  });
  return (
    <span className="inline-block h-[1em] overflow-hidden">
      <motion.span style={{ y }} className="block will-change-transform">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <span key={i} className="block h-[1em]">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

function Trayectoria() {
  const [ref, p] = useSection();
  const year = useTransform(p, [0, 0.55], [1997, new Date().getFullYear()]);
  const years = useTransform(year, (v) => `${Math.floor(v) - 1997} años de oficio`);
  const bar = useTransform(p, [0, 0.55], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>Quiénes somos</Eyebrow>
            <div className="font-display text-8xl font-bold leading-none tracking-tighter tabular-nums sm:text-9xl">
              <span className="sr-only">Desde 1997</span>
              <span aria-hidden className="inline-flex">
                {[1000, 100, 10, 1].map((place) => (
                  <span key={place}>
                    <Digit value={year} place={place} />
                  </span>
                ))}
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-white/10">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-accent" />
            </div>
            <motion.p className="mt-4 text-lg text-accent">{years}</motion.p>
          </div>
          <div className="space-y-6 text-lg leading-relaxed md:text-xl">
            <Fade p={p} range={[0.1, 0.3]}>
              <p className="font-display text-3xl font-semibold leading-snug md:text-4xl">Una trayectoria construida en el oficio.</p>
            </Fade>
            <Fade p={p} range={[0.25, 0.45]}>
              <p className="text-mute">
                Desde 1997 acompañamos a particulares, empresas y aseguradoras en todo lo que tenga que ver con cristales y cerrajería del auto.
              </p>
            </Fade>
            <Fade p={p} range={[0.4, 0.6]}>
              <p className="text-mute">
                Escuchamos, evaluamos el trabajo y damos una solución acorde a cada caso. Así sostuvimos relaciones comerciales durante años.
              </p>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

function Servicios() {
  const card = (s: (typeof SERVICES)[number], i: number, copy: boolean) => (
    <article key={`${copy}-${s.title}`} aria-hidden={copy || undefined} className="pr-6">
      <div className="flex h-[22rem] w-[78vw] flex-col justify-between rounded-3xl p-8 glass transition-colors hover:bg-white/[0.07] md:w-[24rem]">
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <s.icon size={26} />
          </span>
          <span className="font-display text-5xl font-bold text-outline">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
          <p className="mt-3 text-mute">{s.text}</p>
        </div>
      </div>
    </article>
  );

  return (
    <section id="servicios" className="relative py-32">
      <div className="mx-auto mb-12 w-full max-w-6xl px-6">
        <Eyebrow>Servicios</Eyebrow>
        <h2 className="font-display text-4xl font-bold md:text-6xl">Todo lo que tu auto necesita en cristales.</h2>
      </div>
      {/* Cinta infinita: la lista va duplicada y la animación corre -50% (ver .marquee en index.css) */}
      <div className="marquee-mask overflow-hidden motion-reduce:overflow-x-auto">
        <div className="marquee flex w-max">
          {SERVICES.map((s, i) => card(s, i, false))}
          {SERVICES.map((s, i) => card(s, i, true))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6">
        <span className="text-xs uppercase tracking-[0.25em] text-mute">Cristales de primeras marcas</span>
        {GLASS_BRANDS.map((b) => (
          <span key={b} className="text-sm text-white/70">{b}</span>
        ))}
      </div>
    </section>
  );
}

function Taller() {
  const [ref, p] = useSection();
  const canvas = useRef<HTMLCanvasElement>(null);
  useScene(canvas, p, () => Promise.resolve(mountPhotoTour));
  // los tiempos de las fotos están en PhotoTour.ts (STEPS); acá solo los textos
  const titleO = useTransform(p, [0, 0.04, 0.08], [1, 1, 0]);
  const cap1 = useTransform(p, [0.09, 0.14, 0.28, 0.34], [0, 1, 1, 0]);
  const cap2 = useTransform(p, [0.4, 0.46, 0.88, 0.95], [0, 1, 1, 0]);
  const sceneO = useTransform(p, [0.95, 1], [1, 0]);

  return (
    <section id="taller" ref={ref} className="relative h-[640vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.canvas ref={canvas} role="img" aria-label="Recorrido por las fotos reales del taller: la esquina, el portón y el salón con el stock de cristales" style={{ opacity: sceneO }} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent via-45% to-transparent" />
        <motion.div style={{ opacity: titleO }} className="absolute inset-x-0 bottom-[9%] text-center will-change-[opacity]">
          <Eyebrow>El taller</Eyebrow>
          <h2 className="font-display text-5xl font-bold md:text-7xl">Vení a conocernos.</h2>
        </motion.div>
        <motion.div style={{ opacity: cap1 }} className="absolute inset-x-0 bottom-12 mx-auto max-w-6xl px-6 will-change-[opacity]">
          <Eyebrow>Lomas del Mirador</Eyebrow>
          <p className="max-w-2xl font-display text-4xl font-bold md:text-6xl">Cerrito 2399, en la esquina. Con entrada de vehículos.</p>
        </motion.div>
        <motion.div style={{ opacity: cap2 }} className="absolute inset-x-0 bottom-12 mx-auto max-w-6xl px-6 will-change-[opacity]">
          <Eyebrow>Por dentro</Eyebrow>
          <p className="max-w-2xl font-display text-4xl font-bold md:text-6xl">Taller cubierto y stock propio de cristales.</p>
        </motion.div>
      </div>
    </section>
  );
}

function Aseguradoras() {
  const [ref, p] = useSection(['start end', 'end start']);
  const x1 = useTransform(p, [0, 1], ['0%', '-35%']);
  const x2 = useTransform(p, [0, 1], ['-35%', '0%']);
  const half = Math.ceil(INSURERS.length / 2);
  const rows = [INSURERS.slice(0, half), INSURERS.slice(half)];

  return (
    <section id="aseguradoras" ref={ref} className="relative overflow-hidden py-32">
      <div className="mx-auto mb-16 max-w-6xl px-6">
        <Eyebrow>Aseguradoras</Eyebrow>
        <h2 className="max-w-3xl font-display text-4xl font-bold md:text-6xl">
          Prestadores de más de <span className="text-accent">30 compañías</span>.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-mute">
          Atendemos asegurados de forma directa y a través de intermediarios. Si tu seguro cubre cristales, coordinamos todo.
        </p>
      </div>
      {rows.map((row, r) => (
        <motion.div key={r} style={{ x: r ? x2 : x1 }} className="flex w-max gap-12 py-4 whitespace-nowrap will-change-transform">
          {[...row, ...row].map((name, i) => (
            <span key={i} className="font-display text-5xl font-bold uppercase text-outline transition-colors hover:text-accent md:text-7xl">
              {name}
            </span>
          ))}
        </motion.div>
      ))}
    </section>
  );
}

function Empresas() {
  return (
    <section className="relative px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl p-8 glass md:grid-cols-[1.4fr_1fr] md:p-14"
      >
        <div>
          <Eyebrow>Empresas y concesionarias</Eyebrow>
          <h2 className="font-display text-4xl font-bold md:text-5xl">También trabajamos para empresas y concesionarias.</h2>
          <p className="mt-5 max-w-xl text-lg text-mute">
            Si necesitás resolver cristales o cerrajería de tus vehículos, consultanos. Te respondemos por WhatsApp o por teléfono.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a href={WA_EMPRESAS} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink hover:brightness-110">
            Consultar por WhatsApp <ArrowRight size={18} />
          </a>
          <a href={TEL_FIXED} className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 glass hover:bg-white/10">
            <Phone size={18} className="text-accent" /> Llamar al {PHONE_FIXED_LABEL}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Proceso() {
  const [ref, p] = useSection(['start 0.7', 'end 0.6']);
  return (
    <section ref={ref} className="relative px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <div className="md:sticky md:top-32 md:self-start">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2 className="font-display text-4xl font-bold md:text-6xl">Del siniestro al auto listo, sin vueltas.</h2>
        </div>
        <ol className="relative space-y-16 pl-10">
          <span className="absolute left-0 top-2 h-full w-px bg-white/10" />
          <motion.span style={{ scaleY: p }} className="absolute left-0 top-2 h-full w-px origin-top bg-accent" />
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0.25, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: '-40% 0px -40% 0px' }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <span className="absolute -left-[2.85rem] top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-accent ring-1 ring-accent">
                {i + 1}
              </span>
              <h3 className="font-display text-3xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-lg text-mute">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FAQ = [
  { q: '¿Trabajan con mi seguro?', a: 'Somos prestadores de más de 30 aseguradoras, en forma directa o a través de intermediarios. Escribinos con los datos de tu póliza y te confirmamos cómo seguir según tu compañía.' },
  { q: '¿Trabajan con empresas y concesionarias?', a: 'Sí. Si tenés una empresa o una concesionaria y querés consultar, escribinos por WhatsApp o llamanos y lo vemos.' },
  { q: '¿Cuánto tarda el cambio de un parabrisas?', a: 'Muchos trabajos se resuelven en el día. Depende de que tengamos el cristal de tu vehículo en stock o de cuánto tarde en llegar.' },
  { q: '¿Se puede reparar un impacto sin cambiar el parabrisas?', a: 'Depende del tamaño y la ubicación del impacto. Lo evaluamos y te decimos si conviene reparar o reemplazar.' },
  { q: '¿Hacen trabajos a domicilio?', a: 'Sí, según el tipo de intervención. Algunos trabajos conviene hacerlos en el taller; te lo indicamos al coordinar.' },
  { q: '¿Los trabajos tienen garantía?', a: 'Sí. Todos los trabajos tienen garantía sobre la mano de obra.' },
  { q: '¿Qué horarios tienen?', a: 'Lunes a viernes de 8:30 a 12:30 y de 14 a 18. Sábados de 8:30 a 13. Estamos en Cerrito 2399, Lomas del Mirador.' },
];

function Preguntas() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="font-display text-4xl font-bold md:text-6xl">Lo que más nos consultan.</h2>
          <a href={WA} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 text-accent hover:brightness-125">
            ¿Otra duda? Escribinos <ArrowRight size={18} />
          </a>
        </div>
        <div className="border-t border-white/10">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold md:text-xl [&::-webkit-details-marker]:hidden">
                {q}
                <Plus size={20} className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="-mt-2 pb-6 pr-10 text-mute">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contacto() {
  const items = [
    { icon: Phone, label: 'Teléfono / WhatsApp', value: PHONE_LABEL, href: TEL },
    { icon: Phone, label: 'Línea fija', value: PHONE_FIXED_LABEL, href: TEL_FIXED },
    { icon: Mail, label: 'Correo', value: MAIL, href: `mailto:${MAIL}` },
    { icon: MapPin, label: 'Dirección', value: ADDRESS, href: MAPS },
    { icon: Clock, label: 'Horarios', value: 'Lun a vie 8:30–12:30 y 14–18 · Sáb 8:30–13', href: undefined },
  ];
  return (
    <section id="contacto" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <Eyebrow>Contacto</Eyebrow>
            <h2 className="font-display text-5xl font-bold md:text-7xl">Traé tu auto. Del resto nos ocupamos.</h2>
          </div>
          <a href={MAPS} target="_blank" rel="noopener" className="flex items-center gap-6 rounded-3xl p-8 glass hover:bg-white/[0.07]">
            <div className="font-display text-6xl font-bold">{RATING.score}</div>
            <div>
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} className="fill-accent" />)}
              </div>
              <p className="mt-2 text-mute">{RATING.count} reseñas en Google Maps</p>
            </div>
          </a>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {items.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <Icon size={20} className="mt-1 shrink-0 text-accent" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-mute">{label}</div>
                    <div className="mt-1 text-lg">{value}</div>
                  </div>
                </>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="flex gap-4 rounded-2xl p-5 glass hover:bg-white/[0.07]">
                  {body}
                </a>
              ) : (
                <div key={label} className="flex gap-4 rounded-2xl p-5 glass">{body}</div>
              );
            })}
            <div className="flex flex-wrap gap-3 pt-3">
              <a href={WA} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink hover:brightness-110">
                Escribinos por WhatsApp <ArrowRight size={18} />
              </a>
              <a href={IG} target="_blank" rel="noopener" className="rounded-xl px-6 py-3.5 glass hover:bg-white/10">
                @parabrisaslaboutique
              </a>
            </div>
          </div>
          <iframe
            title="Ubicación de Parabrisas La Boutique"
            src={`https://maps.google.com/maps?q=${encodeURIComponent('Cerrito 2399, Lomas del Mirador, Buenos Aires')}&z=16&output=embed`}
            loading="lazy"
            className="map min-h-[22rem] w-full rounded-3xl border border-white/10"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-mute">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span>© {new Date().getFullYear()} Parabrisas La Boutique · Gallo Silvina Lilian · CUIT 27-23222613-2</span>
        </div>
      </div>
    </footer>
  );
}

// Scroll suave con inercia (como sumar.dev): la rueda del mouse en Windows salta de a ~100px
// y las animaciones atadas al scroll avanzan a tirones. En touch queda el scroll nativo.
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    return () => lenis.destroy();
  }, []);
}

export default function App() {
  useSmoothScroll();
  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <Trayectoria />
        <Servicios />
        <Taller />
        <Aseguradoras />
        <Empresas />
        <Proceso />
        <Preguntas />
        <Contacto />
      </main>
      <Footer />
    </MotionConfig>
  );
}
