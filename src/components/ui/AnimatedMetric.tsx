"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// ============================================================
// MÉTRICA QUE CONTA — do zero até o valor, na entrada em cena.
//
// POR QUE ELE NÃO PARECIA CONTAR: o número final ficava escrito até o
// ScrollTrigger disparar. Aí o contador começava em 0 e o texto SALTAVA
// PRA TRÁS antes de subir. Em tela alta, com a seção já meio visível, o
// que se via era só o salto. Agora o zero é escrito na montagem, então a
// contagem começa de onde deveria — não há para onde voltar.
//
// O ease e a duração são os mesmos do relógio da seção "Quem está por
// trás" (expo.out, 1.8s): os dois contadores do site aceleram e freiam
// igual, senão parecem dois efeitos diferentes fazendo a mesma coisa.
//
// FORMATO PRESERVADO. O valor chega como texto ("+10", "3", "30.000+"),
// e o que se anima é só a parte numérica: prefixo e sufixo ficam parados,
// e o ponto de milhar volta a cada quadro se o original tinha um. Sem
// isso "30.000+" contaria como "30000" e perderia a pontuação no meio.
//
// O valor real vive num `sr-only` fixo. O nó animado é aria-hidden: leitor
// de tela lê o número uma vez, e não um contador mudando.
// ============================================================

/** Quebra "30.000+" em ["", "30.000", "+"]. */
function partes(valor: string) {
  const m = valor.match(/^(\D*)([\d.,]+)(\D*)$/);
  if (!m) return null;
  const [, prefixo, numero, sufixo] = m;
  const digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  return {
    prefixo,
    sufixo,
    final: Number(digitos),
    agrupado: numero.includes("."),
  };
}

export default function AnimatedMetric({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const p = partes(value);
      if (!p) return;

      // Sem movimento, o número fica parado no valor final. Escrever zero
      // aqui deixaria a métrica errada na tela pra quem pediu menos
      // animação — que é o oposto do que a preferência pede.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const escrever = (n: number) => {
        const corpo = p.agrupado ? n.toLocaleString("pt-BR") : String(n);
        el.textContent = `${p.prefixo}${corpo}${p.sufixo}`;
      };

      const conta = { v: 0 };
      escrever(0);

      gsap.to(conta, {
        v: p.final,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => escrever(Math.round(conta.v)),
        // Arredondamento no meio do caminho pode não pousar exato no fim.
        onComplete: () => escrever(p.final),
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
    </>
  );
}
