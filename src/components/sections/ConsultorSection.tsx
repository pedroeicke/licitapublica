"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "@/components/motion/Reveal";
import Marquee from "@/components/ui/Marquee";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// CONSULTOR — a prova de que a IA não alucina.
//
// Este é o argumento comercial mais delicado do produto: "a IA pode
// inventar uma lei?". No original a resposta e a fonte estavam no mesmo
// bloco visual, então o leitor não via a ESTRUTURA da garantia.
//
// Aqui a sequência é encenada por scroll: pergunta → resposta → a fonte
// oficial ancorando por baixo. O card da fonte entra por último e é o
// único elemento com borda em ouro na tela: é o dado que sustenta tudo.
// ============================================================

export default function ConsultorSection() {
  const { consultor } = content;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: { ease: "expo.out", duration: 0.85 },
          scrollTrigger: { trigger: ".cs-thread", start: "top 74%", once: true },
        })
        .from(".cs-pergunta", { autoAlpha: 0, y: 26, x: -14 })
        .from(".cs-resposta", { autoAlpha: 0, y: 26, x: 14 }, "-=0.5")
        // a fonte "encaixa" por baixo — daí o y maior e o ease mais longo
        .from(".cs-fonte", { autoAlpha: 0, y: 42, duration: 1.05 }, "-=0.35")
        .from(".cs-ref", { backgroundSize: "0% 100%", duration: 0.7 }, "-=0.55");
    },
    { scope: root }
  );

  return (
    <section
      id="consultor"
      aria-labelledby="consultor-title"
      className="relative scroll-mt-28 px-6 py-24 md:px-10 md:py-36"
    >
      {/* fundo e orbes: MergulhoNavy — Consultor e Grafo dividem um campo só */}
      <div ref={root} className="relative mx-auto w-full max-w-[900px]">
        <SectionEyebrow className="mb-9">{consultor.eyebrow}</SectionEyebrow>

        <Reveal>
          <SectionTitle
            id="consultor-title"
            lines={consultor.titleLines}
            className="max-w-[20ch]"
          />
        </Reveal>

        <div className="cs-thread mt-14 space-y-4">
          {/* PERGUNTA */}
          <div className="cs-pergunta max-w-[76%]">
            <p className="eyebrow mb-2.5 text-faint">
              {consultor.pergunta.autor}
            </p>
            <div className="card rounded-tl-sm px-6 py-5 text-[15.5px] leading-relaxed text-fg">
              {consultor.pergunta.texto}
            </div>
          </div>

          {/* RESPOSTA */}
          <div className="cs-resposta ml-auto max-w-[86%]">
            <p className="eyebrow mb-2.5 text-right text-leaf">
              {consultor.resposta.autor}
            </p>
            <div className="card card-on rounded-tr-sm px-6 py-5 text-[15.5px] leading-relaxed text-fg">
              {consultor.resposta.antes}
              {/* o dispositivo citado é grifado por um background que "risca"
                  da esquerda pra direita na entrada — sublinha a âncora sem
                  usar cor de link */}
              <strong
                className="cs-ref data bg-no-repeat px-0.5 font-semibold text-gold"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(247,203,78,0.16), rgba(247,203,78,0.16))",
                  backgroundSize: "100% 100%",
                }}
              >
                {consultor.resposta.ref}
              </strong>
              {consultor.resposta.depois}
            </div>
          </div>

          {/* FONTE — a âncora */}
          <figure className="cs-fonte !mt-8 rounded-2xl border border-gold/30 bg-gold/[0.06] p-6 md:p-7">
            <figcaption className="data flex items-center gap-2.5 text-[11px] tracking-[0.14em] text-gold uppercase">
              <Quote className="h-3.5 w-3.5" strokeWidth={2.2} />
              {consultor.fonte.label}
            </figcaption>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-fg/90 italic">
              “{consultor.fonte.citacao}”
            </blockquote>
          </figure>
        </div>
      </div>

      <div className="mt-20 text-gold/80">
        <Marquee itens={consultor.marquee} duration={52} />
      </div>
    </section>
  );
}
