'use client';
import { useEffect, useRef } from 'react';
import type * as THREE from 'three';

interface ThreeSceneProps {
  activeSection: string;
  scrollProgress: number;
}

const WAYPOINTS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero:     { pos: [22, 14, 30],   target: [0, 6, 0]  },
  about:    { pos: [2, 10, 18],    target: [0, 5, 0]  },
  work:     { pos: [14, 18, 26],   target: [0, 3, 0]  },
  services: { pos: [-18, 10, 24],  target: [0, 6, 0]  },
  gallery:  { pos: [6, 8, 36],     target: [0, 8, 0]  },
  contact:  { pos: [4, 26, 46],    target: [0, 0, 0]  },
};

export default function ThreeScene({ activeSection, scrollProgress }: ThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSectionRef = useRef(activeSection);
  const scrollProgressRef = useRef(scrollProgress);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    // Skip on small touch devices
    if (typeof window !== 'undefined' && window.innerWidth < 768 && 'ontouchstart' in window) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf: number;
    let cleanupFn: (() => void) | undefined;

    const init = async () => {
      const THREE = await import('three');

      /* ── Renderer ─────────────────────────────── */
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      /* ── Scene & Camera ──────────────────────── */
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 500);
      const initWp = WAYPOINTS['hero'];
      camera.position.set(...initWp.pos);
      const lookAtTarget = new THREE.Vector3(...initWp.target);
      camera.lookAt(lookAtTarget);

      /* ── Helper: add wireframe box ───────────── */
      type Part = { mesh: import('three').Object3D; targetY: number; delay: number };
      const parts: Part[] = [];

      const addBox = (
        w: number, h: number, d: number,
        x: number, y: number, z: number,
        delay: number,
        opacity = 0.09
      ) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        const edges = new THREE.EdgesGeometry(geo);
        const mat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity,
        });
        const mesh = new THREE.LineSegments(edges, mat);
        mesh.position.set(x, y - 30, z);
        scene.add(mesh);
        parts.push({ mesh, targetY: y, delay });
        return mesh;
      };

      /* ── A) Main Building ─────────────────────── */
      // Ground plinth
      addBox(13, 0.5, 8,    0,     0.25,  0,    0,    0.14);
      // Floor 1
      addBox(10, 3.2, 6.5, -0.5,   1.85,  0.2,  180,  0.08);
      // Floor 2
      addBox(10, 3.2, 6.5, -0.5,   5.05,  0.2,  360,  0.08);
      // Floor 3
      addBox(7.5, 3.2, 6,  -0.5,   8.25,  0.2,  540,  0.07);
      // Floor 4
      addBox(5.5, 3.2, 5.5,-0.5,  11.45,  0.2,  720,  0.06);
      // Roof slab
      addBox(11, 0.4, 7.5, -0.5,  13.25,  0.2,  900,  0.11);
      // Penthouse
      addBox(3.5, 3.8, 3.5, 1.2,  15.15,  0,   1100,  0.07);
      // Penthouse roof
      addBox(4,   0.25, 4,  1.2,  17.15,  0,   1300,  0.10);
      // Side wing
      addBox(3.5, 6.4, 6.5,-6.25,  3.45,  0.2,  450,  0.06);
      // Side wing roof
      addBox(4,   0.25, 7, -6.25,  6.65,  0.2,  650,  0.09);
      // 6 vertical columns
      for (let i = 0; i < 6; i++) {
        addBox(0.22, 6.6, 0.22, -4.5 + i * 1.8, 3.5, 3.0, 250 + i * 60, 0.07);
      }
      // 4 horizontal spandrel beams
      for (let j = 0; j < 4; j++) {
        addBox(10, 0.1, 6.5, -0.5, 3.15 + j * 3.2, 0.2, 200 + j * 140, 0.10);
      }
      // 10 windows floor 1
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 2; row++) {
          addBox(0.85, 1.35, 0.08, -3.8 + col * 2.0, 1.2 + row * 1.7, 3.28, 900 + col * 60 + row * 120, 0.14);
        }
      }
      // 5 windows floor 2
      for (let col = 0; col < 5; col++) {
        addBox(0.85, 1.35, 0.08, -3.8 + col * 2.0, 4.6, 3.28, 1100 + col * 60, 0.12);
      }
      // Balcony rail
      addBox(7.8, 0.08, 1.2, -0.5, 7.65, 3.2, 800, 0.11);

      /* ── B) Blueprint ground grid ─────────────── */
      const gridMat = new THREE.LineBasicMaterial({
        color: 0xc69c1a,
        transparent: true,
        opacity: 0.04,
      });
      for (let i = -10; i <= 10; i++) {
        const pts = [new THREE.Vector3(i, -0.1, -10), new THREE.Vector3(i, -0.1, 10)];
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
        const pts2 = [new THREE.Vector3(-10, -0.1, i), new THREE.Vector3(10, -0.1, i)];
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), gridMat));
      }

      /* ── C) Particle system ──────────────────── */
      const PARTICLE_COUNT = 180;
      const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
      const particleVelocities = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlePositions[i * 3]     = (Math.random() - 0.5) * 50;
        particlePositions[i * 3 + 1] = Math.random() * 22;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        particleVelocities[i * 3]     = (Math.random() - 0.5) * 0.006;
        particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.2,
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: false,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      /* ── D) Floating blueprint sheets ─────────── */
      const planeDefs = [
        { w: 12, h: 8,  pos: [2, 2, -8],    rx: -Math.PI / 2, ry: 0,   opacity: 0.025, color: 0xc69c1a },
        { w: 8,  h: 6,  pos: [-8, 6, -5],   rx: 0,            ry: 0.5, opacity: 0.02,  color: 0xffffff },
        { w: 15, h: 10, pos: [4, -0.08, 2], rx: -Math.PI / 2, ry: 0,   opacity: 0.04,  color: 0xc69c1a },
      ] as const;

      for (const pd of planeDefs) {
        const geo = new THREE.PlaneGeometry(pd.w, pd.h);
        const mat = new THREE.MeshBasicMaterial({
          color: pd.color,
          transparent: true,
          opacity: pd.opacity,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(pd.pos[0], pd.pos[1], pd.pos[2]);
        mesh.rotation.x = pd.rx;
        mesh.rotation.y = pd.ry;
        scene.add(mesh);
      }

      /* ── E) Project image panels ─────────────── */
      const coverImages = [
        '/images/Image from Facebook (1).jpg',
        '/images/Image from Facebook (6).jpg',
        '/images/Image from Facebook (11).jpg',
        '/images/Image from Facebook (15).jpg',
        '/images/Image from Facebook (19).jpg',
        '/images/Image from Facebook (24).jpg',
      ];

      const panelPositions: [number, number, number][] = [
        [-6, 8, -2],
        [-2, 11, -4],
        [3, 7, -3],
        [7, 10, 1],
        [4, 13, 4],
        [-3, 6, 5],
      ];

      const panelRotations = [-0.12, 0.08, -0.15, 0.10, -0.08, 0.13];

      const panelMeshes: import('three').Mesh[] = [];
      const loader = new THREE.TextureLoader();

      coverImages.forEach((src, i) => {
        loader.load(src, (texture) => {
          const geo = new THREE.PlaneGeometry(4, 3);
          const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(...panelPositions[i]);
          mesh.rotation.y = panelRotations[i];
          scene.add(mesh);
          panelMeshes[i] = mesh;

          // Border
          const edges = new THREE.EdgesGeometry(geo);
          const borderMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
          });
          const border = new THREE.LineSegments(edges, borderMat);
          mesh.add(border);
        });
      });

      /* ── F) Service towers ────────────────────── */
      type TowerMesh = { mesh: import('three').LineSegments; mat: import('three').LineBasicMaterial };
      const towerMeshes: TowerMesh[] = [];

      const towerDefs: [number, number, number, number, number, number][] = [
        [2,   8,   2,   -18, 4, -3],
        [1.5, 12,  1.5, -21, 6,  1],
        [2.5, 6,   2.5, -15, 3,  3],
      ];

      for (const [tw, th, td, tx, ty, tz] of towerDefs) {
        const geo = new THREE.BoxGeometry(tw, th, td);
        const edges = new THREE.EdgesGeometry(geo);
        const mat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.0,
        });
        const mesh = new THREE.LineSegments(edges, mat);
        mesh.position.set(tx, ty, tz);
        scene.add(mesh);
        towerMeshes.push({ mesh, mat });

        // 3 horizontal spandrel lines on each tower
        for (let s = 0; s < 3; s++) {
          const spandrelGeo = new THREE.BoxGeometry(tw + 0.1, 0.08, td + 0.1);
          const spandrelEdges = new THREE.EdgesGeometry(spandrelGeo);
          const spandrelMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
          });
          const spandrel = new THREE.LineSegments(spandrelEdges, spandrelMat);
          spandrel.position.set(tx, ty - th / 2 + (th / 4) * (s + 1), tz);
          scene.add(spandrel);
          towerMeshes.push({ mesh: spandrel, mat: spandrelMat });
        }
      }

      /* ── G) Dimensional lines ─────────────────── */
      const dimMat = new THREE.LineBasicMaterial({
        color: 0xc69c1a,
        transparent: true,
        opacity: 0.05,
      });

      // Vertical height marker
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(8, 0, -5),
          new THREE.Vector3(8, 17, -5),
        ]),
        dimMat
      ));

      // Tick marks
      const tickMat = new THREE.LineBasicMaterial({ color: 0xc69c1a, transparent: true, opacity: 0.05 });
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(7.7, 17, -5), new THREE.Vector3(8.3, 17, -5)]),
        tickMat
      ));
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(7.7, 0, -5), new THREE.Vector3(8.3, 0, -5)]),
        tickMat
      ));

      // Horizontal datum
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-8, 3.2, -5),
          new THREE.Vector3(8, 3.2, -5),
        ]),
        dimMat
      ));

      /* ── Clock & rotation time ────────────────── */
      const clock = new THREE.Clock();
      let elapsed = 0;
      let rotationTime = 0;

      /* ── Camera state ─────────────────────────── */
      const camTargetPos = new THREE.Vector3(...initWp.pos);
      const camTargetLook = new THREE.Vector3(...initWp.target);
      const currentLook = new THREE.Vector3(...initWp.target);

      /* ── Animation loop ──────────────────────── */
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const delta = clock.getDelta();
        elapsed += delta * 1000;
        rotationTime += delta;

        // 1. Update particles
        const positions = particleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          positions.array[i * 3]     += particleVelocities[i * 3];
          positions.array[i * 3 + 1] += particleVelocities[i * 3 + 1];
          positions.array[i * 3 + 2] += particleVelocities[i * 3 + 2];

          // Wrap around bounds
          if ((positions.array as Float32Array)[i * 3] > 25)     (positions.array as Float32Array)[i * 3]     = -25;
          if ((positions.array as Float32Array)[i * 3] < -25)    (positions.array as Float32Array)[i * 3]     =  25;
          if ((positions.array as Float32Array)[i * 3 + 1] > 22) (positions.array as Float32Array)[i * 3 + 1] = 0;
          if ((positions.array as Float32Array)[i * 3 + 1] < 0)  (positions.array as Float32Array)[i * 3 + 1] = 22;
          if ((positions.array as Float32Array)[i * 3 + 2] > 25) (positions.array as Float32Array)[i * 3 + 2] = -25;
          if ((positions.array as Float32Array)[i * 3 + 2] < -25)(positions.array as Float32Array)[i * 3 + 2] =  25;
        }
        positions.needsUpdate = true;

        // 2 & 3. Lerp camera toward active waypoint
        const sec = activeSectionRef.current;
        const wp = WAYPOINTS[sec] || WAYPOINTS['hero'];
        camTargetPos.set(...wp.pos);
        camTargetLook.set(...wp.target);

        camera.position.lerp(camTargetPos, 0.025);
        currentLook.lerp(camTargetLook, 0.025);
        camera.lookAt(currentLook);

        // 4. Building parts rising
        for (const p of parts) {
          if (elapsed < p.delay) continue;
          const diff = p.targetY - p.mesh.position.y;
          if (Math.abs(diff) > 0.002) {
            p.mesh.position.y += diff * 0.06;
          }
        }

        // 5. Lerp image panel opacities
        panelMeshes.forEach((mesh) => {
          if (!mesh) return;
          const target = activeSectionRef.current === 'work' ? 0.85 : 0.0;
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity += (target - mat.opacity) * 0.05;
        });

        // 6. Lerp service tower opacities
        towerMeshes.forEach(({ mat }) => {
          const target = activeSectionRef.current === 'services' ? 0.09 : 0.0;
          mat.opacity += (target - mat.opacity) * 0.05;
        });

        // 7. Slow scene oscillation
        scene.rotation.y = Math.sin(rotationTime * 0.05) * 0.08;

        // 8. Render
        renderer.render(scene, camera);
      };

      tick();

      /* ── Resize ─────────────────────────────── */
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      cleanupFn = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        gridMat.dispose();
        dimMat.dispose();
        tickMat.dispose();
      };
    };

    init();
    return () => cleanupFn?.();
  }, []); // Only run once

  // Mobile fallback: just show the canvas (it'll be empty, that's fine)
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
