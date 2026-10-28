import * as THREE from 'three';
import { ACCENT, bake, buildDust, createStage, ease, glass, keys, range, rng, runLoop } from './three-kit';

// Escena del hero: parabrisas → impacto → reparación → la cámara lo atraviesa
// y recorre un pasillo de cristales. Todo lo maneja `progress()` (0..1 del scroll).

const PANE_W = 4.2;
const PANE_H = 1.9;
const CURVE = 0.12;
const zAt = (x: number) => -CURVE * x * x;

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
  // Cada segmento sabe en qué paso de la propagación aparece; los anillos unen radiales en el paso siguiente
  type P = [number, number];
  const segs: { a: P; b: P; step: number }[] = [];
  for (let k = 0; k < STEPS; k++) {
    radials.forEach((pts) => pts[k + 1] && segs.push({ a: pts[k], b: pts[k + 1], step: k }));
    if (k === 1 || k === 3) {
      radials.forEach((pts, i) => {
        const next = radials[(i + 1) % radials.length];
        if (pts[k + 1] && next[k + 1]) segs.push({ a: pts[k + 1], b: next[k + 1], step: k + 1 });
      });
    }
  }
  const pos = new Float32Array(segs.length * 6);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xeafff2, transparent: true, opacity: 0.9 });
  const lines = new THREE.LineSegments(geo, mat);
  lines.frustumCulled = false; // arranca colapsada en el punto de impacto; el bounding sphere quedaría mal
  // Crece en continuo: el segmento del paso actual se estira desde su origen, no aparece entero
  const grow = (g: number) => {
    const s = g * STEPS;
    segs.forEach(({ a, b, step }, i) => {
      const f = Math.min(1, Math.max(0, s - step));
      const x = a[0] + (b[0] - a[0]) * f;
      const y = a[1] + (b[1] - a[1]) * f;
      pos.set([a[0], a[1], zAt(a[0]) + 0.01, x, y, zAt(x) + 0.01], i * 6);
    });
    geo.attributes.position.needsUpdate = true;
  };
  grow(0);
  return { lines, grow };
}

function buildAisle(scene: THREE.Scene) {
  const r = rng(3);
  const geo = new THREE.BoxGeometry(0.03, 2.2, 1.5);
  const edgesGeo = new THREE.EdgesGeometry(geo);
  const mat = glass(0.1);
  const edgeMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 16; i++) {
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
  portal.position.set(0, 0.2, -38);
  scene.add(portal);
}

export function mountGlassScene(canvas: HTMLCanvasElement, progress: () => number) {
  const stage = createStage(canvas, 0.05);
  const { scene, camera } = stage;
  camera.add(new THREE.PointLight(ACCENT, 25, 10));

  const shield = buildWindshield();
  const crack = buildCrack();
  const windshield = new THREE.Group();
  windshield.add(shield.mesh, shield.edges, crack.lines);
  windshield.rotation.x = -0.22;
  windshield.userData.keep = true; // rota y la grieta cambia: no se junta con el resto
  scene.add(windshield);

  buildAisle(scene);
  const dust = buildDust(1100, [16, 7, 50], [0, 0.5, -15]);
  scene.add(dust);

  bake(scene);

  // Pasillo más corto que antes: con 47 m la cámara pasaba tan rápido junto a las placas que "saltaba"
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.3, 8),
    new THREE.Vector3(-0.1, 0.15, 4.4),
    new THREE.Vector3(0.2, 0.05, 1.8),
    new THREE.Vector3(0, 0, -1.5),
    new THREE.Vector3(-0.4, 0.2, -12),
    new THREE.Vector3(0.3, 0.1, -23),
    new THREE.Vector3(0, 0.25, -33),
  ]);
  const dir = new THREE.Vector3();
  const target = new THREE.Vector3();

  return runLoop(
    stage,
    progress,
    (p) => {
      // Cámara: se acerca lento mientras pasa lo del impacto, después atraviesa y recorre.
      // Mira hacia donde avanza (tangente): mirar a un punto adelante temblaba al final del recorrido.
      const t = keys(p, [[0, 0], [0.5, 0.09], [0.62, 0.24], [1, 1]]);
      path.getPointAt(t, camera.position);
      path.getTangentAt(t, dir);
      camera.lookAt(target.copy(camera.position).add(dir));

      // Grieta: crece, y con la "reparación" se desvanece con un destello verde
      const repair = ease(range(p, 0.42, 0.52));
      crack.grow(ease(range(p, 0.18, 0.36)));
      (crack.lines.material as THREE.LineBasicMaterial).opacity = 0.9 * (1 - repair);
      (shield.edges.material as THREE.LineBasicMaterial).opacity = 0.7 + 0.3 * Math.sin(repair * Math.PI);
      windshield.rotation.y = (1 - ease(range(p, 0, 0.3))) * 0.12;
      dust.rotation.z = p * 0.4;
    },
    { landscape: 50, portrait: 72 }, // en vertical hace falta más campo para ver el parabrisas
  );
}
