"use client";

import { useRef, useState } from "react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { SectionEyebrow } from "@/components/ui/Section";
import GlowCard from "@/components/ui/GlowCard";

// ============================================================
// O CICLO — set-piece principal: scroll horizontal pinado.
//
// No site do cliente as nove etapas eram uma lista vertical numerada, e
// era o pedaço mais importante do produto tratado como o mais chato da
// página. Um processo é uma sequência: mostrar em horizontal transforma
// "ler nove itens" em "percorrer um fluxo".
//
// A barra de progresso em cima não é enfeite — em pin longo o usuário
// precisa saber quanto falta, senão sente que travou o scroll.
//
// MOBILE: pin horizontal em touch é hostil (briga com o gesto nativo de
// voltar). Abaixo de 768px vira carrossel com scroll-snap nativo, que é
// o gesto que o usuário já espera.
// ============================================================

export default function CicloHorizontal() {
  const { ciclo } = content;
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [ativo, setAtivo] = useState(0);

  useGSAP(
    () => {
      if (isMobile || !track.current) return;

      const t = track.current;
      const distancia = () => t.scrollWidth - window.innerWidth;

      // Trilho e barra de progresso na MESMA timeline: um trigger só, e a
      // barra nunca dessincroniza do que está na tela.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          // A duração do pin acompanha a largura real do trilho: cards a
          // mais não deixam o scroll mais apertado, só mais longo.
          end: () => `+=${distancia()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          // onUpdate roda a cada frame do scrub: setState direto aqui
          // re-renderizaria os nove cards ~60×/s. O React descarta um
          // setState com o mesmo valor, mas só depois de reconciliar —
          // então filtramos antes.
          onUpdate: (self) => {
            const i = Math.round(self.progress * (ciclo.etapas.length - 1));
            setAtivo((anterior) => (anterior === i ? anterior : i));
          },
        },
      });

      tl.to(t, { x: () => -distancia(), ease: "none" }, 0).to(
        ".ciclo-bar",
        { scaleX: 1, ease: "none" },
        0,
      );
    },
    { scope: root, dependencies: [isMobile], revertOnUpdate: true },
  );

  return (
    <section id="ciclo" aria-labelledby="ciclo-title" className="relative">
      {/* h-svh e NADA de min-height maior que a viewport: seção pinada mais
          alta que a tela tem o rodapé cortado por construção, e era isso que
          colava os cards no limite de baixo. O espaçamento abaixo do trilho
          é explícito (pb) em vez de "o que sobrar". */}
      <div ref={root} className="relative h-svh min-h-[680px] overflow-hidden">
        <div
          aria-hidden
          className="orb orb-a top-[-20%] right-[-10%] h-[60vh] w-[52vw] max-w-[760px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(91,155,255,0.5), transparent)",
            opacity: 0.55,
          }}
        />

        {/* cabeçalho fixo enquanto o trilho corre */}
        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 pt-24 md:px-10">
          <SectionEyebrow>{ciclo.eyebrow}</SectionEyebrow>
          <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2
              id="ciclo-title"
              className="display-tight max-w-[14ch] text-[length:var(--text-giant)] text-fg"
            >
              {ciclo.titleLines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </h2>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">
              {ciclo.intro}
            </p>
          </div>

          {/* progresso: trilho + contador de etapa */}
          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-px flex-1 bg-line-strong">
              <span className="ciclo-bar absolute inset-0 origin-left scale-x-0 bg-blue" />
            </div>
            <span className="data shrink-0 text-xs text-faint">
              <span className="text-blue">
                {String(ativo + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(ciclo.etapas.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* TRILHO */}
        <div className="relative mt-8">
          <div
            ref={track}
            className={cn(
              "flex gap-5 pb-14 md:pb-20",
              isMobile
                ? "snap-x snap-mandatory overflow-x-auto px-6 [scrollbar-width:none]"
                : "w-max px-6 md:px-10",
            )}
          >
            {ciclo.etapas.map((e, i) => (
              <GlowCard
                key={e.n}
                as="article"
                className={cn(
                  "group flex w-[78vw] shrink-0 snap-center flex-col justify-between p-7 sm:w-[62vw] md:w-[380px]",
                  !isMobile && i === ativo && "card-on",
                )}
                style={{ minHeight: 300 }}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    {/* número gigante em outline: marca a posição na sequência
                      sem competir com o título da etapa */}
                    <span
                      className={cn(
                        "data text-[3.4rem] leading-none font-semibold transition-colors duration-500",
                        !isMobile && i === ativo
                          ? "text-blue/70"
                          : "text-navy/[0.08]",
                      )}
                    >
                      {e.n}
                    </span>
                    {/* a base legal em mono: é dado verificável, não copy */}
                    <span className="data rounded-full border border-line px-2.5 py-1 text-[10.5px] text-faint">
                      {e.ref}
                    </span>
                  </div>

                  <h3 className="display-tight mt-5 text-2xl text-fg">
                    {e.title}
                  </h3>
                  <p className="mt-3.5 text-[14.5px] leading-relaxed text-muted">
                    {e.desc}
                  </p>
                </div>

                {/* conector: sugere que o card seguinte herda deste */}
                <div className="mt-7 flex items-center gap-2 text-faint">
                  <span className="h-px w-full bg-line" />
                  <span className="data shrink-0 text-[10px] tracking-[0.18em] uppercase">
                    {i < ciclo.etapas.length - 1
                      ? "herda contexto"
                      : "ciclo fechado"}
                  </span>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
