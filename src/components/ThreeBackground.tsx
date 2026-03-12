'use client';
import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animFrame: number;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import('three');

      /* ── Scene ────────────────────────────────── */
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        32,
        mount.clientWidth / mount.clientHeight,
        0.1,
        500
      );
      camera.position.set(22, 14, 26);
      camera.lookAt(0, 5, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0xffffff, 1);
      mount.appendChild(renderer.domElement);

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
          color: 0x000000,
          transparent: true,
          opacity,
        });
        const mesh = new THREE.LineSegments(edges, mat);
        mesh.position.set(x, y - 30, z); // start far below
        scene.add(mesh);
        parts.push({ mesh, targetY: y, delay });
      };

      /* ── Building geometry ───────────────────── */
      // Ground plinth
      addBox(13, 0.5, 8, 0, 0.25, 0,   0,   0.55);

      // Floor 1 — wide base
      addBox(10, 3.2, 6.5, -0.5, 1.85, 0.2,  180, 0.35);
      // Floor 2
      addBox(10, 3.2, 6.5, -0.5, 5.05, 0.2,  360, 0.35);
      // Floor 3 — setback
      addBox(7.5, 3.2, 6, -0.5, 8.25, 0.2,   540, 0.30);
      // Floor 4 — further setback
      addBox(5.5, 3.2, 5.5, -0.5, 11.45, 0.2, 720, 0.25);
      // Roof slab
      addBox(11, 0.4, 7.5, -0.5, 13.25, 0.2, 900, 0.45);
      // Penthouse
      addBox(3.5, 3.8, 3.5, 1.2, 15.15, 0,  1100, 0.30);
      addBox(4,   0.25, 4,  1.2, 17.15, 0,  1300, 0.40);

      // Side wing (lower annex)
      addBox(3.5, 6.4, 6.5, -6.25, 3.45, 0.2, 450, 0.25);
      addBox(4,   0.25, 7,  -6.25, 6.65, 0.2, 650, 0.35);

      // Vertical structural columns (floor 1–2)
      for (let i = 0; i < 6; i++) {
        addBox(0.22, 6.6, 0.22, -4.5 + i * 1.8, 3.5, 3.0, 250 + i * 60, 0.28);
      }

      // Horizontal spandrel beams
      for (let j = 0; j < 4; j++) {
        addBox(10, 0.1, 6.5, -0.5, 3.15 + j * 3.2, 0.2, 200 + j * 140, 0.40);
      }

      // Windows — floor 1 façade (front)
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 2; row++) {
          addBox(0.85, 1.35, 0.08,
            -3.8 + col * 2.0, 1.2 + row * 1.7, 3.28,
            900 + col * 60 + row * 120, 0.55);
        }
      }

      // Windows — floor 2 façade
      for (let col = 0; col < 5; col++) {
        addBox(0.85, 1.35, 0.08,
          -3.8 + col * 2.0, 4.6, 3.28,
          1100 + col * 60, 0.50);
      }

      // Balcony rail (thin flat slab extruding from floor 3)
      addBox(7.8, 0.08, 1.2, -0.5, 7.65, 3.2, 800, 0.45);

      /* ── Blueprint grid on ground plane ─────── */
      const gridMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.12,
      });
      for (let i = -10; i <= 10; i++) {
        const pts = [
          new THREE.Vector3(i, -0.1, -10),
          new THREE.Vector3(i, -0.1,  10),
        ];
        scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts), gridMat
        ));
        const pts2 = [
          new THREE.Vector3(-10, -0.1, i),
          new THREE.Vector3( 10, -0.1, i),
        ];
        scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts2), gridMat
        ));
      }

      /* ── Dimension / construction lines ─────── */
      const dimMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.18,
      });
      // Vertical height line
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(7.5, -0.1, -4.5),
          new THREE.Vector3(7.5, 18,   -4.5),
        ]), dimMat
      ));
      // Horizontal datum line
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-8, 3.25, -4.5),
          new THREE.Vector3( 8, 3.25, -4.5),
        ]), dimMat
      ));

      /* ── Animation loop ───────────────────────  */
      const clock = new THREE.Clock();
      let elapsed = 0;

      const tick = () => {
        animFrame = requestAnimationFrame(tick);
        const delta = clock.getDelta();
        elapsed += delta * 1000;

        // Parts rise into position with staggered delay
        for (const p of parts) {
          if (elapsed < p.delay) continue;
          const diff = p.targetY - p.mesh.position.y;
          if (Math.abs(diff) > 0.002) {
            p.mesh.position.y += diff * 0.06;
          }
        }

        // Slow orbital drift
        const t = elapsed * 0.00006;
        scene.rotation.y = Math.sin(t) * 0.12;

        renderer.render(scene, camera);
      };
      tick();

      /* ── Resize ───────────────────────────────── */
      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(animFrame);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
