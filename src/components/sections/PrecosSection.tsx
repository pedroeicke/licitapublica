"use client";

import { useRef } from "react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/motion/Reveal";
import StaggerReveal from "@/components/motion/StaggerReveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// PESQUISA DE PREÇOS — mergulho claro.
//
// Esta é a seção mais técnica e mais vendedora do site ("o achado mais
// comum dos tribunais"). No original ela era um parágrafo denso seguido de
// dez pills soltas — informação de conformidade tratada como tag cloud.
//
// Aqui a Curva ABC vira gráfico de verdade, com as barras crescendo por
// scroll e o total contando até o valor. Números que se movem são lidos;
// números estáticos dentro de parágrafo, não.
//
// A cor segue a regra: barras em OURO (dado), nunca em verde (verde só age).
// ============================================================

export default function PrecosSection() {
  const { precos } = content;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Barras da curva
      gsap.fromTo(
        ".pp-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".pp-curva", start: "top 78%", once: true },
        }
      );

      // Contador do total. Anima um objeto e formata em pt-BR a cada tick —
      // interpolar a string direto quebraria a separação de milhar.
      const alvo = { v: 0 };
      const final = 212495;
      const el = root.current?.querySelector<HTMLElement>(".pp-total");
      if (!el) return;
      gsap.to(alvo, {
        v: final,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ".pp-curva", start: "top 78%", once: true },
        onUpdate: () => {
          el.textContent = alvo.v.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="precos"
      aria-labelledby="precos-title"
      className="relative scroll-mt-28 border-t border-line px-6 py-24 md:px-10 md:py-36"
    >
      <div ref={root} className="mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{precos.eyebrow}</SectionEyebrow>

        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionTitle id="precos-title" lines={precos.titleLines} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
                {precos.body}
              </p>
            </Reveal>

            <StaggerReveal className="mt-9 flex flex-wrap gap-2" stagger={0.035}>
              {precos.artefatos.map((a) => (
                <span
                  key={a}
                  className="data rounded-full border border-line bg-paper-2 px-3.5 py-2 text-[11.5px] text-muted"
                >
                  {a}
                </span>
              ))}
            </StaggerReveal>
          </div>

          {/* CURVA ABC */}
          <Reveal y={40}>
            <figure className="pp-curva rounded-3xl border border-line bg-white p-7 shadow-[0_28px_70px_-34px_rgba(13,20,60,.3)] md:p-9">
              <figcaption className="data flex items-center justify-between text-[11px] tracking-[0.14em] text-muted uppercase">
                {precos.curva.titulo}
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              </figcaption>

              <div className="mt-8 space-y-6">
                {precos.curva.faixas.map((f) => (
                  <div key={f.classe}>
                    <div className="flex items-baseline justify-between">
                      <span className="data text-sm font-semibold text-fg">
                        Classe {f.classe}
                      </span>
                      <span className="data text-sm text-muted">
                        {f.valor}
                      </span>
                    </div>
                    <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-paper-2">
                      <div
                        className="pp-bar h-full rounded-full bg-blue"
                        style={{ width: `${f.pct}%` }}
                      />
                    </div>
                    <span className="data mt-1.5 block text-[10.5px] text-muted/70">
                      {f.pct.toFixed(1)}% do valor estimado
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex items-baseline justify-between border-t border-line pt-6">
                <span className="text-[13px] text-muted">
                  {precos.curva.totalLabel}
                </span>
                <span className="pp-total data text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold text-fg">
                  {precos.curva.total}
                </span>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
