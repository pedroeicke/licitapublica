// ============================================================
// VERSÃO ANTERIOR do grafo — arestas retas, sem bloom.
//
// COMO VOLTAR: em src/app/page.tsx troque
//   import GrafoSection from "@/components/sections/GrafoSection";
// por
//   import GrafoSection from "@/components/sections/GrafoSection.anterior";
//
// Nenhum outro arquivo precisa mudar: a interface é a mesma (componente sem
// props). Se decidir ficar com a versão nova, é só apagar este arquivo.
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// GRAFO — o clímax.
//
// Decisão editorial: no site do cliente isto era a seção 6, enterrada, e
// o hero gastava WebGL numa constelação genérica que não significava nada.
// Mas o grafo É a tese do produto — dados públicos ligados, resposta com
// fonte. Então a constelação genérica sai e ESTE canvas fica, no lugar de
// destaque, porque aqui cada ponto tem nome e cada linha tem sentido.
//
// Implementação em canvas 2D, não WebGL: são ~8 nós e ~7 arestas. WebGL
// custaria um runtime inteiro pra desenhar o que o 2D desenha de graça,
// e o 2D degrada melhor.
//
// Os pulsos correm SEMPRE no sentido fonte → processo → resposta. É a
// direção da leitura do argumento, encenada.
// ============================================================

type No = {
  label: string;
  // posição normalizada (0..1) sobre a área do canvas
  x: number;
  y: number;
  tipo: "fonte" | "processo" | "resposta";
  // estado de animação
  px?: number;
  py?: number;
  glow?: number;
};

const LAYOUT: No[] = [
  { label: "Lei 14.133", x: 0.09, y: 0.16, tipo: "fonte" },
  { label: "Decretos", x: 0.06, y: 0.44, tipo: "fonte" },
  { label: "TCU · TCEs", x: 0.11, y: 0.74, tipo: "fonte" },
  { label: "PNCP", x: 0.3, y: 0.09, tipo: "fonte" },
  { label: "SINAPI", x: 0.26, y: 0.9, tipo: "fonte" },
  { label: "BPS", x: 0.4, y: 0.62, tipo: "fonte" },
  { label: "Seu processo", x: 0.55, y: 0.36, tipo: "processo" },
  { label: "Resposta com fonte", x: 0.85, y: 0.55, tipo: "resposta" },
];

// Fonte em azul-acinzentado, processo no azul de ação, resposta em branco:
// a informação vai ganhando luz conforme atravessa o grafo. É a mesma ideia
// do argumento — dado bruto entra, resposta verificada sai.
const COR = {
  fonte: "#7C8CB8",
  processo: "#8ACB52",
  resposta: "#F7CB4E",
} as const;

