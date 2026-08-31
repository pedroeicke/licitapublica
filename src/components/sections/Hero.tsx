"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import HeroStage from "./HeroStage";

// ============================================================
// HERO — palco. Manchete centralizada, produto subindo do rodapé.
//
// O QUE ESTAVA ERRADO NAS VERSÕES ANTERIORES
// v1: uma coluna de tipografia empilhada. Promessa sem produto.
// v2: texto à esquerda, mockup num card à direita. Layout de SaaS —
//     correto, previsível, e nada aconteceu quando o cliente entrou.
//
// O QUE MUDA AQUI
// A tela do produto deixa de ser uma figura ao lado do texto e vira o
// PALCO: larga, deitada em perspectiva, cortada pela borda inferior da
// viewport. Retângulo inteiro dentro da tela é figura — você olha pra ela.
// Retângulo que sai da tela é espaço — você está dentro dele.
//
// O palco é ancorado pelo TOPO (top: 74%), não empurrado pelo fluxo: a
// faixa visível vira sempre ~26% da tela e o resto é cortado pela borda
// inferior. No fluxo normal isso dependia de quanto o texto tinha sobrado,
// e em tela curta o palco sumia embaixo da dobra.
//
// Duas camadas de movimento, ambas baratas:
//
//  1. ENTRADA — a manchete sobe atrás de máscara, o palco emerge de baixo
//     com a perspectiva mais fechada e vai abrindo. Cinematográfico sem um
//     único frame de canvas.
//
//  2. MERGULHO NO SCROLL — a tela SE LEVANTA (rotationX → 0) e sobe até
//     caber inteira, enquanto o texto recua e desfoca. A ação termina, o
//     corte se resolve, e só então o navy da tese entra.
//
// A tela usa `transformOrigin: 50% 0%`: ela se levanta ancorada na aresta
// de cima, que é a mesma aresta que o leitor já está vendo. Ancorada no
// centro, a parte visível desceria durante o movimento.
// ============================================================

// Onde o topo da tela para no fim do mergulho: abaixo da pill da nav, com
// folga. É o que garante que ela caiba inteira na viewport.
const TOPO_FINAL = 104;

// Respiro entre a base da tela e a borda inferior da viewport.
const FOLGA_INFERIOR = 28;

