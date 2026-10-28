import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Piezas compartidas por las escenas 3D (hero y taller).

export const ACCENT = 0x3ddc84;
export const INK = 0x070908;

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

// Interpola entre pares [progreso, valor]
export function keys(p: number, ks: [number, number][]) {
  for (let i = 0; i < ks.length - 1; i++) {
    const [p0, v0] = ks[i];
    const [p1, v1] = ks[i + 1];
    if (p <= p1) return v0 + (v1 - v0) * range(p, p0, p1);
  }
  return ks[ks.length - 1][1];
}

// PRNG determinístico: la escena sale igual en cada carga
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function glass(opacity: number) {
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

// Malla + contorno verde, el look "tech" de todas las piezas
export function outlined(geo: THREE.BufferGeometry, mat: THREE.Material, edgeOpacity = 0.7) {
  const g = new THREE.Group();
  g.add(
    new THREE.Mesh(geo, mat),
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 20),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: edgeOpacity }),
    ),
  );
  return g;
}

export function buildDust(n: number, size: [number, number, number], center: [number, number, number]) {
  const r = rng(11);
  const v = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) v[i * 3 + k] = center[k] + (r() - 0.5) * size[k];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xbfffe0, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false }),
  );
}

export function createStage(canvas: HTMLCanvasElement, fogDensity: number) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(INK);
  scene.fog = new THREE.FogExp2(INK, fogDensity);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 200);
  scene.add(camera);
  // dirty: pedir un redibujo desde afuera (p. ej. cuando termina de cargar una textura)
  return { renderer, scene, camera, pmrem, dirty: true };
}

// Loop de render: solo dibuja cuando cambia el scroll o el tamaño, y nada fuera de pantalla.
export function runLoop(
  stage: ReturnType<typeof createStage>,
  progress: () => number,
  update: (p: number) => void,
  fov: { landscape: number; portrait: number },
) {
  const { renderer, scene, camera, pmrem } = stage;
  const canvas = renderer.domElement;
  let lastP = -1;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? fov.portrait : fov.landscape;
    camera.updateProjectionMatrix();
    stage.dirty = true;
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
    if (!visible || (!stage.dirty && Math.abs(p - lastP) < 1e-5)) return;
    stage.dirty = false;
    lastP = p;
    update(p);
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

// Junta las mallas y líneas fijas por material: cientos de draw calls pasan a unos pocos.
// Se saltean los objetos con userData.keep (los que se animan), las instancias y los multi-material.
export function bake(scene: THREE.Scene) {
  scene.updateMatrixWorld(true);
  const buckets = new Map<THREE.Material, { lines: boolean; geos: THREE.BufferGeometry[] }>();
  const baked: THREE.Object3D[] = [];
  const visit = (o: THREE.Object3D) => {
    if (o.userData.keep) return;
    const mesh = o as THREE.Mesh;
    const isLines = (o as THREE.LineSegments).isLineSegments === true;
    if ((mesh.isMesh && !(o as THREE.InstancedMesh).isInstancedMesh && !Array.isArray(mesh.material)) || isLines) {
      let g = mesh.geometry.clone().applyMatrix4(o.matrixWorld);
      if (g.index) g = g.toNonIndexed();
      g.clearGroups();
      if (o.matrixWorld.determinant() < 0 && !isLines) flipWinding(g); // fachada espejada
      const mat = mesh.material as THREE.Material;
      if (!buckets.has(mat)) buckets.set(mat, { lines: isLines, geos: [] });
      buckets.get(mat)!.geos.push(g);
      baked.push(o);
    }
    o.children.forEach(visit);
  };
  visit(scene);
  baked.forEach((o) => o.removeFromParent());
  for (const [mat, { lines, geos }] of buckets) {
    const merged = mergeGeometries(geos);
    if (!merged) continue;
    scene.add(lines ? new THREE.LineSegments(merged, mat) : new THREE.Mesh(merged, mat));
  }
}

function flipWinding(g: THREE.BufferGeometry) {
  for (const attr of Object.values(g.attributes)) {
    const a = attr as THREE.BufferAttribute;
    for (let i = 0; i < a.count; i += 3) {
      for (let k = 0; k < a.itemSize; k++) {
        const t = a.getComponent(i + 1, k);
        a.setComponent(i + 1, k, a.getComponent(i + 2, k));
        a.setComponent(i + 2, k, t);
      }
    }
  }
}
