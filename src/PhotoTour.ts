// Recorrido por fotos reales del taller. El scroll mueve la "cámara": cada tramo hace zoom/paneo
// de una foto hacia la siguiente y las mezcla. Las fotos se alinearon con puntos en común
// (x_B = a·x_A + d), así la mezcla se lee como movimiento y no como un fundido plano.
// Dibuja solo cuando cambia el scroll o el tamaño.

const W = 1280;
const H = 960; // marco lógico de las fotos (4:3); los números de abajo están en este marco
const INK = '#070908';

const FRAMES = Array.from({ length: 12 }, (_, i) => `/taller/${i + 1}.webp`);

// Ruta (en orden de las fotos): la calle, el portón, y adentro un barrido a la izquierda y la vuelta a la derecha.
// Tramo = de FRAMES[from] a FRAMES[to] mientras el scroll (0..1) está en `at`. Van uno detrás del otro, sin pausas;
// la duración de cada uno es proporcional a cuánto se mueve la cámara, así la velocidad es pareja.
// fit = [a, dx, dy] con dx y dy normalizados a W y H (x_B = a·x_A + d).
const STEPS: { from: number; to: number; at: [number, number]; fit: [number, number, number] }[] = [
  { from: 0, to: 1, at: [0.05, 0.132], fit: [1.2554, -0.0933, -0.2076] }, // 5 → 6
  { from: 1, to: 2, at: [0.132, 0.186], fit: [1.1777, -0.1028, -0.0717] }, // 6 → 7
  { from: 2, to: 3, at: [0.186, 0.405], fit: [2.5000, -0.8516, -0.8281] }, // 7 → 45
  { from: 3, to: 4, at: [0.405, 0.443], fit: [1.0053, 0.3052, -0.0387] }, // 45 → 46
  { from: 4, to: 5, at: [0.443, 0.544], fit: [1.2780, 0.3255, -0.1281] }, // 46 → 47
  { from: 5, to: 4, at: [0.544, 0.638], fit: [0.7732, -0.2444, 0.1088] }, // 47 → 46
  { from: 4, to: 3, at: [0.638, 0.679], fit: [0.9734, -0.2891, 0.0483] }, // 46 → 45
  { from: 3, to: 6, at: [0.679, 0.735], fit: [1.1883, -0.0468, -0.1101] }, // 45 → 48
  { from: 6, to: 7, at: [0.735, 0.772], fit: [1.0224, -0.0740, -0.0639] }, // 48 → 49
  { from: 7, to: 8, at: [0.772, 0.809], fit: [1.0854, -0.0575, -0.0136] }, // 49 → 50
  { from: 8, to: 9, at: [0.809, 0.846], fit: [1.0690, -0.0562, 0.0021] }, // 50 → 51
  { from: 9, to: 10, at: [0.846, 0.893], fit: [1.0986, -0.1972, -0.0253] }, // 51 → 54
  { from: 10, to: 11, at: [0.893, 0.93], fit: [1.0434, -0.0854, -0.0460] }, // 54 → 55
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

// Copia de la foto con los bordes que se desvanecen: la foto que entra no deja ver su rectángulo.
function feather(img: HTMLImageElement) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext('2d')!;
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = 'destination-in';
  for (const [w, h] of [[c.width, 0], [0, c.height]]) {
    const g = x.createLinearGradient(0, 0, w, h);
    const e = 0.07;
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(e, 'rgba(0,0,0,1)');
    g.addColorStop(1 - e, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, c.width, c.height);
  }
  return c;
}

