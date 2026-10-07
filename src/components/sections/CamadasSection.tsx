"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";

// ============================================================
// CAMADAS — a dobra no formato do "Introducing the Legora aOS".
//
// Lá, um vídeo 3D preso na tela avança com o scroll e as camadas do
// sistema descem e se empilham, enquanto um card ao lado diz o que é cada
// uma. Aqui a mesma ideia sem vídeo: as seis placas de vidro foram geradas
// no GPT (todas como edição da primeira, pra terem o mesmo ângulo) e o
// scroll calcula a posição de cada uma a cada quadro. Fica suave em
// qualquer velocidade de rolagem, o texto é HTML de verdade e a página
// carrega ~230 KB de imagem em vez de um vídeo.
//
// Ordem: a primeira placa é a base (fontes públicas) e cada nova assenta
// por cima. O trilho tem uma tela de altura por camada, mais uma de pausa
// no fim com a pilha completa.
//
// A largura da placa também segue a altura da tela (46svh): a pilha
// completa mede ~1,6× a largura e tem que caber abaixo do menu em notebook.
// ============================================================

export default function CamadasSection() {
  const { camadas } = content;
  const n = camadas.itens.length;
  const root = useRef<HTMLElement>(null);
  const cardTexto = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState(0);

  useGSAP(
    () => {
      const placas = gsap.utils.toArray<HTMLElement>(".cm-placa", root.current);
      const trilho = root.current?.querySelector<HTMLElement>(".cm-trilho");
      if (!placas.length || !trilho) return;

      // Distância entre uma placa e a de baixo, proporcional à largura dela.
      const passo = () => placas[0].offsetWidth * 0.15;
      const finalY = (i: number) => ((n - 1) / 2 - i) * passo();
      gsap.set(placas, { xPercent: -50, yPercent: -50 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        placas.forEach((p, i) => gsap.set(p, { y: finalY(i), autoAlpha: 1 }));
        setAtiva(n - 1);
        return;
      }

      const pausa = 0.7;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trilho,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const i = Math.min(n - 1, Math.floor(st.progress * (n + pausa)));
            setAtiva((anterior) => (anterior === i ? anterior : i));
          },
        },
      });
      placas.forEach((p, i) => {
        tl.fromTo(
          p,
          { y: () => -window.innerHeight * 0.85, autoAlpha: 0, scale: 0.92 },
          { y: () => finalY(i), autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" },
          i,
        );
      });
      tl.to({}, { duration: pausa });
    },
    { scope: root },
  );

  // O texto do card troca com um fade curto, como o card da Legora.
  useEffect(() => {
    if (!cardTexto.current) return;
    gsap.fromTo(cardTexto.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" });
  }, [ativa]);

  const atual = camadas.itens[ativa];

  return (
    <section ref={root} id="plataforma" aria-labelledby="camadas-titulo" className="relative">
      <div className="mx-auto max-w-[900px] px-6 pt-28 text-center md:pt-36">
        <h2
          id="camadas-titulo"
          className="font-[family-name:var(--font-archivo)] text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08] font-normal tracking-[-0.035em] text-balance text-fg"
        >
          {camadas.titulo}
        </h2>
        <p className="mt-4 text-[15px] text-muted">{camadas.sub}</p>
      </div>

      <div className="cm-trilho relative" style={{ height: `${(n + 1) * 90}svh` }}>
        <div className="sticky top-0 h-svh overflow-hidden">
          {camadas.itens.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={c.titulo}
              src={c.img}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="cm-placa pointer-events-none absolute top-[44%] left-1/2 w-[min(64vw,430px,46svh)] select-none md:top-[54%] md:left-[58%]"
              style={{ zIndex: i + 1 }}
            />
          ))}

          <div className="absolute inset-x-6 bottom-8 z-20 md:inset-x-auto md:top-1/2 md:bottom-auto md:left-[8vw] md:w-[320px] md:-translate-y-1/2">
            <div className="rounded-2xl border border-line bg-white/85 p-5 shadow-[0_18px_44px_-24px_rgba(13,20,60,0.35)] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.14em] text-muted uppercase">
                  Camada {ativa + 1} de {n}
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  {camadas.itens.map((c, i) => (
                    <span
                      key={c.titulo}
                      className={`h-1 w-4 rounded-full transition-colors duration-300 ${i <= ativa ? "bg-navy" : "bg-line"}`}
                    />
                  ))}
                </span>
              </div>
              <div ref={cardTexto} aria-live="polite">
                <p className="mt-3 text-[13px] font-semibold text-fg">{atual.titulo}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{atual.texto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 pt-4 pb-24 md:px-10">
        <p className="max-w-[46ch] text-[15px] text-fg">{camadas.rodape}</p>
        <a
          href={camadas.link.href}
          className="text-[13px] font-medium text-fg underline-offset-4 transition-colors hover:text-blue hover:underline"
        >
          ↳ {camadas.link.label}
        </a>
      </div>
    </section>
  );
}