export default function Hero() {
  const { hero } = content;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Dois elementos, duas responsabilidades:
      //   .hs-tilt   → inclinação e mergulho (scroll)
      //   .hs-window → entrada (fade + subida)
      // Juntos no mesmo nó, o tween de scroll gravava como estado inicial o
      // "from" da entrada e a tela saltava ao rolar.
      const tilt = root.current?.querySelector<HTMLElement>(".hs-tilt");
      if (!tilt) return;

      const video = root.current?.querySelector<HTMLVideoElement>(".hs-video");
      const semMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // play()/pause() rejeitam quando o navegador ainda não liberou a
      // reprodução (aba em segundo plano, política de mídia). Engolir é
      // correto aqui: o poster continua na tela e nada quebra.
      const tocar = () => {
        if (!video || semMovimento || !video.paused) return;
        video.play().catch(() => {});
      };
      const pausar = () => {
        if (!video || video.paused) return;
        video.pause();
      };

      gsap.set(tilt, { transformOrigin: "50% 0%", rotationX: 20 });

      // ---------- 1. ENTRADA ----------
      // fromTo, não from. O `.from()` lê o estado FINAL do elemento no
      // momento em que o tween é criado — e em dev o React monta o
      // componente duas vezes, então o segundo `.from()` lia o estado
      // inicial deixado pelo primeiro e o gravava como destino. Resultado:
      // o botão preenchido ficava 16px abaixo do outro, desalinhado.
      // Com fromTo os dois estados são explícitos e nada depende de quando
      // o tween nasceu.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".h-eyebrow",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
        )
        .fromTo(
          ".h-line-inner",
          { yPercent: 116 },
          { yPercent: 0, stagger: 0.1, duration: 1.25 },
          "-=0.35",
        )
        .fromTo(
          ".h-sub",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 1 },
          "-=0.85",
        )
        .fromTo(
          ".h-cta",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9 },
          "-=0.8",
        )
        .fromTo(
          ".hs-window",
          { autoAlpha: 0, yPercent: 24 },
          { autoAlpha: 1, yPercent: 0, duration: 1.5 },
          "-=1",
        )
        .fromTo(
          ".h-float",
          { autoAlpha: 0, y: 24, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.9 },
          "-=0.9",
        )
        .fromTo(
          ".h-trust",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          "-=0.7",
        );

      // ---------- 2. MERGULHO NO SCROLL ----------
      // A ação TERMINA dentro do pin: a tela se levanta e para inteira na
      // viewport, legível. Antes ela crescia (scale 1.16) e continuava
      // cortada, então o movimento nunca resolvia — e a seção azul entrava
      // por cima no meio do caminho.
      //
      // A timeline tem 1.0 de duração: 0.72 pro movimento e 0.28 de PAUSA
      // no fim. Essa pausa é o que dá ao usuário o momento de ver a tela
      // parada antes do próximo movimento começar.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Quanto a tela precisa subir pra encostar logo abaixo do header.
        const subida = () => {
          const palco = tilt.parentElement as HTMLElement | null;
          if (!palco) return 0;
          return TOPO_FINAL - palco.offsetTop;
        };

        // E quanto ela pode crescer sem estourar a viewport. Com o vídeo a
        // janela ficou mais alta que o mockup que havia antes, e uma escala
        // fixa passou a estourar a borda de baixo em telas curtas — o corte
        // nunca se resolvia, que era justamente o problema a corrigir.
        //
        // O teto de 1.2 existe pra telas altas: sem ele, a tela cresceria
        // até preencher e o efeito viraria zoom, não "levantar".
        const escala = () => {
          const disponivel = window.innerHeight - TOPO_FINAL - FOLGA_INFERIOR;
          const altura = tilt.offsetHeight || 1;
          return Math.min(1.2, disponivel / altura);
        };

        // Ambas são funções e o trigger usa invalidateOnRefresh: recalculam
        // a cada resize em vez de congelar a primeira medição.

        // A timeline é guardada numa const porque o onUpdate precisa ler o
        // progresso DELA, não o do ScrollTrigger. Com scrub: 0.7 o
        // movimento visível fica até 0,7s atrás do scroll — usando o
        // progresso do trigger, o vídeo começaria a tocar enquanto a tela
        // ainda estivesse subindo.
        const tl = gsap.timeline({
          onUpdate: () => {
            const p = tl.progress();
            if (p >= 0.72) tocar();
            else if (p < 0.66) pausar();
          },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=130%",
            pin: true,
            pinSpacing: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        // 0.72 é exatamente onde o movimento termina na timeline; o resto
        // é a pausa. Os dois limiares diferentes — 0.72 pra tocar, 0.66 pra
        // pausar — evitam que o vídeo fique ligando e desligando se o
        // usuário parar de rolar em cima do ponto de virada.
        tl.to(
          ".h-text",
          {
            yPercent: -22,
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 0.5,
            ease: "power2.in",
          },
          0,
        )
          .to(".h-floats", { autoAlpha: 0, y: -30, duration: 0.45 }, 0)
          // a tela se levanta e sobe até caber inteira
          .to(
            tilt,
            {
              rotationX: 0,
              y: subida,
              scale: escala,
              duration: 0.72,
              ease: "power2.inOut",
            },
            0,
          )
          // PAUSA: a ação fica finalizada e visível antes da cortina
          .to({}, { duration: 0.28 });
      });

      // No mobile não existe mergulho (o pin briga com o gesto de scroll),
      // então o gatilho do vídeo passa a ser simplesmente estar em cena.
      mm.add("(max-width: 767px)", () => {
        if (!video) return;
        const io = new IntersectionObserver(
          ([entrada]) => (entrada.isIntersecting ? tocar() : pausar()),
          { threshold: 0.4 },
        );
        io.observe(video);
        return () => io.disconnect();
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative flex h-svh min-h-[640px] flex-col overflow-hidden bg-paper"
    >
      {/* ---------- ambiente ---------- */}
      <div
        aria-hidden
        className="orb orb-b absolute top-[-24%] left-[-12%] h-[60vh] w-[50vw] max-w-[720px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(43,98,224,0.28), transparent)",
        }}
      />
      <div
        aria-hidden
        className="orb orb-a absolute top-[-16%] right-[-10%] h-[56vh] w-[46vw] max-w-[680px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.32), transparent)",
        }}
      />

      {/* ---------- MANCHETE ---------- */}
      <div className="relative z-10 flex flex-1 items-center pt-24 pb-[224px]">
        <div className="h-text mx-auto w-full max-w-[1240px] px-6 text-center md:px-10">
          <p className="h-eyebrow eyebrow inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-3.5 py-2 text-blue backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            {hero.eyebrow}
          </p>

          <h1 className="display mx-auto mt-7 text-[length:var(--text-mega)] text-fg">
            {hero.titleLines.map((line, i) => (
              <span
                key={i}
                className="-mb-[0.16em] block overflow-hidden pb-[0.16em]"
              >
                <span className="h-line-inner block">{line}</span>
              </span>
            ))}
          </h1>

          <p className="h-sub mx-auto mt-6 max-w-[56ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
            {hero.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a href="#demo" className="h-cta cta">
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a href="#ciclo" className="h-cta cta-ghost">
              {hero.ctaGhost}
            </a>
          </div>

          <div className="h-trust mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {hero.stats.map((s) => (
              <span key={s.label} className="flex items-baseline gap-1.5">
                <span className="data text-[15px] font-medium text-blue">
                  {s.value}
                </span>
                <span className="text-[12.5px] text-muted">{s.label}</span>
              </span>
            ))}
            <span className="eyebrow text-faint">{hero.credito}</span>
          </div>
        </div>
      </div>

      {/* ---------- PALCO ---------- */}
      {/* mt-auto joga a tela pro fim do flex: ela encosta na borda inferior
          e é cortada por ela (overflow-hidden na seção). */}
      <div
        className="absolute inset-x-0 top-[74%] flex justify-center px-6 md:px-10"
        style={{ perspective: "1700px", perspectiveOrigin: "50% 0%" }}
      >
        <div className="hs-tilt w-[min(980px,92vw)]">
          <HeroStage />
        </div>

        {/* Flutuantes sobre o palco. O wrapper existe pro tween de scroll
            ter um alvo próprio: se ele animasse os mesmos nós da entrada,
            gravaria o "from" dela (autoAlpha 0) como estado inicial e os
            cards nunca apareceriam. */}
        <div className="h-floats pointer-events-none absolute inset-0 z-20">
          <div className="h-float card absolute -top-16 left-[3vw] hidden rounded-xl bg-white/95 px-4 py-3 backdrop-blur-sm lg:block">
            <p className="data text-[9px] tracking-[0.16em] text-blue uppercase">
              {hero.visual.fonte.titulo}
            </p>
            <p className="data mt-1.5 text-[11.5px] font-medium text-fg">
              {hero.visual.fonte.ref}
            </p>
          </div>

          <div className="h-float absolute -top-20 right-[3vw] hidden rounded-2xl border border-blue/25 bg-navy px-5 py-4 text-white shadow-[0_22px_50px_-18px_rgba(43,98,224,0.75)] lg:block">
            <div className="display text-[2.1rem] leading-none text-blue-lite">
              {hero.visual.badge.valor}
            </div>
            <p className="mt-1.5 max-w-[13ch] text-[11px] leading-snug text-white/70">
              {hero.visual.badge.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
