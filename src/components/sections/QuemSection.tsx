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
    },
    { scope: root }
  );

  return (
    <section
      id="quem"
      aria-labelledby="quem-title"
      className="relative scroll-mt-28 px-6 py-24 md:px-10 md:py-36"
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
              <div className="flex items-start">
                <span className="qs-num data text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.85] font-semibold text-fg">
                  0
                </span>
                <span className="data mt-2 text-[clamp(1.6rem,3vw,2.4rem)] leading-none font-medium text-blue">
                  {quem.destaque.sufixo}
                </span>
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
