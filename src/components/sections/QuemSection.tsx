"use client";

import { useRef } from "react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// QUEM ESTÁ POR TRÁS — mergulho claro, e o número que fecha o argumento.
//
// O "80%" é a promessa mais forte do site inteiro e no original era só
// texto grande. Aqui ele conta de 0 a 80 por scroll, com o "%" já parado
// ao lado: o olho pega o movimento, o número chega, a frase explica.
//
// A nota "nada de depoimento inventado nem número inflado" fica logo
// abaixo, de propósito — é o que dá licença pro número ser grande.
// ============================================================

export default function QuemSection() {
  const { quem } = content;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current?.querySelector<HTMLElement>(".qs-num");
      if (!el) return;

      // A contagem também respeita a preferência por menos movimento. Ela
      // ficava de fora: o aro parava, o número continuava correndo, e o
      // mesmo dado se comportava de dois jeitos na mesma caixa.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const obj = { v: 0 };
      gsap.to(obj, {
        v: Number(quem.destaque.valor),
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: { trigger: ".qs-destaque", start: "top 80%", once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });

      {
        // O aro se fecha no MESMO compasso do número (expo.out, 1.8s):
        // são a mesma informação dita de dois jeitos, então precisam
        // chegar juntos. Com `pathLength=100` o traço é medido em
        // porcentagem, e o destino é literalmente o valor — sem constante
        // de circunferência pra recalcular se o raio mudar.
        gsap.fromTo(".qs-aro", { strokeDashoffset: 100 }, {
          strokeDashoffset: 100 - Number(quem.destaque.valor),
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: ".qs-destaque", start: "top 80%", once: true },
        });
      }
    },
    { scope: root }
  );

  return (
    <section
      id="quem"
      aria-labelledby="quem-title"
      className="relative scroll-mt-28 px-6 py-16 md:px-10 md:py-24"
    >
      <div ref={root} className="mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{quem.eyebrow}</SectionEyebrow>

        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionTitle id="quem-title" lines={quem.titleLines} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
                {quem.body}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-[52ch] border-l-2 border-blue pl-5 text-[14.5px] leading-relaxed text-fg">
                {quem.nota}
              </p>
            </Reveal>
          </div>

          <Reveal y={40}>
            <div className="qs-destaque flex h-full flex-col justify-center rounded-3xl border border-line bg-paper-2 p-9 md:p-11">
              {/* O "%" cola no número. Antes o relógio vinha entre os dois
                  com ml-auto, e "80" e "%" acabavam separados pela largura
                  do card — deixavam de ler como uma grandeza só. */}
              <div className="flex items-start justify-between gap-6">
                <span className="flex items-start">
                  <span className="qs-num data text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.85] font-semibold text-fg">
                    {quem.destaque.valor}
                  </span>
                  <span className="data mt-2 text-[clamp(1.6rem,3vw,2.4rem)] leading-none font-medium text-blue">
                    {quem.destaque.sufixo}
                  </span>
                </span>

                {/* Aro no lugar do mostrador de relógio. O relógio desenhado
                    era decoração: um ponteiro girando 288° não dizia nada
                    que o número já não dissesse, e ainda pedia leitura de
                    hora onde não há hora. O aro mostra os 80% de verdade —
                    é o mesmo dado, medido. -rotate-90 põe o começo do traço
                    às 12h; sem isso ele partiria das 3h. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="mt-1 h-20 w-20 shrink-0 -rotate-90 sm:h-24 sm:w-24"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    strokeWidth="7"
                    stroke="currentColor"
                    className="text-blue/12"
                  />
                  <circle
                    className="qs-aro text-blue"
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    strokeWidth="7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="100"
                    strokeDashoffset={100 - Number(quem.destaque.valor)}
                  />
                </svg>
              </div>
              <p className="mt-8 max-w-[30ch] text-[15.5px] leading-relaxed text-muted">
                {quem.destaque.desc}
              </p>
              <p className="display-tight mt-4 text-xl text-fg">
                {quem.destaque.reforco}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
