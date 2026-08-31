"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// ============================================================
// RIBBON SPINE — a coluna vertebral visual do site.
//
// A ideia é do próprio cliente ("espiral de 3 fitas atravessa a página
// seguindo o scroll") e é a melhor coisa do site original — só que lá ela
// ficava soterrada sob partículas genéricas. Aqui ela é O elemento:
// as três fitas revelando-se por scroll, do topo ao rodapé, atrás de todo
// o conteúdo. Em três tons de azul: o motivo das fitas fica, a cor segue a
// paleta do site (azul e branco).
//
// TÉCNICA — por que clip-path e não stroke-dashoffset:
// o SVG precisa esticar pra cobrir a página inteira (preserveAspectRatio
// ="none"). Com a escala não-uniforme, o comprimento devolvido por
// getTotalLength() é em unidades do viewBox, enquanto o traço com
// vector-effect="non-scaling-stroke" — que é o que impede o traço de
// engordar na esticada — passa a medir o dash em pixels de tela. As duas
// contas não batem, e o desenho fica adiantado ou nunca completa.
//
// clip-path: inset(0 0 X% 0) não tem esse problema: é uma porcentagem da
// própria caixa, imune a qualquer escala. Uma propriedade só, composta na
// GPU, e o efeito lido é o mesmo — a fita descendo conforme você rola.
//
// Cada fita tem um scrub diferente: elas se separam e se reencontram, que
// é o que faz parecer trança e não três linhas paralelas.
// ============================================================

const FITAS = [
  {
    d: "M 120 0 C 120 420, 880 520, 880 940 C 880 1360, 140 1440, 140 1880 C 140 2320, 900 2380, 900 2820 C 900 3260, 160 3320, 160 3760 C 160 4180, 880 4260, 880 4700 C 880 5140, 200 5200, 200 5600 C 200 5820, 500 5900, 640 6000",
    stroke: "var(--lp-blue)",
    width: 2,
    opacity: 0.34,
    scrub: 0.4,
  },
  {
    d: "M 152 0 C 152 430, 912 530, 912 950 C 912 1370, 172 1450, 172 1890 C 172 2330, 932 2390, 932 2830 C 932 3270, 192 3330, 192 3770 C 192 4190, 912 4270, 912 4710 C 912 5150, 232 5210, 232 5610 C 232 5830, 532 5910, 672 6000",
    stroke: "var(--lp-blue-lite)",
    width: 1.6,
    opacity: 0.3,
    scrub: 0.85,
  },
  {
    d: "M 184 0 C 184 440, 944 540, 944 960 C 944 1380, 204 1460, 204 1900 C 204 2340, 964 2400, 964 2840 C 964 3280, 224 3340, 224 3780 C 224 4200, 944 4280, 944 4720 C 944 5160, 264 5220, 264 5620 C 264 5840, 564 5920, 704 6000",
    stroke: "var(--lp-blue-soft)",
    width: 1,
    opacity: 0.28,
    scrub: 1.3,
  },
];

export default function RibbonSpine() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const camadas = gsap.utils.toArray<HTMLElement>(".ribbon-layer");
      if (!camadas.length) return;

      camadas.forEach((camada, i) => {
        gsap.fromTo(
          camada,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: FITAS[i].scrub,
            },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden"
    >
      {FITAS.map((f, i) => (
        // Uma camada por fita: o clip-path precisa ser por-fita pra que os
        // scrubs diferentes possam divergir.
        <div key={i} className="ribbon-layer absolute inset-0">
          <svg
            className="h-full w-full"
            viewBox="0 0 1000 6000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d={f.d}
              stroke={f.stroke}
              strokeWidth={f.width}
              strokeOpacity={f.opacity}
              strokeLinecap="round"
              // impede que a esticada não-uniforme engorde o traço
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
