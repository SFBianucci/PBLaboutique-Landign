import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Escena del hero: parabrisas → impacto → reparación → la cámara lo atraviesa
// y recorre un pasillo de cristales. Todo lo maneja `progress()` (0..1 del scroll).

const ACCENT = 0x3ddc84;
const INK = 0x070908;
const PANE_W = 4.2;
const PANE_H = 1.9;
const CURVE = 0.12;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const zAt = (x: number) => -CURVE * x * x;

// Interpola entre pares [progreso, valor]
function keys(p: number, ks: [number, number][]) {
  for (let i = 0; i < ks.length - 1; i++) {
    const [p0, v0] = ks[i];
    const [p1, v1] = ks[i + 1];
    if (p <= p1) return v0 + (v1 - v0) * range(p, p0, p1);
  }
  return ks[ks.length - 1][1];
}

// PRNG determinístico para que la grieta sea siempre la misma
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function glass(opacity: number) {
  return new THREE.MeshStandardMaterial({
    color: 0x7fe0aa,
    roughness: 0.04,
    metalness: 0,
    envMapIntensity: 1.6,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

function buildWindshield() {
  const geo = new THREE.PlaneGeometry(PANE_W, PANE_H, 48, 12);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const taper = 1 - 0.14 * (pos.getY(i) / PANE_H + 0.5); // más angosto arriba
    const x = pos.getX(i) * taper;
    pos.setX(i, x);
    pos.setZ(i, zAt(x));
  }
  geo.computeVertexNormals();
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo, 20),
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 }),
  );
  return { mesh: new THREE.Mesh(geo, glass(0.16)), edges };
}

function buildCrack() {
  const r = rng(7);
  const [ix, iy] = [0.45, 0.05];
  const STEPS = 7;
  const inside = (x: number, y: number) => Math.abs(y) < PANE_H / 2 - 0.05 && Math.abs(x) < (PANE_W / 2) * (1 - 0.14 * (y / PANE_H + 0.5)) - 0.05;
  const radials = Array.from({ length: 11 }, (_, i) => {
    let a = (i / 11) * Math.PI * 2 + r() * 0.3;
    const pts: [number, number][] = [[ix, iy]];
    for (let k = 0; k < STEPS; k++) {
      a += (r() - 0.5) * 0.7;
      const [px, py] = pts[pts.length - 1];
      const len = 0.08 + r() * 0.18;
      const next: [number, number] = [px + Math.cos(a) * len, py + Math.sin(a) * len];
      if (!inside(...next)) break;
      pts.push(next);
    }
    return pts;
  });
  // Segmentos ordenados por "anillo" para que todas las líneas crezcan a la vez
  const v: number[] = [];
  const push = (a: [number, number], b: [number, number]) =>
    v.push(a[0], a[1], zAt(a[0]) + 0.01, b[0], b[1], zAt(b[0]) + 0.01);
  for (let k = 0; k < STEPS; k++) {
    radials.forEach((pts) => pts[k + 1] && push(pts[k], pts[k + 1]));
    if (k === 1 || k === 3) {
      radials.forEach((pts, i) => {
        const next = radials[(i + 1) % radials.length];
        if (pts[k + 1] && next[k + 1]) push(pts[k + 1], next[k + 1]);
      });
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xeafff2, transparent: true, opacity: 0.9 });
  return { lines: new THREE.LineSegments(geo, mat), count: v.length / 3 };
}

