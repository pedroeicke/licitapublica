"use client";

import { useEffect, useRef } from "react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";

// ============================================================
// GRAFO — o clímax.
//
// No site do cliente isto era a seção 6, enterrada, e o hero gastava WebGL
// numa constelação genérica que não significava nada. Mas o grafo É a tese
// do produto — dados públicos ligados, resposta com fonte. Aqui cada ponto
// tem nome e cada linha tem sentido.
//
// Canvas 2D, não WebGL: são 8 nós e 7 arestas. WebGL custaria um runtime
// inteiro (three + fiber, ~150kb) pra desenhar o que o 2D desenha de graça.
//
// ------------------------------------------------------------------
// O QUE MUDOU EM RELAÇÃO À VERSÃO ANTERIOR (guardada em
// GrafoSection.anterior.tsx). Três coisas, e nenhuma exige dependência
// nova — é o que separa "gradiente azul" de "isso tem luz":
//
//  1. BLOOM DE VERDADE. A luz é desenhada uma segunda vez num canvas
//     fora de tela, borrada e composta por cima com `lighter`. Glow que
//     SANGRA pra fora do traço, em vez de um radial-gradient colado
//     atrás de cada ponto.
//
//     O canvas de brilho roda a METADE da resolução: borrar custa em
//     função da área, e como o resultado é borrado de qualquer jeito,
//     ninguém percebe a diferença. Quatro vezes mais barato.
//
//  2. ARESTAS CURVAS. Bezier quadrática com o ponto de controle deslocado
//     perpendicularmente ao meio da reta, alternando o lado por índice —
//     as linhas se abrem em leque em vez de convergirem como raios de
//     roda. E o pulso percorre a CURVA, não a corda dela.
//
//  3. DESENHO PROGRESSIVO. Ao entrar em cena as arestas se desenham da
//     fonte até o processo, e do processo até a resposta — a direção do
//     argumento acontece uma vez, na frente do leitor, antes de virar
//     loop.
// ============================================================

