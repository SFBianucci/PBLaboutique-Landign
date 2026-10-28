import * as THREE from 'three';
import { ACCENT, bake, buildDust, createStage, ease, glass, keys, range, rng, runLoop } from './three-kit';

// Recorrido 3D estilizado del taller (Cerrito 2399): la cámara llega a la esquina,
// el portón sube y entra al salón con el techo de luces hexagonales y las estanterías.
// Las proporciones salen de las fotos; las texturas se dibujan en canvas (no pesan).

const FW = 4.6; // ancho de la ochava
const GH = 3.0; // altura planta baja
const UH = 2.6; // altura planta alta
const SL = 13; // largo de cada fachada lateral
const T = 0.25; // espesor de pared
const GATE: [number, number, number, number] = [-1.65, 0, 3.3, 2.5]; // x, y, ancho, alto
const A = Math.SQRT1_2;

// ---------- Texturas ----------

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat = false) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 1 textura = 1 m²; las UV de las paredes extruidas están en metros
const brickTex = () =>
  canvasTex(256, 256, (c) => {
    const r = rng(5);
    c.fillStyle = '#3a1611';
    c.fillRect(0, 0, 256, 256);
    const bh = 256 / 15;
    for (let row = 0; row < 15; row++) {
      for (let col = -1; col < 5; col++) {
        const l = 60 + r() * 25;
        c.fillStyle = `hsl(6 55% ${l / 3}%)`;
        c.fillRect(col * 64 + (row % 2) * 32 + 2, row * bh + 2, 60, bh - 3);
      }
    }
  }, true);

const meshPattern = (c: CanvasRenderingContext2D, w: number, h: number, bg: string) => {
  c.fillStyle = bg;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(40,45,45,0.35)';
  c.lineWidth = 1;
  for (let i = -h; i < w; i += 7) {
    c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke();
    c.beginPath(); c.moveTo(i + h, 0); c.lineTo(i, h); c.stroke();
  }
};

const gateTex = () =>
  canvasTex(660, 500, (c) => {
    meshPattern(c, 660, 500, '#b8bcbc');
    c.strokeStyle = '#f1f3f2';
    c.lineWidth = 12;
    c.strokeRect(6, 6, 648, 488);
    [220, 440].forEach((x) => { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 500); c.stroke(); });
    c.beginPath(); c.moveTo(0, 250); c.lineTo(660, 250); c.stroke();
    // carteles: "prohibido estacionar" al centro y avisos a los costados
    c.fillStyle = '#fff';
    c.fillRect(300, 80, 60, 90);
    c.strokeStyle = '#d0302a'; c.lineWidth = 6;
    c.beginPath(); c.arc(330, 115, 20, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(316, 101); c.lineTo(344, 129); c.stroke();
    c.fillRect(70, 100, 80, 50);
    c.fillRect(510, 100, 80, 50);
  });

const grilleTex = () =>
  canvasTex(256, 280, (c) => {
    meshPattern(c, 256, 280, '#a4a9a8');
    c.strokeStyle = '#eef0ef';
    c.lineWidth = 10;
    c.strokeRect(5, 5, 246, 270);
    c.beginPath(); c.moveTo(128, 0); c.lineTo(128, 280); c.moveTo(0, 140); c.lineTo(256, 140); c.stroke();
  });

const shutterTex = () =>
  canvasTex(256, 170, (c) => {
    c.fillStyle = '#d9dcdb';
    c.fillRect(0, 0, 256, 170);
    c.fillStyle = '#9fa4a3';
    for (let y = 0; y < 170; y += 10) c.fillRect(0, y, 256, 2);
  });

const tilesTex = () =>
  canvasTex(256, 256, (c) => {
    c.fillStyle = '#7d807d';
    c.fillRect(0, 0, 256, 256);
    c.strokeStyle = '#5f625f';
    c.lineWidth = 3;
    for (let i = 0; i <= 256; i += 64) {
      c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 256); c.moveTo(0, i); c.lineTo(256, i); c.stroke();
    }
  }, true);

