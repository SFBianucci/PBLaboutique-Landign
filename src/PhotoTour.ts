// Recorrido por fotos reales del taller. El scroll mueve la "cámara": cada tramo hace zoom/paneo
// de una foto hacia la siguiente y las mezcla. Las fotos se alinearon con puntos en común
// (x_B = a·x_A + d), así la mezcla se lee como movimiento y no como un fundido plano.
// Dibuja solo cuando cambia el scroll o el tamaño.

const W = 1280;
const H = 960; // marco lógico de las fotos (4:3); los números de abajo están en este marco
const INK = '#070908';

const FRAMES = ['/taller/1.webp', '/taller/2.webp', '/taller/3.webp', '/taller/4.webp', '/taller/5.webp'];

// Tramo i: de FRAMES[i] a FRAMES[i+1] mientras el scroll (0..1) está en `at`; entre tramos se queda quieta.
// fit = [a, dx, dy]: dx y dy normalizados a W y H.
const STEPS: { at: [number, number]; fit: [number, number, number] }[] = [
  { at: [0.07, 0.3], fit: [1.2554, -0.0933, -0.2076] }, // la calle: la cámara se acerca al portón
  { at: [0.32, 0.56], fit: [2.5, -0.8809, -0.8333] }, // portón: el salón aparece dentro de la abertura
  { at: [0.64, 0.75], fit: [1.1256, -0.2085, -0.0591] }, // paneo por las estanterías
  { at: [0.81, 0.92], fit: [1.1235, -0.0974, -0.1273] },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

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
  // si una foto todavía no cargó se usa la anterior que sí
  const get = (i: number) => {
    for (let k = i; k >= 0; k--) if (imgs[k].complete && imgs[k].naturalWidth) return imgs[k];
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
    const A = get(k);
    if (!A) return;
    const B = k < STEPS.length && t > 0 ? get(k + 1) : null;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, cw, ch);

    const g = smooth(t); // el movimiento arranca y frena suave
    const alpha = smooth(g);
    if (portrait) {
      backdrop(A, 1, cw, ch);
      if (B) backdrop(B, alpha, cw, ch);
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, cw, ch);
    }

    // A se acerca hacia B (a_t = a^g, desplazamiento por el punto fijo del zoom) y B queda pegada a A
    let sa = 1, xa = 0, ya = 0, sb = 1, xb = 0, yb = 0;
    if (B) {
      const [a, dxn, dyn] = STEPS[k].fit;
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
    const put = (img: HTMLImageElement, sc: number, x: number, y: number, al: number) => {
      ctx.setTransform(s * sc, 0, 0, s * sc, ox + s * x, oy + s * y);
      ctx.globalAlpha = al;
      ctx.drawImage(img, 0, 0, W, H);
    };
    put(A, sa, xa, ya, 1);
    if (B) put(B, sb, xb, yb, alpha);
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
