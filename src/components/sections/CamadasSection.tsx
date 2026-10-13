"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { content } from "@/content";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

// ============================================================
// CAMADAS — cópia do "Introducing the Legora aOS".
//
// Como lá: um trilho de ~5,5 telas com o vídeo preso na tela; o scroll
// manda no tempo do vídeo (as placas descem e se empilham), as pílulas
// cinza translúcidas à esquerda dizem o que é cada camada e a ativa abre
// num card com a descrição; no canto de baixo, a pílula de progresso.
// Medidas copiadas da Legora: pílula de 36px, fundo preto 50% com blur de
// 27.5px, raio 24px, texto de 12px; coluna a 24px da borda e 150px do topo;
// progresso de 110x30px a 30px do rodapé.
//
// O vídeo é um render 3D (Blender, docs/video/camadas/blender/cena.py),
// codificado com keyframe a cada 6 quadros e sem B-frames, pra o seek
// acompanhar o scroll sem travar; o tempo segue o scroll com uma suavização
// curta. No celular entra um recorte quadrado da pilha (camadas-mobile.mp4)
// sobre um fundo no mesmo cinza das bordas, e só o card da camada ativa fica
// na tela — a coluna inteira de pílulas não cabe na vertical.
// ============================================================

// Tempos do vídeo (tabela da cena em docs/video/camadas/blender/cena.py).
// TROCA: quando o card passa para a camada — com a peça já quase pousando e o
// nome dela à vista (trocar no início da descida mostrava o card novo com a
// placa anterior ainda no topo). POUSO: onde o clique na pílula para — a peça
// assentada no topo da pilha, com o nome legível.
const TROCA_CARD = [0, 2.0, 3.15, 4.3, 5.55, 7.7, 8.8];
const POUSO = [1.35, 2.5, 3.65, 4.8, 6.3, 8.2, 9.05];
const DURACAO_VIDEO = 11;

export default function CamadasSection() {
  const { camadas } = content;
  const n = camadas.itens.length;
  const root = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const [ativa, setAtiva] = useState(0);

  useGSAP(
    () => {
      const v = video.current;
      const t = trilho.current;
      if (!v || !t) return;

      // A versão (recorte quadrado no celular) é escolhida aqui e trocada se a
      // largura cruzar o breakpoint: <source media> só é avaliado no carregamento.
      const celular = window.matchMedia("(max-width: 767px)");
      const escolher = () => {
        const src = celular.matches ? "/camadas/camadas-mobile.mp4" : "/camadas/camadas.mp4";
        if (v.getAttribute("src") === src) return;
        const tempo = v.currentTime;
        v.src = src;
        v.addEventListener("loadedmetadata", () => (v.currentTime = tempo), { once: true });
      };
      escolher();
      celular.addEventListener("change", escolher);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const fim = () => (v.currentTime = Math.max(0, v.duration - 0.05));
        if (v.readyState >= 1) fim();
        else v.addEventListener("loadedmetadata", fim, { once: true });
        setAtiva(n - 1);
        if (barra.current) barra.current.style.width = "100%";
        return () => celular.removeEventListener("change", escolher);
      }

      let alvo = 0;
      let atual = 0;
      let raf = 0;
      const seguir = () => {
        atual += (alvo - atual) * 0.18;
        if (Math.abs(alvo - atual) < 0.004) atual = alvo;
        if (v.readyState >= 1 && Math.abs(v.currentTime - atual) > 0.001) v.currentTime = atual;
        raf = atual === alvo ? 0 : requestAnimationFrame(seguir);
      };

      const st = ScrollTrigger.create({
        trigger: t,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          alvo = p * (v.duration || 0);
          if (!raf) raf = requestAnimationFrame(seguir);
          if (barra.current) barra.current.style.width = `${p * 100}%`;
          const tempo = p * DURACAO_VIDEO;
          let i = 0;
          while (i < n - 1 && tempo >= TROCA_CARD[i + 1]) i++;
          setAtiva((a) => (a === i ? a : i));
        },
      });

      return () => {
        st.kill();
        cancelAnimationFrame(raf);
        celular.removeEventListener("change", escolher);
      };
    },
    { scope: root },
  );

  // Clicar numa pílula leva o scroll até o trecho daquela camada.
  const irPara = (i: number) => {
    const t = trilho.current;
    if (!t) return;
    const topo = t.getBoundingClientRect().top + window.scrollY;
    const curso = t.offsetHeight - window.innerHeight;
    const tempo = POUSO[i] ?? 0;
    window.scrollTo({ top: topo + (tempo / DURACAO_VIDEO) * curso, behavior: "smooth" });
  };

  return (
    <section ref={root} id="plataforma" aria-labelledby="camadas-titulo" className="relative">
      <div className="mx-auto max-w-[900px] px-6 pt-28 pb-10 text-center md:pt-36">
        <h2
          id="camadas-titulo"
          className="font-[family-name:var(--font-archivo)] text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.08] font-normal tracking-[-0.035em] text-balance text-fg"
        >
          {camadas.titulo}
        </h2>
        <p className="mt-4 text-[15px] text-muted">{camadas.sub}</p>
      </div>

      <div ref={trilho} className="relative h-[550svh]">
        <div className="sticky top-0 h-svh overflow-hidden bg-[linear-gradient(#d7d7d9_0%,#d7d7d9_50%,#ecedef_50%,#ecedef_100%)] md:bg-[#e6e6e8]">
          <video
            ref={video}
            className="absolute inset-x-0 top-1/2 aspect-square w-full -translate-y-1/2 object-cover md:inset-0 md:aspect-auto md:h-full md:translate-y-0"
            poster="/camadas/camadas-poster.jpg"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          <ul className="absolute inset-x-4 bottom-[76px] z-10 flex flex-col items-start gap-[9px] md:inset-x-auto md:top-[150px] md:bottom-auto md:left-6">
            {camadas.itens.map((c, i) =>
              i === ativa ? (
                <li key={c.titulo} aria-current="step">
                  <div className="w-[min(340px,calc(100vw-32px))] rounded-[24px] bg-black/50 px-5 py-[15px] text-white backdrop-blur-[27.5px]">
                    <p className="text-[12px] text-white/70">{c.titulo}</p>
                    <p className="mt-1.5 text-[15px] leading-[1.45]">{c.texto}</p>
                  </div>
                </li>
              ) : (
                <li key={c.titulo} className="hidden md:block">
                  <button
                    type="button"
                    onClick={() => irPara(i)}
                    className="flex h-9 items-center gap-2 rounded-[24px] bg-black/50 py-2.5 pr-2.5 pl-[15px] text-[12px] text-white backdrop-blur-[27.5px] transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    {c.titulo}
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                      <Plus className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                    </span>
                  </button>
                </li>
              ),
            )}
          </ul>

          <div
            aria-hidden="true"
            className="absolute bottom-[30px] left-4 z-10 flex h-[30px] w-[110px] items-center rounded-[32px] bg-black/40 px-[15px] backdrop-blur-md md:left-6"
          >
            <span className="relative h-[5px] w-full overflow-hidden rounded-[5px] bg-white/25">
              <span ref={barra} className="absolute inset-y-0 left-0 w-0 rounded-[5px] bg-white" />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 pt-8 pb-24 md:px-10">
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
