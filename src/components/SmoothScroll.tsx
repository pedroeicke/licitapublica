"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

function Sync() {
  // ReactLenis já roda o próprio rAF (autoRaf). Não driblar via gsap.ticker
  // — double-rAF trava o scroll. Aqui só sincronizamos o ScrollTrigger.
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    // Reload sempre no topo: senão o hero pinado calcula progresso > 0 e o
    // texto "aparece e some".
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
    // Pin-spacer já criado → libera a cortina (#tese) sem risco de sobrepor
    // o hero por um frame.
    document.documentElement.classList.add("lp-ready");
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    // O Lenis não intercepta links de âncora: um clique em #ciclo faria o
    // salto nativo instantâneo, que num site com pin fica desorientador
    // (e ainda por cima o navegador pousa em cima do pin-spacer, não na
    // seção). Delegamos no document pra pegar também os links que entram
    // depois no DOM.
    const onClick = (e: MouseEvent) => {
      // respeita ctrl/cmd-clique, botão do meio e afins
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;

      const alvo = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!alvo) return;

      const hash = alvo.getAttribute("href");
      if (!hash || hash === "#") return;

      const destino = document.querySelector(hash);
      if (!destino) return;

      e.preventDefault();
      lenis.scrollTo(destino as HTMLElement, {
        // desconta a pill flutuante da nav
        offset: -90,
        duration: 1.3,
      });
      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <Sync />
      {children}
    </ReactLenis>
  );
}
