"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";

// ============================================================
// HERO — o filme em tela cheia, no formato do hero da Legora.
//
// O filme do LicitaPública foi feito plano a plano em cima do comercial que
// abre o site da Legora, então o hero segue a mesma moldura dele:
//   - vídeo cobrindo a viewport inteira, mudo e em loop;
//   - um degradê escuro só nas bordas (50% em cima, 70% embaixo, 10% no
//     meio), que dá leitura ao menu e ao título sem apagar o filme. Embaixo
//     é mais forte que o da Legora porque o filme abre na cidade holográfica,
//     com os prédios de luz atrás do título;
//   - título único, centralizado, perto do rodapé, peso regular e
//     espaçamento negativo (-0.04em, 1.05 de entrelinha);
//   - abaixo dele, uma linha de apoio e o botão em pílula com a setinha.
// O hero anterior (palco do produto com mergulho no scroll) está em
// Hero.anterior.tsx.
// ============================================================

export default function Hero() {
  const { hero } = content;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const video = root.current?.querySelector("video");
      // O pôster não aceita `media`: no celular troca pelo quadro do filme vertical.
      if (video && window.matchMedia("(max-width: 767px)").matches) {
        video.poster = "/hero-filme-mobile-poster.jpg";
      }
      const semMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // Com movimento reduzido o filme fica no pôster.
      if (video && semMovimento) {
        video.pause();
        return;
      }
      // Pausa fora da tela: não gastar decodificação com o hero rolado.
      let io: IntersectionObserver | undefined;
      if (video) {
        io = new IntersectionObserver(
          ([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()),
          { threshold: 0.05 },
        );
        io.observe(video);
      }

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".hf-title", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.5 }, 0.25)
        .fromTo(".hf-sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.6);

      return () => io?.disconnect();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-navy-deep text-white"
    >
      {/* No celular entra a versão vertical (9:16), recortada plano a plano
          para manter a pessoa ou o texto no quadro; o `object-cover` sozinho
          cortaria sempre o meio do filme horizontal. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/hero-filme-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/hero-filme-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/hero-filme.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 13%, rgba(0,0,0,0.1) 58%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* sombra suave no texto: o filme tem cenas de tela clara, onde o
          branco sozinho some (o degradê das bordas não basta nelas) */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-[60px] text-center [text-shadow:0_1px_28px_rgba(0,0,0,0.35)] md:px-[30px]">
        <h1
          id="hero-title"
          className="hf-title mx-auto font-[family-name:var(--font-archivo)] text-[clamp(2.1rem,3.9vw,3.6rem)] leading-[1.05] font-normal tracking-[-0.04em] text-balance"
        >
          {hero.titleLines.join(" ")}
        </h1>

        <div className="hf-sub mt-[30px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <p className="text-[15px] text-white">{hero.filmeSub}</p>
          <a
            href="#demo"
            className="group inline-flex h-[30px] items-center gap-2 rounded-full bg-navy-2 pr-[5px] pl-3.5 text-[12px] text-white transition-colors duration-300 hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {hero.ctaPrimary}
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
