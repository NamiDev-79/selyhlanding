"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/*
 * Las dos barras del logo en 3D (three.js): cápsulas de vidrio lacado que siguen el puntero y respiran.
 * Proporciones del manual: ancho 140, alta 715, corta 442, separación 53 (en unidades: ancho = 1).
 *
 * Cuidado con el rendimiento y la accesibilidad:
 *   · three se carga solo en el navegador y solo cuando el bloque está cerca de la pantalla;
 *   · se dibuja únicamente mientras está visible (IntersectionObserver) y a lo sumo con densidad 1,5×;
 *   · con «reducir movimiento», ahorro de datos o equipos de ≤ 4 núcleos se dibuja un solo fotograma quieto;
 *   · al desmontar se liberan geometrías, materiales, entorno y contexto WebGL.
 */

const W = 1;
const TALL = 715 / 140;
const SHORT = 442 / 140;
const GAP = 53 / 140;

export function Bars3D({ className, tall = "#ffffff", short = "#a2a2fa" }: { className?: string; tall?: string; short?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    // Carga diferida: three entra solo cuando el bloque está a menos de una pantalla de distancia.
    const loadWhenNear = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        loadWhenNear.disconnect();
        void start();
      },
      { rootMargin: "100% 0px" },
    );
    loadWhenNear.observe(el);

    async function start() {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed || !el) return;

      // Quieto (un solo fotograma) con «reducir movimiento», con ahorro de datos o en equipos de pocos núcleos.
      const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData || (navigator.hardwareConcurrency ?? 8) <= 4;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // sin WebGL: el bloque queda vacío y la sección sigue funcionando
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 1,5× basta para formas lisas y ahorra ~45 % de píxeles frente a 2×
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0.2, 17);

      const key = new THREE.DirectionalLight("#ffffff", 1.6);
      key.position.set(4, 6, 6);
      scene.add(key, new THREE.HemisphereLight("#eeeefd", "#4f4fd6", 0.6));

      const capsule = (h: number) => {
        const g = new THREE.CapsuleGeometry(W / 2, h - W, 16, 48);
        g.translate(0, h / 2, 0); // origen en la base: así la barra «respira» desde abajo, como en el logo
        return g;
      };
      const glossy = (color: string) =>
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenColor: new THREE.Color("#a2a2fa") });

      const gTall = capsule(TALL);
      const gShort = capsule(SHORT);
      const mTall = glossy(tall);
      const mShort = glossy(short);
      const barTall = new THREE.Mesh(gTall, mTall);
      const barShort = new THREE.Mesh(gShort, mShort);
      barTall.position.x = -(W + GAP) / 2;
      barShort.position.x = (W + GAP) / 2;

      const group = new THREE.Group();
      group.add(barTall, barShort);
      group.position.y = -TALL / 2;
      group.rotation.set(0.08, -0.2, 0.04);
      scene.add(group);

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (reduce) renderer.render(scene, camera);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // Puntero: inclina el grupo con suavidad (interpolación, nunca saltos).
      const target = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let visible = true;
      const io = new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !reduce) loop();
      });
      io.observe(el);

      const t0 = performance.now();
      let raf = 0;
      const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

      function frame(now: number) {
        const t = (now - t0) / 1000;
        // Entrada: la alta cae primero y la corta crece después (0,62 s de retraso), como en la animación del logo.
        const inTall = Math.min(1, t / 0.9);
        const inShort = Math.min(1, Math.max(0, (t - 0.62) / 0.62));
        barTall.scale.y = reduce ? 1 : Math.max(0.001, easeOutBack(inTall));
        const breathe = 1 - 0.06 * (0.5 - 0.5 * Math.cos(((t - 1.6) / 3.2) * Math.PI * 2)) * (t > 1.6 ? 1 : 0);
        barShort.scale.y = reduce ? 1 : Math.max(0.001, easeOutBack(inShort) * breathe);

        group.rotation.y += (-0.2 + target.x * 0.45 + Math.sin(t * 0.4) * 0.06 - group.rotation.y) * 0.05;
        group.rotation.x += (0.08 + target.y * 0.18 - group.rotation.x) * 0.05;
        group.position.y = -TALL / 2 + Math.sin(t * 0.8) * 0.08;
        renderer.render(scene, camera);
      }

      function loop() {
        cancelAnimationFrame(raf);
        const tick = (now: number) => {
          if (!visible || disposed) return;
          frame(now);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }

      if (reduce) frame(t0 + 10_000);
      else loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        gTall.dispose();
        gShort.dispose();
        mTall.dispose();
        mShort.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    }

    return () => {
      disposed = true;
      loadWhenNear.disconnect();
      cleanup();
    };
  }, [tall, short]);

  return <div ref={host} aria-hidden className={cn("pointer-events-none", className)} />;
}
