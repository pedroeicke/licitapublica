"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Fingerprint, Pause, Play } from "lucide-react";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import { SectionEyebrow, SectionTitle } from "@/components/ui/Section";
import styles from "./GrafoSection.module.css";

type Point = { x: number; y: number };
type GraphNode = { label: string; caption: string; detail: string; x: number; y: number; mx: number; my: number; kind: "source" | "output" };
const NODES: GraphNode[] = [
  { label: "Lei 14.133", caption: "Legislação", detail: "A base legal conectada ao contexto da sua contratação.", x: 19, y: 15, mx: 18, my: 12, kind: "source" },
  { label: "Decretos", caption: "Regulamentação", detail: "Regulamentos que complementam a leitura da legislação.", x: 11, y: 36, mx: 50, my: 12, kind: "source" },
  { label: "TCU · TCEs", caption: "Jurisprudência", detail: "Entendimentos dos tribunais de contas ligados ao seu processo.", x: 16, y: 61, mx: 82, my: 12, kind: "source" },
  { label: "PNCP", caption: "Contratações públicas", detail: "Dados de contratações públicas para apoiar a pesquisa de preços.", x: 26, y: 82, mx: 18, my: 24, kind: "source" },
  { label: "SINAPI", caption: "Custos de construção", detail: "Referências de custos para obras e serviços de engenharia.", x: 10, y: 84, mx: 50, my: 24, kind: "source" },
  { label: "BPS", caption: "Preços em saúde", detail: "Referências de preços para compras na área da saúde.", x: 30, y: 39, mx: 82, my: 24, kind: "source" },
  { label: "DFD", caption: "A demanda", detail: "Documento de Formalização da Demanda: o ponto de partida da contratação.", x: 78, y: 14, mx: 18, my: 75, kind: "output" },
  { label: "ETP", caption: "O planejamento", detail: "Estudo Técnico Preliminar: contexto e referências para planejar a solução.", x: 88, y: 34, mx: 50, my: 75, kind: "output" },
  { label: "Resposta com fonte", caption: "A fundamentação", detail: "Respostas conectadas às fontes, para consultar e conferir a fundamentação.", x: 77, y: 51, mx: 27, my: 88, kind: "output" },
  { label: "TR", caption: "A especificação", detail: "Termo de Referência: as definições da contratação reunidas em um documento.", x: 88, y: 73, mx: 82, my: 75, kind: "output" },
  { label: "Edital e Contrato", caption: "A contratação", detail: "O conhecimento do processo acompanha a elaboração do edital e do contrato.", x: 71, y: 86, mx: 73, my: 88, kind: "output" },
];

function cubic(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const u = 1 - t;
  return { x: u ** 3 * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t ** 3 * d.x,
    y: u ** 3 * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t ** 3 * d.y };
}