export function mountPhotoTour(canvas: HTMLCanvasElement, progress: () => number) {
  const ctx = canvas.getContext('2d')!;
  let dirty = true;
  const imgs = FRAMES.map((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => (dirty = true);
    img.src = src;
    return img;
  });
  const soft: (HTMLCanvasElement | undefined)[] = [];
  // si una foto todavía no cargó se usa la más cercana que sí
  const ready = (k: number) => imgs[k]?.complete && imgs[k].naturalWidth > 0;
  const get = (i: number) => {
    for (let d = 0; d < imgs.length; d++) {
      if (ready(i - d)) return { img: imgs[i - d], i: i - d };
      if (ready(i + d)) return { img: imgs[i + d], i: i + d };
    }
    return null;
  };

  // fondo borroso para pantallas verticales: la foto se muestra entera y el resto es su propio desenfoque
  const tiny = document.createElement('canvas');
  tiny.width = 48;
  tiny.height = 36;
  const tctx = tiny.getContext('2d')!;
  const backdrop = (img: HTMLImageElement, alpha: number, cw: number, ch: number) => {
    tctx.drawImage(img, 0, 0, tiny.width, tiny.height);
    const s = Math.max(cw / tiny.width, ch / tiny.height);
    ctx.globalAlpha = alpha;
    ctx.drawImage(tiny, (cw - tiny.width * s) / 2, (ch - tiny.height * s) / 2, tiny.width * s, tiny.height * s);
  };

  const draw = (p: number) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const portrait = cw < ch;
    // encuadre único para todo el recorrido (si cambiara entre fotos, la alineación se rompería):
    // apaisado → llena la pantalla pegado arriba (se recorta el piso); vertical → foto casi entera (un 20% más grande), centrada
    const s = portrait ? Math.min(cw / W, ch / H) * 1.2 : Math.max(cw / W, ch / H);
    const ox = (cw - W * s) / 2;
    const oy = (ch - H * s) * (portrait ? 0.42 : 0.05);

    // en qué tramo va y cuánto
    let k = STEPS.length;
    let t = 0;
    for (let i = 0; i < STEPS.length; i++) {
      const [a, b] = STEPS[i].at;
      if (p < a) { k = i; break; }
      if (p <= b) { k = i; t = (p - a) / (b - a); break; }
    }
    const step = k < STEPS.length ? STEPS[k] : null;
    const gA = get(step ? step.from : STEPS[STEPS.length - 1].to);
    if (!gA) return;
    const A = gA.img;
    const gB = step && t > 0 ? get(step.to) : null;
    const B = gB?.img ?? null;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, cw, ch);

    // el movimiento es lineal (la velocidad no se corta entre tramos; Lenis ya suaviza el scroll)
    // y la mezcla entra en el medio del tramo
    const g = t;
    const alpha = smooth(clamp((t - 0.12) / 0.76));
    // fondo: las propias fotos, desenfocadas (si no, asoman franjas negras en los costados)
    backdrop(A, 1, cw, ch);
    if (B) backdrop(B, alpha, cw, ch);
    if (portrait) {
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, cw, ch);
    }

    // A se acerca hacia B (a_t = a^g, desplazamiento por el punto fijo del zoom) y B queda pegada a A
    let sa = 1, xa = 0, ya = 0, sb = 1, xb = 0, yb = 0;
    if (B && step) {
      const [a, dxn, dyn] = step.fit;
      const dx = dxn * W;
      const dy = dyn * H;
      sa = a ** g;
      const m = Math.abs(a - 1) > 1e-3 ? (1 - sa) / (1 - a) : g; // zoom alrededor del punto fijo (o traslación pura)
      xa = dx * m;
      ya = dy * m;
      sb = sa / a;
      xb = xa - (sa * dx) / a;
      yb = ya - (sa * dy) / a;
    }
    const put = (img: CanvasImageSource, sc: number, x: number, y: number, al: number) => {
      ctx.setTransform(s * sc, 0, 0, s * sc, ox + s * x, oy + s * y);
      ctx.globalAlpha = al;
      ctx.drawImage(img, 0, 0, W, H);
    };
    // Bordes suaves solo cuando quedan dentro de la pantalla (foto achicada, o en vertical): si la foto llena la
    // pantalla, difuminar los costados se vería como un velo, y al pasar a la siguiente foto "saltaría".
    const edge = (sc: number) => portrait || sc < 0.96;
    const pick = (g: { img: HTMLImageElement; i: number }, sc: number) => (edge(sc) ? (soft[g.i] ??= feather(g.img)) : g.img);
    put(pick(gA, sa), sa, xa, ya, 1);
    if (B && gB) put(pick(gB, sb), sb, xb, yb, alpha);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 1.25);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    // en mobile "resize" salta al mostrar/ocultar la barra de URL; reasignar el tamaño borra el canvas
    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w;
      canvas.height = h;
      dirty = true;
    }
  };
  resize();
  window.addEventListener('resize', resize);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  let lastP = -1;
  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const p = progress();
    if (!visible || (!dirty && Math.abs(p - lastP) < 1e-5)) return;
    dirty = false;
    lastP = p;
    draw(p);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', resize);
  };
}