// Paredes interiores: zócalo gris oscuro y parte alta gris claro, como en la foto
const liningTex = () =>
  canvasTex(64, 256, (c) => {
    c.fillStyle = '#9a9e9d';
    c.fillRect(0, 0, 64, 256);
    c.fillStyle = '#3d4140';
    c.fillRect(0, 150, 64, 106);
  });

function signTex(onReady: () => void) {
  const W = 2048;
  const H = 420;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d')!;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const logo = new Image();

  const draw = () => {
    c.fillStyle = '#151716';
    c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 0; x < W; x += 36) c.fillRect(x, 0, 4, H); // chapa acanalada
    if (logo.complete && logo.naturalWidth) c.drawImage(logo, W / 2 - 95, 22, 190, 190);
    c.textAlign = 'center';
    c.fillStyle = '#f1f3f2';
    c.font = 'italic 700 112px Geist, sans-serif';
    c.fillText('PARABRISAS', W / 2, 318);
    c.font = 'italic 700 60px Geist, sans-serif';
    c.fillText('LA BOUTIQUE', W / 2, 386);
    c.textAlign = 'left';
    c.font = 'italic 700 34px Geist, sans-serif';
    ['SERVICIOS AUTOMOTORES', 'CRISTALES', 'CERRAJERÍA', 'GRABADOS', 'LEVANTAVIDRIOS', 'POLARIZADOS'].forEach((t, i) =>
      c.fillText(t, 110, 70 + i * 50),
    );
    c.font = '700 54px Geist, sans-serif';
    c.fillText('11 5715-1222', 110, 392);
    c.fillStyle = ACCENT_CSS;
    ['SEKURIT', 'FUYAO', 'XYG', 'FAVICUR', 'CRISTEM'].forEach((t, i) => {
      c.textAlign = 'right';
      c.font = '700 40px Geist, sans-serif';
      c.fillText(t, W - 110, 80 + i * 66);
    });
    tex.needsUpdate = true;
    onReady();
  };

  draw();
  logo.onload = draw;
  logo.src = '/logo.svg';
  document.fonts?.ready.then(draw);
  return tex;
}
const ACCENT_CSS = '#3ddc84';

// ---------- Geometría ----------

// Pared extruida con huecos; cara exterior en z=0 y espesor hacia -z. UV en metros.
function wallGeo(x0: number, w: number, h: number, holes: [number, number, number, number][] = []) {
  const s = new THREE.Shape();
  s.moveTo(x0, 0);
  s.lineTo(x0 + w, 0);
  s.lineTo(x0 + w, h);
  s.lineTo(x0, h);
  s.closePath();
  for (const [x, y, hw, hh] of holes) {
    const p = new THREE.Path();
    p.moveTo(x, y);
    p.lineTo(x + hw, y);
    p.lineTo(x + hw, y + hh);
    p.lineTo(x, y + hh);
    p.closePath();
    s.holes.push(p);
  }
  const geo = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false });
  geo.translate(0, 0, -T);
  return geo;
}

function withEdges(mesh: THREE.Mesh, opacity = 0.3) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 20),
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity }),
  );
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);
  return [mesh, edges];
}

const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  return m;
};

const plane = (w: number, h: number, mat: THREE.Material, x: number, y: number, z: number, ry = 0) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.set(x, y + h / 2, z);
  m.rotation.y = ry;
  return m;
};