function buildAisle(scene: THREE.Scene) {
  const r = rng(3);
  const geo = new THREE.BoxGeometry(0.03, 2.2, 1.5);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const mat = glass(0.1);
  const edgeMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 });
  const racks: THREE.Group[] = [];
  for (let i = 0; i < 20; i++) {
    const side = i % 2 ? 1 : -1;
    const rack = new THREE.Group();
    for (let s = 0; s < 3; s++) {
      const sheet = new THREE.Group();
      sheet.add(new THREE.Mesh(geo, mat), new THREE.LineSegments(edgesGeo, edgeMat));
      sheet.position.x = s * 0.16 * side;
      sheet.rotation.z = (r() - 0.5) * 0.06;
      rack.add(sheet);
    }
    rack.position.set(side * (2.1 + r() * 0.5), 0, -5 - Math.floor(i / 2) * 4.5);
    rack.rotation.y = side * 0.3;
    racks.push(rack);
    scene.add(rack);
  }
  const grid = new THREE.GridHelper(220, 110, ACCENT, 0x1c3326);
  const gm = grid.material as THREE.Material;
  gm.transparent = true;
  gm.opacity = 0.45;
  grid.position.y = -1.4;
  scene.add(grid);

  const portal = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 1.18, 96),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9, fog: false }),
  );
  portal.position.set(0, 0.2, -52);
  scene.add(portal);
  return { racks, portal };
}

function buildDust() {
  const r = rng(11);
  const n = 1400;
  const v = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    v[i * 3] = (r() - 0.5) * 16;
    v[i * 3 + 1] = (r() - 0.5) * 7 + 0.5;
    v[i * 3 + 2] = 10 - r() * 75;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xbfffe0, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false }),
  );
}

export function mountGlassScene(canvas: HTMLCanvasElement, progress: () => number) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(INK);
  scene.fog = new THREE.FogExp2(INK, 0.05);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 200);
  const light = new THREE.PointLight(ACCENT, 25, 10);
  camera.add(light);
  scene.add(camera);

  const shield = buildWindshield();
  const crack = buildCrack();
  const windshield = new THREE.Group();
  windshield.add(shield.mesh, shield.edges, crack.lines);
  windshield.rotation.x = -0.22;
  scene.add(windshield);

  buildAisle(scene);
  const dust = buildDust();
  scene.add(dust);

  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.3, 8),
    new THREE.Vector3(-0.1, 0.15, 4.4),
    new THREE.Vector3(0.2, 0.05, 1.8),
    new THREE.Vector3(0, 0, -1.5),
    new THREE.Vector3(-0.4, 0.2, -14),
    new THREE.Vector3(0.4, 0.1, -30),
    new THREE.Vector3(0, 0.25, -47),
  ]);
  const ahead = new THREE.Vector3();

  // Solo se dibuja cuando cambia el scroll (o el tamaño): sin animaciones en reposo
  // la escena no ocupa la GPU mientras el usuario lee.
  let dirty = true;
  let lastP = -1;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? 72 : 50; // en vertical hace falta más campo para ver el parabrisas
    camera.updateProjectionMatrix();
    dirty = true;
  };
  resize();
  window.addEventListener('resize', resize);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const p = progress();
    if (!visible || (!dirty && Math.abs(p - lastP) < 1e-5)) return;
    dirty = false;
    lastP = p;

    // Cámara: se acerca lento mientras pasa lo del impacto, después atraviesa y recorre
    const t = keys(p, [[0, 0], [0.5, 0.075], [0.62, 0.16], [1, 1]]);
    path.getPointAt(t, camera.position);
    path.getPointAt(Math.min(1, t + 0.04), ahead);
    camera.lookAt(ahead);

    // Grieta: crece, y con la "reparación" se desvanece con un destello verde
    const grow = range(p, 0.18, 0.36);
    const repair = range(p, 0.42, 0.52);
    crack.lines.geometry.setDrawRange(0, Math.floor((crack.count * grow) / 2) * 2);
    (crack.lines.material as THREE.LineBasicMaterial).opacity = 0.9 * (1 - repair);
    (shield.edges.material as THREE.LineBasicMaterial).opacity = 0.7 + 0.3 * Math.sin(repair * Math.PI);
    windshield.rotation.y = (1 - range(p, 0, 0.3)) * 0.12;
    dust.rotation.z = p * 0.4;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', resize);
    pmrem.dispose();
    renderer.dispose();
  };
}
