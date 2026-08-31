"use client";

import { useRef, useState } from "react";
import { content } from "@/content";
import { Flip, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// TELAS — set-piece 2: troca de abas com GSAP Flip.
//
// O Flip mede o estado antes e depois da troca e interpola a diferença.
// Resultado: o indicador da aba DESLIZA até a nova posição e o painel
// cresce/encolhe suavemente, em vez de sumir e reaparecer. É a diferença
// entre "trocou de conteúdo" e "a interface se moveu" — e é o que faz o
// mockup parecer software de verdade, não screenshot em tabs.
//
// O <div> do indicador é UM elemento só, com data-flip-id: por isso ele
// pode viajar entre botões.
// ============================================================

export default function TelasSection() {
  const { telas } = content;
  const root = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState(0);

  // Estado capturado ANTES do React repintar; a animação roda depois.
  const trocar = (i: number) => {
    if (i === ativa) return;
    // Só o indicador: ele é o único elemento que sobrevive à troca de aba
    // (mesmo data-flip-id, pai diferente), que é a condição pro Flip
    // interpolar em vez de apenas reposicionar.
    const state = Flip.getState(".telas-indicator");
    setAtiva(i);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.62,
        ease: "power3.inOut",
        absolute: true,
      });
      gsap.fromTo(
        ".telas-body > *",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.05,
          overwrite: "auto",
        }
      );
    });
  };

  const aba = telas.abas[ativa];

  return (
    <section
      id="telas"
      aria-labelledby="telas-title"
      className="relative scroll-mt-28 px-6 py-24 md:px-10 md:py-36"
    >
      <div ref={root} className="relative mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{telas.eyebrow}</SectionEyebrow>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionTitle id="telas-title" lines={telas.titleLines} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">
              {telas.body}
            </p>
          </Reveal>
        </div>

        {/* ABAS */}
        <div
          role="tablist"
          aria-label="Telas do produto"
          className="mt-14 flex flex-wrap gap-1.5 rounded-full border border-line bg-paper-2 p-1.5"
        >
          {telas.abas.map((a, i) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={i === ativa}
              aria-controls={`painel-${a.id}`}
              onClick={() => trocar(i)}
              className={cn(
                "relative rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-colors duration-300",
                i === ativa ? "text-white" : "text-muted hover:text-fg"
              )}
            >
              {/* o indicador vive DENTRO do botão ativo — o Flip o carrega
                  de um botão pro outro */}
              {i === ativa && (
                <span
                  data-flip-id="telas-indicator"
                  className="telas-indicator absolute inset-0 rounded-full bg-navy"
                />
              )}
              <span className="relative z-10">{a.label}</span>
            </button>
          ))}
        </div>

        {/* PAINEL — moldura de aplicação */}
        <div
          id={`painel-${aba.id}`}
          role="tabpanel"
          className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_28px_70px_-32px_rgba(13,20,60,.35)]"
        >
          {/* barra de janela */}
          <div className="flex items-center gap-2.5 border-b border-line bg-paper-2 px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-navy/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-navy/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-navy/12" />
            <span className="data ml-3 truncate text-[11px] text-muted">
              licitapublica.app / {aba.id}
            </span>
          </div>

          <div className="telas-body grid gap-8 p-7 md:grid-cols-[1.05fr_1fr] md:p-10">
            <div>
              <h3 className="display-tight text-[clamp(1.4rem,2.2vw,2rem)] text-fg">
                {aba.title}
              </h3>
              <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                {aba.desc}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {aba.chips.map((c) => (
                  <span
                    key={c}
                    className="data rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[11.5px] text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* wireframe abstrato: linhas de documento + bloco de dado.
                Placeholder honesto — troca por screenshot real do produto
                assim que o cliente liberar. */}
            <div
              aria-hidden
              className="rounded-2xl border border-line bg-paper-2 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="data text-[10px] tracking-[0.18em] text-muted uppercase">
                  {aba.label}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              </div>
              <div className="mt-5 space-y-2.5">
                {[92, 78, 86, 64, 88, 71, 44].map((w, i) => (
                  <div
                    key={i}
                    className="h-2 rounded-full bg-navy/8"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-line bg-white p-4">
                <div className="h-2 w-16 rounded-full bg-navy/12" />
                <div className="data mt-3 text-xl font-medium text-fg">
                  R$ 212.495,00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