// Rack de cristales: base, divisores y placas verdes paradas entre ellos.
function rack(len: number, mats: { metal: THREE.Material; wood: THREE.Material; glass: THREE.Material }) {
  const r = rng(Math.round(len * 100));
  const g = new THREE.Group();
  g.add(box(len, 0.12, 0.6, mats.wood, len / 2, 0, 0));
  g.add(box(len, 0.05, 0.6, mats.wood, len / 2, 1.75, 0));
  for (let x = 0; x <= len; x += 0.3) g.add(box(0.03, 1.75, 0.03, mats.metal, x, 0.1, 0.28));
  const sheetGeo = new THREE.BoxGeometry(0.02, 1.25, 0.5);
  const edgeMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 });
  const edgeGeo = new THREE.EdgesGeometry(sheetGeo);
  for (let x = 0.15; x < len; x += 0.3) {
    for (let k = 0; k < 2; k++) {
      const s = new THREE.Group();
      s.add(new THREE.Mesh(sheetGeo, mats.glass), new THREE.LineSegments(edgeGeo, edgeMat));
      s.position.set(x + (k - 0.5) * 0.06, 0.12 + 0.62 + r() * 0.08, 0);
      s.rotation.z = (r() - 0.5) * 0.25;
      g.add(s);
    }
  }
  return g;
}

// Grupo con base ortonormal; si la base es "espejada" (fachada izquierda) three.js invierte las caras solo.
function placed(origin: THREE.Vector3, xAxis: THREE.Vector3, zAxis: THREE.Vector3) {
  const g = new THREE.Group();
  g.matrixAutoUpdate = false;
  g.matrix.makeBasis(xAxis, new THREE.Vector3(0, 1, 0), zAxis).setPosition(origin);
  return g;
}

