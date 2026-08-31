import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";

// ============================================================
// TESE — o primeiro mergulho navy.
//
// Ela vem DEPOIS do hero, sem sobreposição. Havia aqui um margin-top
// negativo que fazia a seção subir por cima do hero pinado (efeito
// cortina), mas isso a trazia no meio do mergulho da tela do produto: a
// ação de levantar nunca terminava de ser vista. Agora o hero conclui o
// movimento, segura um instante, e só então o navy entra.
//
// É navy porque o hero é branco. O corte claro → escuro é a passagem.
//
// Precisa vir IMEDIATAMENTE depois do <Hero/> no page.tsx — o overlap é
// calculado contra o pin-spacer dele.
//
// Aqui também mora o parágrafo que estava sufocando o hero: com o SplitReveal
// por scroll ele vira leitura guiada em vez de bloco de texto.
// ============================================================

export default function TeseSection() {
  const { tese } = content;

  return (
    <section
      id="tese"
      aria-labelledby="tese-title"
      className="dive-navy relative z-10 overflow-hidden px-6 py-24 md:px-10 md:py-36"
    >
      <div
        aria-hidden
        className="orb orb-b absolute -top-48 left-1/2 h-[520px] w-[880px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,155,255,0.42), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1180px]">

        <Reveal as="p" className="eyebrow relative text-center text-leaf">
          {tese.eyebrow}
        </Reveal>

        <Reveal y={34} className="mt-9">
          <h2
            id="tese-title"
            className="display-tight mx-auto max-w-[18ch] text-center text-[clamp(2rem,4.4vw,3.6rem)] text-fg"
          >
            {tese.titleLines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h2>
        </Reveal>

        <SplitReveal
          text={tese.body}
          className="mx-auto mt-9 max-w-[62ch] text-center text-[length:var(--text-lead)] leading-relaxed text-fg"
        />

        {/* Os quatro números do produto. Ouro = dado, sempre. */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {tese.stats.map((s, i) => (
            <Reveal key={s.value + i} delay={0.06 * i}>
              <div className="border-t border-line pt-6">
                <div className="data text-[clamp(2.2rem,3.4vw,3rem)] leading-none font-medium text-gold">
                  {s.value}
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