export default function GrafoSection() {
  const { grafo } = content;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const redrawRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const active = hovered ?? selected;

  useEffect(() => { activeRef.current = active; redrawRef.current?.(); }, [active]);
  useEffect(() => { pausedRef.current = paused; redrawRef.current?.(); }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const core = scene.querySelector<HTMLElement>(`.${styles.core}`);
    let width = 0, height = 0, radius = 72, time = 0, last = 0, raf = 0;
    let visible = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mobile = narrow.matches;
      const center = { x: width * .5, y: height * .49 };
      const selectedIndex = activeRef.current;

      // Filaments move, but their HTML labels and endpoints remain steady.
      NODES.forEach((node, index) => {
        const output = node.kind === "output";
        const color = output ? "224,190,113" : "144,173,207";
        const lit = selectedIndex === index;
        const alpha = selectedIndex === null ? 1 : lit ? 1.85 : .25;
        const anchor = { x: width * (mobile ? node.mx : node.x) / 100, y: height * (mobile ? node.my : node.y) / 100 };
        if (mobile) anchor.y += output ? -23 : 24;
        else anchor.x += output ? -38 : 40;

        for (let strand = 0; strand < 7; strand++) {
          const spread = strand - 3;
          const wave = Math.sin(time * .28 + index * 1.7 + strand * .4) * (mobile ? 5 : 12);
          const end = { x: center.x + (mobile ? spread * 5 : (output ? 1 : -1) * radius * .8), y: center.y + (mobile ? (output ? 1 : -1) * radius * .8 : spread * 9) };
          const nearAnchor = mobile
            ? { x: anchor.x + spread * 8, y: anchor.y + (output ? -1 : 1) * height * .1 }
            : { x: anchor.x + (output ? -1 : 1) * width * .11, y: anchor.y + spread * 10 };
          const nearCenter = mobile
            ? { x: center.x + (anchor.x - center.x) * .2 + spread * 12 + wave, y: center.y + (output ? 1 : -1) * height * .18 }
            : { x: center.x + (output ? 1 : -1) * width * .18, y: center.y + (anchor.y - center.y) * .24 + spread * 16 + wave };
          const [a, b, c, d] = output ? [end, nearCenter, nearAnchor, anchor] : [anchor, nearAnchor, nearCenter, end];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
          ctx.strokeStyle = `rgba(${color},${(strand === 3 ? .48 : .18) * alpha})`;
          ctx.lineWidth = strand === 3 ? .95 : .65;
          ctx.stroke();

          // Tapered signals show the direction from source to document.
          if (strand === 3 || strand === 1) {
            const progress = (time * (.065 + index % 3 * .008) + index * .137 + strand * .31) % 1;
            for (let tail = 0; tail < 10; tail++) {
              const t = progress - tail * .009;
              if (t < 0) continue;
              const p = cubic(a, b, c, d, t);
              ctx.beginPath();
              ctx.arc(p.x, p.y, tail === 0 ? 1.7 : .85, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${color},${(1 - tail / 10) * .8 * Math.min(alpha, 1)})`;
              ctx.fill();
            }
          }
          if (strand === 3) {
            [.27, .66].forEach((t) => {
              const p = cubic(a, b, c, d, t);
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
              ctx.fillStyle = "#101d30";
              ctx.fill();
              ctx.strokeStyle = `rgba(${color},${.55 * Math.min(alpha, 1)})`;
              ctx.stroke();
            });
          }
        }
      });

      // Fine rings give the center a physical, engraved quality.
      for (let ring = 0; ring < 4; ring++) {
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radius + 11 + ring * 9, radius + 11 + ring * 5, Math.sin(time * .12) * .2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(167,197,156,${.2 - ring * .04})`;
        ctx.lineWidth = .7;
        ctx.stroke();
      }
      for (let i = 0; i < 64; i++) {
        const angle = i / 64 * Math.PI * 2;
        const r = radius + 23;
        const length = i % 8 === 0 ? 5 : 2;
        ctx.beginPath();
        ctx.moveTo(center.x + Math.cos(angle) * r, center.y + Math.sin(angle) * r);
        ctx.lineTo(center.x + Math.cos(angle) * (r + length), center.y + Math.sin(angle) * (r + length));
        ctx.strokeStyle = "rgba(189,208,173,.28)";
        ctx.stroke();
      }
    };
    const tick = (now: number) => {
      raf = 0;
      time += last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      draw();
      if (visible && !document.hidden && !motion.matches && !pausedRef.current) raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      draw();
      if (visible && !document.hidden && !motion.matches && !pausedRef.current) raf = requestAnimationFrame(tick);
    };
    redrawRef.current = sync;
    const resize = new ResizeObserver(() => {
      width = scene.clientWidth;
      height = scene.clientHeight;
      radius = (core?.offsetWidth ?? 144) / 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
    });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(scene);
    intersection.observe(scene);
    motion.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersection.disconnect();
      motion.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      redrawRef.current = null;
    };
  }, []);

  return (
    <section id="grafo" aria-labelledby="grafo-title" className="relative scroll-mt-28 px-6 pt-16 pb-16 md:px-10 md:pt-24 md:pb-24">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionEyebrow className="mb-9">{grafo.eyebrow}</SectionEyebrow>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal><SectionTitle id="grafo-title" lines={grafo.titleLines} /></Reveal>
          <Reveal delay={0.08}><p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">{grafo.body}</p></Reveal>
        </div>
        <Reveal y={44} className="mt-14">
          <div className={styles.panel}>
            <div className={styles.topbar}>
              <span className={styles.kicker}>Da fonte à decisão</span>
              <span className={styles.topHint}>Explore as conexões <ArrowUpRight size={13} aria-hidden="true" /></span>
            </div>
            <div ref={sceneRef} className={styles.scene} data-exploring={active !== null}>
              <div className={styles.axis} aria-hidden="true"><span>01 / Fontes públicas</span><span>02 / Seu contexto</span><span>03 / Na prática</span></div>
              <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
              <div className={styles.core}><Fingerprint size={33} strokeWidth={1} aria-hidden="true" /><span>Seu processo</span><small>O ponto de conexão</small></div>
              {NODES.map((node, index) => (
                <button key={node.label} type="button" className={`${styles.node} ${node.kind === "output" ? styles.output : styles.source}`}
                  style={{ "--x": `${node.x}%`, "--y": `${node.y}%`, "--mx": `${node.mx}%`, "--my": `${node.my}%` } as CSSProperties}
                  data-active={active === index} aria-pressed={selected === index} aria-controls="grafo-detail"
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(index); }} onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}
                  onClick={() => { setHovered(null); setSelected(selected === index ? null : index); }}
                  onKeyDown={(event) => { if (event.key === "Escape") { setSelected(null); setHovered(null); } }}>
                  <span className={styles.nodeMark} aria-hidden="true" /><span className={styles.nodeText}><strong>{node.label}</strong><small>{node.caption}</small></span>
                </button>
              ))}
            </div>
            <div className={styles.footer}>
              <div id="grafo-detail" className={styles.detail} role="status" aria-live="polite" aria-atomic="true">
                <span className={styles.detailMark} aria-hidden="true" />
                <p><strong>{active === null ? "Conhecimento que se conecta." : NODES[active].label}</strong><span>{active === null ? "Explore uma fonte. Veja onde ela entra no seu processo." : NODES[active].detail}</span></p>
              </div>
              <button type="button" className={styles.motionButton} onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar animação do grafo" : "Pausar animação do grafo"} aria-pressed={paused}>
                {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </Reveal>
        <div className={styles.caption}><span>Fontes públicas. Contexto conectado. Decisões fundamentadas.</span><span>{grafo.rodape}</span></div>
      </div>
    </section>
  );
}