export default function GrafoSectionAnterior() {
  const { grafo } = content;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const nos: No[] = LAYOUT.map((n) => ({ ...n, glow: 0 }));
    const iProcesso = nos.findIndex((n) => n.tipo === "processo");
    const iResposta = nos.findIndex((n) => n.tipo === "resposta");

    // Arestas com direção: toda fonte alimenta o processo; o processo
    // produz a resposta.
    const arestas: [number, number][] = nos
      .map((n, i) => (n.tipo === "fonte" ? ([i, iProcesso] as [number, number]) : null))
      .filter((e): e is [number, number] => e !== null);
    arestas.push([iProcesso, iResposta]);

    // Um pulso por aresta, com fase inicial espalhada pra não pulsarem
    // todos juntos (o que pareceria um piscar, não um fluxo).
    const pulsos = arestas.map((_, i) => ({ t: (i / arestas.length) * 0.9 }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999, dentro: false };
    let raf = 0;
    let visivel = true;

    const medir = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // margem interna pra os rótulos não encostarem na borda
      const mx = 78;
      const my = 34;
      nos.forEach((n) => {
        n.px = mx + n.x * (w - mx * 2);
        n.py = my + n.y * (h - my * 2);
      });
    };

    const raio = (n: No) =>
      n.tipo === "processo" ? 7 : n.tipo === "resposta" ? 6.5 : 4;

    const desenhar = () => {
      ctx.clearRect(0, 0, w, h);

      // --- arestas ---
      arestas.forEach(([a, b], i) => {
        const A = nos[a];
        const B = nos[b];
        if (A.px == null || B.px == null) return;

        const aceso = Math.max(A.glow ?? 0, B.glow ?? 0);
        ctx.beginPath();
        ctx.moveTo(A.px, A.py!);
        ctx.lineTo(B.px, B.py!);
        ctx.strokeStyle = `rgba(124,140,184,${0.14 + aceso * 0.5})`;
        ctx.lineWidth = 1 + aceso * 0.6;
        ctx.stroke();

        // --- pulso viajando no sentido do argumento ---
        if (!reduzido) {
          const p = pulsos[i];
          const t = p.t;
          const x = A.px + (B.px - A.px) * t;
          const y = A.py! + (B.py! - A.py!) * t;
          const cor = B.tipo === "resposta" ? COR.resposta : COR.processo;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, cor);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.globalAlpha = 0.55 + aceso * 0.45;
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // --- nós ---
      nos.forEach((n) => {
        if (n.px == null) return;
        const cor = COR[n.tipo];
        const r = raio(n);
        const glow = n.glow ?? 0;

        // halo
        if (n.tipo !== "fonte" || glow > 0.01) {
          const g = ctx.createRadialGradient(n.px, n.py!, 0, n.px, n.py!, r * 6);
          g.addColorStop(0, cor);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = 0.12 + glow * 0.3;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.px, n.py!, r * 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(n.px, n.py!, r + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = cor;
        ctx.fill();

        // rótulo
        ctx.font =
          n.tipo === "fonte"
            ? "500 11px ui-monospace, monospace"
            : "600 12.5px ui-monospace, monospace";
        ctx.fillStyle =
          n.tipo === "fonte"
            ? `rgba(150,164,198,${0.6 + glow * 0.4})`
            : cor;
        ctx.textBaseline = "middle";
        // rótulo à esquerda quando o nó está na metade direita, pra não
        // sair da tela
        const paraEsquerda = n.px > w * 0.72;
        ctx.textAlign = paraEsquerda ? "right" : "left";
        ctx.fillText(
          n.label,
          n.px + (paraEsquerda ? -(r + 10) : r + 10),
          n.py!
        );
      });
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visivel) return;

      if (!reduzido) {
        pulsos.forEach((p, i) => {
          // velocidade um pouco diferente por aresta: o fluxo respira em
          // vez de marchar em bloco
          p.t += 0.0034 + (i % 3) * 0.0006;
          if (p.t > 1) p.t = 0;
        });
      }

      // glow por proximidade do mouse, com decaimento suave
      nos.forEach((n) => {
        if (n.px == null) return;
        let alvo = n.tipo === "fonte" ? 0 : 0.25;
        if (mouse.dentro) {
          const d = Math.hypot(mouse.x - n.px, mouse.y - n.py!);
          if (d < 120) alvo = Math.max(alvo, 1 - d / 120);
        }
        n.glow = (n.glow ?? 0) + (alvo - (n.glow ?? 0)) * 0.12;
      });

      desenhar();
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.dentro = true;
    };
    const onLeave = () => {
      mouse.dentro = false;
    };

    // Só anima quando está na tela — canvas rodando fora de vista é bateria
    // queimada à toa.
    const io = new IntersectionObserver(
      ([entry]) => {
        visivel = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    medir();
    tick();
    window.addEventListener("resize", medir);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", medir);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      id="grafo"
      aria-labelledby="grafo-title"
      className="dive-navy relative scroll-mt-28 overflow-hidden px-6 py-24 md:px-10 md:py-36"
    >
      <div
        aria-hidden
        className="orb orb-a top-[-10%] right-[-6%] h-[56vh] w-[48vw] max-w-[720px]"
        style={{ background: "radial-gradient(closest-side, rgba(91,155,255,0.45), transparent)", opacity: 0.7 }}
      />
      <div
        aria-hidden
        className="orb orb-b bottom-[-16%] left-[-10%] h-[50vh] w-[44vw] max-w-[660px]"
        style={{ background: "radial-gradient(closest-side, rgba(43,98,224,0.5), transparent)", opacity: 0.65 }}
      />
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{grafo.eyebrow}</SectionEyebrow>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionTitle id="grafo-title" lines={grafo.titleLines} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">
              {grafo.body}
            </p>
          </Reveal>
        </div>

        <Reveal y={44} className="mt-14">
          <div
            ref={wrapRef}
            className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/[0.07] bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] md:h-[520px]"
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        </Reveal>

        {/* Lista textual dos nós: o canvas é aria-hidden por natureza, então
            a informação precisa existir em HTML pra leitor de tela e pra
            quem tem JS desligado. */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {grafo.nos.map((n) => (
              <li key={n} className="data text-[11px] text-faint">
                {n}
              </li>
            ))}
          </ul>
          <p className="data text-[11px] text-faint">{grafo.rodape}</p>
        </div>
      </div>
    </section>
  );
}