export function mountTallerScene(canvas: HTMLCanvasElement, progress: () => number) {
  const stage = createStage(canvas, 0.028);
  const { scene, camera } = stage;
  scene.environmentIntensity = 0.6;
  let dirty = () => {};

  const brick = new THREE.MeshStandardMaterial({ map: brickTex(), roughness: 0.9 });
  const plaster = new THREE.MeshStandardMaterial({ color: 0x4a4e4d, roughness: 0.85 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x2f3332, roughness: 0.7 });
  const lining = new THREE.MeshStandardMaterial({ map: liningTex(), roughness: 0.8, side: THREE.DoubleSide });
  const metal = new THREE.MeshStandardMaterial({ color: 0x3b3f3e, metalness: 0.6, roughness: 0.4 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.7 });
  const glassMat = glass(0.35);
  glassMat.color.set(0x5fbf8a);

  // ---- Exterior ----
  const tiles = tilesTex();
  tiles.repeat.set(40, 40);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = 6;
  scene.add(ground);

  // Ochava: planta baja con portón, balcón, cartel y planta alta con ventana
  const front = new THREE.Group();
  front.add(...withEdges(new THREE.Mesh(wallGeo(-FW / 2, FW, GH, [GATE]), brick)));
  const upper = new THREE.Mesh(wallGeo(-FW / 2, FW, UH, [[-0.9, 0.5, 1.8, 1.2]]), plaster);
  upper.position.y = GH + 0.2;
  front.add(...withEdges(upper));
  front.add(plane(1.8, 1.2, new THREE.MeshStandardMaterial({ map: shutterTex(), roughness: 0.6 }), 0, GH + 0.7, -T / 2));
  // marco gris del portón
  front.add(box(0.2, GATE[3] + 0.2, 0.08, trim, GATE[0] - 0.1, 0, 0.02));
  front.add(box(0.2, GATE[3] + 0.2, 0.08, trim, GATE[0] + GATE[2] + 0.1, 0, 0.02));
  front.add(box(GATE[2] + 0.4, 0.2, 0.08, trim, 0, GATE[3], 0.02));
  const gate = plane(GATE[2], GATE[3], new THREE.MeshStandardMaterial({ map: gateTex(), roughness: 0.6, side: THREE.DoubleSide }), 0, 0, -T / 2);
  gate.userData.keep = true;
  front.add(gate);
  // balcón + cartel
  front.add(...withEdges(box(FW + 1.2, 0.2, 1.3, plaster, 0, GH, 0.4), 0.4));
  const signMats = Array(6).fill(trim);
  signMats[4] = new THREE.MeshBasicMaterial({ map: signTex(() => dirty()) });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(FW + 1.0, 1.05, 0.12), signMats);
  sign.position.set(0, GH + 0.25 + 0.55, 1.12);
  front.add(sign);
  scene.add(front);

  // Fachadas laterales a 45°, iguales en espejo
  const grille = new THREE.MeshStandardMaterial({ map: grilleTex(), roughness: 0.6 });
  const metalsGlass = { metal, wood, glass: glassMat };
  for (const s of [-1, 1]) {
    const dir = new THREE.Vector3(s * A, 0, -A);
    const out = new THREE.Vector3(s * A, 0, A);
    const side = placed(new THREE.Vector3((s * FW) / 2, 0, 0), dir, out);
    const windows: [number, number, number, number][] = [[0.9, 0.6, 1.8, 2.0], [5.6, 0.6, 1.8, 2.0]];
    side.add(...withEdges(new THREE.Mesh(wallGeo(0, SL, GH, windows), brick)));
    windows.forEach(([x, y, w, h]) => side.add(plane(w, h, grille, x + w / 2, y, -T / 2)));
    const up = new THREE.Mesh(wallGeo(0, SL, UH), plaster);
    up.position.y = GH + 0.2;
    side.add(...withEdges(up));
    side.add(...withEdges(box(SL, 0.2, 0.9, plaster, SL / 2, GH, 0.2), 0.4));
    scene.add(side);
  }

  // Edificio vecino (el de departamentos de la foto), apenas insinuado
  const neighbor = box(10, 16, 8, new THREE.MeshStandardMaterial({ color: 0x8b8170, roughness: 0.9 }), -7, 0, -15);
  scene.add(...withEdges(neighbor, 0.15));

  // ---- Interior ----
  const D = SL * A; // profundidad del salón
  const foot = (flip: number) => {
    const sh = new THREE.Shape();
    const pts = [[-FW / 2, 0], [FW / 2, 0], [FW / 2 + D, -D], [-FW / 2 - D, -D]];
    pts.forEach(([x, z], i) => (i ? sh.lineTo(x, z * flip) : sh.moveTo(x, z * flip)));
    return new THREE.ShapeGeometry(sh);
  };
  const floorGeo = foot(-1).rotateX(-Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x6e716e, roughness: 0.22, metalness: 0.15 }));
  floor.position.y = 0.01;
  scene.add(floor);
  const ceil = new THREE.Mesh(foot(1).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x2a2d2c, roughness: 0.9, side: THREE.DoubleSide }));
  ceil.position.y = GH - 0.02;
  scene.add(ceil);
  scene.add(plane(FW + 2 * D, GH, lining, 0, 0, -D + 0.02));
  // Salón rectangular como en la foto: paredes laterales y racks de cristales contra ellas y al fondo
  const RW = 3.8;
  const depth = D - 1.5;
  for (const s of [-1, 1]) {
    scene.add(plane(depth, GH, lining, s * RW, 0, -1.5 - depth / 2, -s * Math.PI / 2));
    [-1.8, -4.3, -6.8].forEach((z) => {
      const rk = rack(2.2, metalsGlass);
      rk.position.set(s * (RW - 0.35), 0, z);
      rk.rotation.y = Math.PI / 2;
      scene.add(rk);
    });
  }
  [-3.3, -1.05, 1.2].forEach((x) => {
    const rk = rack(2.1, metalsGlass);
    rk.position.set(x, 0, -D + 0.4);
    scene.add(rk);
  });

  // Techo de luces hexagonales (instanciado: un solo draw call)
  const R = 0.75;
  const centers: [number, number][] = [];
  for (let c = -4; c <= 4; c++) {
    for (let r = -6; r <= 0; r++) {
      const x = c * 1.5 * R;
      const z = -1.6 + r * Math.sqrt(3) * R + (c % 2 ? (Math.sqrt(3) / 2) * R : 0);
      if (Math.abs(x) < 3.4 && z < -1.4 && z > -8.6) centers.push([x, z]);
    }
  }
  const strip = new THREE.InstancedMesh(
    new THREE.BoxGeometry(R, 0.03, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    centers.length * 6,
  );
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let n = 0;
  for (const [cx, cz] of centers) {
    for (let k = 0; k < 6; k++) {
      const a = (k + 0.5) * (Math.PI / 3);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -(a + Math.PI / 2));
      const mid = new THREE.Vector3(cx + Math.cos(a) * R * 0.866, GH - 0.06, cz + Math.sin(a) * R * 0.866);
      strip.setMatrixAt(n++, m.compose(mid, q, new THREE.Vector3(1, 1, 1)));
    }
  }
  scene.add(strip);

  // Columnas de dos tonos y el carrito verde
  for (const x of [-1.9, 1.9]) {
    scene.add(box(0.5, 1.3, 0.5, new THREE.MeshStandardMaterial({ color: 0x3d4140, roughness: 0.8 }), x, 0, -5));
    scene.add(box(0.5, GH - 1.3, 0.5, new THREE.MeshStandardMaterial({ color: 0x9a9e9d, roughness: 0.8 }), x, 1.3, -5));
  }
  const cartMat = new THREE.MeshStandardMaterial({ color: 0x1f9d55, roughness: 0.5 });
  [0.15, 0.5, 0.85].forEach((y) => scene.add(box(0.75, 0.05, 0.45, cartMat, 0.9, y, -3.4)));
  scene.add(box(0.04, 0.9, 0.04, cartMat, 0.54, 0, -3.2), box(0.04, 0.9, 0.04, cartMat, 1.26, 0, -3.2));
  scene.add(box(0.04, 0.9, 0.04, cartMat, 0.54, 0, -3.6), box(0.04, 0.9, 0.04, cartMat, 1.26, 0, -3.6));

  // ---- Luces exteriores ----
  scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x1a1d1c, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-6, 10, 12);
  scene.add(sun);

  const dust = buildDust(500, [10, 3, 9], [0, 1.5, -4]);
  scene.add(dust);

  // ---- Cámara ----
  bake(scene);

  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4.2, 2.6, 14.5),
    new THREE.Vector3(1.4, 2.0, 9),
    new THREE.Vector3(0, 1.6, 5),
    new THREE.Vector3(0, 1.5, 1.2),
    new THREE.Vector3(0, 1.5, -1.5),
    new THREE.Vector3(-0.4, 1.6, -3.5),
    new THREE.Vector3(0.2, 1.7, -5.2),
  ]);
  const look = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3.2, 0),
    new THREE.Vector3(0, 2.4, 0),
    new THREE.Vector3(0, 1.4, -1),
    new THREE.Vector3(0, 1.4, -4),
    new THREE.Vector3(0, 1.7, -8),
    new THREE.Vector3(-1, 2.0, -10),
    new THREE.Vector3(0, 2.3, -11),
  ]);
  const target = new THREE.Vector3();
  const pathLength = path.getLength();

  const dispose = runLoop(
    stage,
    progress,
    (p) => {
      // llega a la esquina → se frena mientras sube el portón → entra → recorre el salón.
      // t es fracción de distancia (velocidad pareja) y el parámetro del mismo punto elige a qué
      // punto de `look` mira. Fracciones: 0.50 a 5 m del portón, 0.62 a 2.6 m, 0.82 ya adentro.
      const t = keys(p, [[0, 0], [0.3, 0.502], [0.5, 0.618], [0.64, 0.815], [1, 1]]);
      path.getPointAt(t, camera.position);
      look.getPoint(path.getUtoTmapping(t, t * pathLength), target);
      camera.lookAt(target);
      // el portón se enrolla: el borde de arriba queda fijo y sube el de abajo
      const open = Math.min(0.97, ease(range(p, 0.3, 0.5)));
      gate.scale.y = 1 - open;
      gate.position.y = GATE[3] * (1 - (1 - open) / 2);
      dust.rotation.y = p * 0.3;
    },
    { landscape: 52, portrait: 74 },
  );
  dirty = () => (stage.dirty = true);
  return dispose;
}
