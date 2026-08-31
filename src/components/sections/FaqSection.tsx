"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import Section, { SectionTitle } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

// ============================================================
// FAQ — "o que o setor de compras vai perguntar".
//
// Accordion controlado em vez de <details>: precisamos animar a altura, e
// <details> não interpola (abre num salto). grid-template-rows 0fr → 1fr
// é o truque de CSS puro que anima altura automática sem medir nada em JS.
//
// Uma aberta por vez: são seis perguntas longas; deixar todas abertas
// devolve exatamente o paredão de texto que a seção existe pra evitar.
// ============================================================

export default function FaqSection() {
  const { faq } = content;
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow={faq.eyebrow}
     
      inner="max-w-[880px]"
    >
      <Reveal>
        <SectionTitle id="faq-title" lines={faq.titleLines} />
      </Reveal>

      <div className="mt-14 divide-y divide-line border-y border-line">
        {faq.itens.map((item, i) => {
          const on = aberta === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  onClick={() => setAberta(on ? null : i)}
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "display-tight text-[17px] transition-colors duration-300 md:text-[19px]",
                      on ? "text-blue" : "text-fg"
                    )}
                  >
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      "mt-1 h-[18px] w-[18px] shrink-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      on ? "rotate-[135deg] text-blue" : "text-faint"
                    )}
                    strokeWidth={2}
                  />
                </button>
              </h3>

              <div
                id={`faq-${i}`}
                role="region"
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[62ch] pr-10 pb-7 text-[15px] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