type No = {
  label: string;
  // posição normalizada (0..1) sobre a área do canvas
  x: number;
  y: number;
  tipo: "fonte" | "processo" | "resposta";
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

// Fonte em azul-acinzentado, processo no verde da marca, resposta em ouro:
// a informação vai ganhando luz conforme atravessa o grafo. É o argumento
// encenado — dado bruto entra, resposta verificada sai.
const COR = {
  fonte: "#7C8CB8",
  processo: "#8ACB52",
  resposta: "#F7CB4E",
} as const;

// Quanto a aresta se afasta da reta, em fração do seu comprimento.
const CURVATURA = 0.13;
// Escala do canvas de brilho. 0.5 = metade da resolução em cada eixo.
const ESCALA_BRILHO = 0.5;

/** Ponto sobre a bezier quadrática em t. */
function pontoBezier(
  ax: number,
  ay: number,
  cx: number,
  cy: number,
  bx: number,
  by: number,
  t: number
) {
  const u = 1 - t;
  return {
    x: u * u * ax + 2 * u * t * cx + t * t * bx,
    y: u * u * ay + 2 * u * t * cy + t * t * by,
  };
}

export default function GrafoSection() {
  const { grafo } = content;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas de brilho: mesma cena, só o que emite luz, em meia resolução.
    const brilho = document.createElement("canvas");
    const bctx = brilho.getContext("2d");

    // `ctx.filter` não existe em navegador antigo. Sem ele o bloom é
    // pulado e o grafo continua legível — degrada, não quebra.
    const temFiltro = (() => {
      if (!bctx) return false;
      ctx.filter = "blur(1px)";
      const ok = ctx.filter !== "none";
      ctx.filter = "none";
      return ok;
    })();

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const nos: No[] = LAYOUT.map((n) => ({ ...n, glow: 0 }));
    const iProcesso = nos.findIndex((n) => n.tipo === "processo");
    const iResposta = nos.findIndex((n) => n.tipo === "resposta");

    // Toda fonte alimenta o processo; o processo produz a resposta.
    const arestas: [number, number][] = nos
      .map((n, i) =>
        n.tipo === "fonte" ? ([i, iProcesso] as [number, number]) : null
      )
      .filter((e): e is [number, number] => e !== null);
    arestas.push([iProcesso, iResposta]);

    // Fase inicial espalhada: sem isso todos os pulsos piscariam juntos e
    // pareceriam um flash, não um fluxo.
    const pulsos = arestas.map((_, i) => ({ t: (i / arestas.length) * 0.9 }));
    // Progresso do desenho de entrada, por aresta.
    const desenho: number[] = arestas.map(() => (reduzido ? 1 : 0));
    let entrou = reduzido;
    let frames = 0;

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

      if (bctx) {
        brilho.width = Math.max(1, Math.round(w * ESCALA_BRILHO));
        brilho.height = Math.max(1, Math.round(h * ESCALA_BRILHO));
        bctx.setTransform(ESCALA_BRILHO, 0, 0, ESCALA_BRILHO, 0, 0);
      }

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

    /** Ponto de controle da curva: perpendicular ao meio, lado alternado. */
    const controle = (A: No, B: No, i: number) => {
      const ax = A.px!;
      const ay = A.py!;
      const bx = B.px!;
      const by = B.py!;
      const dx = bx - ax;
      const dy = by - ay;
      const comp = Math.hypot(dx, dy) || 1;
      const lado = i % 2 === 0 ? 1 : -1;
      const desloc = comp * CURVATURA * lado;
      return {
        ax,
        ay,
        bx,
        by,
        cx: (ax + bx) / 2 + (-dy / comp) * desloc,
        cy: (ay + by) / 2 + (dx / comp) * desloc,
      };
    };

    /** Traça a curva de 0 até `t`. Subdividir é exato o bastante e evita
     *  ter que medir o comprimento do arco pra usar lineDash. */
    const tracarAte = (
      c: ReturnType<typeof controle>,
      t: number,
      alvo: CanvasRenderingContext2D
    ) => {
      const passos = 26;
      alvo.beginPath();
      alvo.moveTo(c.ax, c.ay);
      for (let s = 1; s <= passos; s++) {
        const p = pontoBezier(
          c.ax,
          c.ay,
          c.cx,
          c.cy,
          c.bx,
          c.by,
          (s / passos) * t
        );
        alvo.lineTo(p.x, p.y);
      }
      alvo.stroke();
    };

    /** Desenha a cena. `luz` = só o que emite (vai pro canvas de brilho). */
    const cena = (alvo: CanvasRenderingContext2D, luz: boolean) => {
      arestas.forEach(([a, b], i) => {
        const A = nos[a];
        const B = nos[b];
        if (A.px == null || B.px == null) return;
        const t = desenho[i];
        if (t <= 0.001) return;

        const c = controle(A, B, i);
        const aceso = Math.max(A.glow ?? 0, B.glow ?? 0);

        // Na camada de luz a aresta entra só quando está acesa: linha
        // parada não deve brilhar, senão o bloom vira névoa uniforme.
        if (!luz || aceso > 0.02) {
          alvo.strokeStyle = luz
            ? `rgba(124,140,184,${aceso * 0.55})`
            : `rgba(124,140,184,${0.16 + aceso * 0.5})`;
          alvo.lineWidth = luz ? 1.6 + aceso : 1 + aceso * 0.6;
          tracarAte(c, t, alvo);
        }

        if (!reduzido && t > 0.999) {
          const p = pontoBezier(
            c.ax,
            c.ay,
            c.cx,
            c.cy,
            c.bx,
            c.by,
            pulsos[i].t
          );
          const cor = B.tipo === "resposta" ? COR.resposta : COR.processo;
          const r = luz ? 13 : 7;
          const g = alvo.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, cor);
          g.addColorStop(1, "rgba(0,0,0,0)");
          alvo.fillStyle = g;
          alvo.globalAlpha = luz ? 0.85 : 0.6 + aceso * 0.4;
          alvo.beginPath();
          alvo.arc(p.x, p.y, r, 0, Math.PI * 2);
          alvo.fill();
          alvo.globalAlpha = 1;
        }
      });

      nos.forEach((n) => {
        if (n.px == null) return;
        const cor = COR[n.tipo];
        const r = raio(n);
        const glow = n.glow ?? 0;

        if (luz) {
          // No canvas de brilho o nó é um disco maior e sólido: depois do
          // blur ele vira o halo. Gradiente aqui só borraria duas vezes.
          const intensidade =
            n.tipo === "fonte" ? 0.25 + glow * 0.75 : 0.75 + glow * 0.25;
          alvo.globalAlpha = intensidade;
          alvo.fillStyle = cor;
          alvo.beginPath();
          alvo.arc(n.px, n.py!, r * 1.9, 0, Math.PI * 2);
          alvo.fill();
          alvo.globalAlpha = 1;
          return;
        }

        alvo.beginPath();
        alvo.arc(n.px, n.py!, r + glow * 2, 0, Math.PI * 2);
        alvo.fillStyle = cor;
        alvo.fill();

        alvo.font =
          n.tipo === "fonte"
            ? "500 11px ui-monospace, monospace"
            : "600 12.5px ui-monospace, monospace";
        alvo.fillStyle =
          n.tipo === "fonte" ? `rgba(150,164,198,${0.6 + glow * 0.4})` : cor;
        alvo.textBaseline = "middle";
        // rótulo à esquerda na metade direita, pra não sair da tela
        const paraEsquerda = n.px > w * 0.72;
        alvo.textAlign = paraEsquerda ? "right" : "left";
        alvo.fillText(n.label, n.px + (paraEsquerda ? -(r + 10) : r + 10), n.py!);
      });
    };

    const desenhar = () => {
      ctx.clearRect(0, 0, w, h);

      if (temFiltro && bctx) {
        bctx.clearRect(0, 0, w, h);
        cena(bctx, true);

        ctx.save();
        // O blur é em px do canvas de destino; como o de brilho está em
        // meia escala, ele é ampliado no drawImage e o borrão junto.
        ctx.filter = `blur(${9}px)`;
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(brilho, 0, 0, w, h);
        // segunda passada, mais aberta e mais fraca: é o que dá o halo
        // largo em volta dos nós fortes
        ctx.filter = `blur(${26}px)`;
        ctx.globalAlpha = 0.55;
        ctx.drawImage(brilho, 0, 0, w, h);
        ctx.restore();
      }

      cena(ctx, false);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visivel) return;

      // Desenho de entrada, escalonado. As arestas estão na ordem
      // "fontes primeiro, processo → resposta por último", então um atraso
      // proporcional ao índice já produz a direção certa do argumento.
      if (!entrou) {
        frames += 1;
        let completo = true;
        arestas.forEach((_, i) => {
          const bruto = (frames - i * 9) / 42;
          const t = Math.min(1, Math.max(0, bruto));
          desenho[i] = 1 - Math.pow(1 - t, 3); // ease-out cúbica
          if (t < 1) completo = false;
        });
        if (completo) entrou = true;
      }

      if (!reduzido) {
        pulsos.forEach((p, i) => {
          // velocidade um pouco diferente por aresta: o fluxo respira em
          // vez de marchar em bloco
          p.t += 0.0032 + (i % 3) * 0.0006;
          if (p.t > 1) p.t = 0;
        });
      }

      nos.forEach((n) => {
        if (n.px == null) return;
        let alvo = n.tipo === "fonte" ? 0 : 0.3;
        if (mouse.dentro) {
          const d = Math.hypot(mouse.x - n.px, mouse.y - n.py!);
          if (d < 130) alvo = Math.max(alvo, 1 - d / 130);
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

    // Só anima em cena: canvas rodando fora de vista é bateria à toa.
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
      className="relative scroll-mt-28 px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-36"
    >
      {/* fundo e orbes: MergulhoNavy */}
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

        {/* Lista textual dos nós: o canvas é opaco pra leitor de tela, então
            a informação precisa existir em HTML. */}
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
