import {
  AmbientLight, BoxGeometry, BufferGeometry, CylinderGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Group, HemisphereLight, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PCFShadowMap, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { PropertyType } from '../lib/plans';
import { SCENES, type BoxDef } from '../lib/scenes';

export interface Scene3D {
  setType: (v: PropertyType) => void;
  resetView: () => void;
  destroy: () => void;
}

const U = 0.1; /* grid units to scene units */
const CX = 150;
const CY = 105;
const X = (x: number): number => (x - CX) * U;
const Z = (y: number): number => (y - CY) * U;
const ZONE_COLOR = { ent: 0xfd7b01, com: 0x00adfc, park: 0x0b1f5c } as const;
const KIND_COLOR: Record<BoxDef['kind'], number> = { mass: 0xdce6f8, low: 0xe6ecf8, cabin: 0xbfe8c3, pier: 0x0b1f5c, wall: 0xb9c6e0, tank: 0x0b1f5c, slab: 0xf4f8ff, car: 0xffffff };

/** Mounts an orbitable 3D version of the chosen property. Loaded on demand from the "Explore in 3D" button, so first paint never pays for it. */
export async function mount3D(container: HTMLElement, initial: PropertyType, reduceMotion: boolean): Promise<Scene3D> {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D illustration of the property with CCTV coverage. Drag to rotate.');
  container.prepend(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 200);
  const home = (): void => {
    camera.position.set(24, 20, 26);
  };
  home();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.46;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.8;

  scene.add(new HemisphereLight(0xffffff, 0xb9c8ea, 1.05), new AmbientLight(0xffffff, 0.15));
  const sun = new DirectionalLight(0xffffff, 1.5);
  sun.position.set(-14, 26, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22 });
  sun.shadow.radius = 4;
  scene.add(sun);

  const mat = (c: number, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}): MeshStandardMaterial => new MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, ...extra });
  const content = new Group();
  scene.add(content);
  const pivots: Group[] = [];
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T): T => {
    disposables.push(o);
    return o;
  };

  function build(v: PropertyType): void {
    content.clear();
    pivots.length = 0;
    disposables.splice(0).forEach((d) => d.dispose());
    const def = SCENES[v];
    const ground = new Mesh(track(new PlaneGeometry(34, 26)), track(mat(0xeaf0fa)));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    content.add(ground);

    def.roads.forEach(([x0, y0, x1, y1]) => {
      const m = new Mesh(track(new PlaneGeometry((x1 - x0) * U, (y1 - y0) * U)), track(mat(0xcbd8f1)));
      m.rotation.x = -Math.PI / 2;
      m.position.set(X((x0 + x1) / 2), 0.01, Z((y0 + y1) / 2));
      m.receiveShadow = true;
      content.add(m);
    });
    def.pads.forEach((p) => {
      const col = p.zone === 'com' ? 0x00adfc : p.zone === 'ent' ? 0xfd7b01 : p.zone === 'rec' ? 0x1cad00 : 0x0b1f5c;
      const m = new Mesh(track(new PlaneGeometry(p.w * U, p.d * U)), track(new MeshStandardMaterial({ color: col, transparent: true, opacity: 0.22 })));
      m.rotation.x = -Math.PI / 2;
      m.position.set(X(p.x + p.w / 2), 0.02, Z(p.y + p.d / 2));
      content.add(m);
    });

    def.boxes.forEach((b) => {
      const z0 = b.z ?? 0;
      if (b.kind === 'tank') {
        const m = new Mesh(track(new CylinderGeometry(Math.min(b.w, b.d) * U * 0.45, Math.min(b.w, b.d) * U * 0.45, b.h * U * 0.9, 16)), track(mat(KIND_COLOR.tank)));
        m.position.set(X(b.x + b.w / 2), (z0 + b.h * 0.5) * U * 0.9, Z(b.y + b.d / 2));
        m.castShadow = true;
        content.add(m);
        return;
      }
      const m = new Mesh(track(new BoxGeometry(b.w * U, b.h * U * 0.9, b.d * U)), track(mat(KIND_COLOR[b.kind])));
      m.position.set(X(b.x + b.w / 2), (z0 + b.h * 0.5) * U * 0.9, Z(b.y + b.d / 2));
      m.castShadow = true;
      m.receiveShadow = true;
      content.add(m);
      if (b.floors && b.floors > 1) {
        for (let f = 1; f < b.floors; f++) {
          const band = new Mesh(track(new BoxGeometry(b.w * U * 1.01, b.h * U * 0.06, b.d * U * 1.01)), track(mat(0x7fa6e6, { roughness: 0.6 })));
          band.position.set(m.position.x, (z0 + (b.h * f) / b.floors) * U * 0.9, m.position.z);
          content.add(band);
        }
      }
    });
    def.bikes.forEach((g) => {
      for (let j = 0; j < g.rows; j++)
        for (let i = 0; i < g.cols; i++) {
          const m = new Mesh(track(new BoxGeometry(6 * U, 5 * U, 11 * U)), track(mat(0x5b6b8c)));
          m.position.set(X(g.x + i * g.dx + 3), 2.5 * U, Z(g.y + j * g.dy + 5.5));
          m.castShadow = true;
          content.add(m);
        }
    });

    def.cams.forEach((c) => {
      const grp = new Group();
      const camY = c.h * U * 0.9;
      grp.position.set(X(c.x), camY, Z(c.y));
      const pts = c.to.map((p) => [X(p[0]) - X(c.x), -camY + 0.03, Z(p[1]) - Z(c.y)]);
      const geo = track(new BufferGeometry());
      geo.setAttribute('position', new Float32BufferAttribute([0, 0, 0, ...pts[0], ...pts[1]], 3));
      geo.computeVertexNormals();
      grp.add(new Mesh(geo, track(new MeshBasicMaterial({ color: ZONE_COLOR[c.zone], transparent: true, opacity: 0.38, side: DoubleSide, depthWrite: false }))));
      grp.add(new Mesh(track(new SphereGeometry(0.28, 16, 12)), track(mat(0x1650d0))));
      content.add(grp);
      pivots.push(grp);
    });
  }
  build(initial);

  const resize = (): void => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let visible = true;
  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
  });
  io.observe(container);
  const t0 = performance.now();
  let raf = 0;
  const loop = (): void => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = (performance.now() - t0) / 1000;
    if (!reduceMotion) pivots.forEach((p, i) => (p.rotation.y = Math.sin(t * 0.9 + i * 0.8) * 0.2));
    controls.update();
    renderer.render(scene, camera);
  };
  loop();

  return {
    setType: build,
    resetView: () => {
      home();
      controls.update();
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      disposables.splice(0).forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
