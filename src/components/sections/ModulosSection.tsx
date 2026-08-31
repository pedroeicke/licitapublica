import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { content } from "@/content";
import Reveal from "@/components/motion/Reveal";
import StaggerReveal from "@/components/motion/StaggerReveal";
import GlowCard from "@/components/ui/GlowCard";
import Section, { SectionTitle } from "@/components/ui/Section";

// ============================================================
// MÓDULOS — card claro com o objeto 3D no topo.
//
// O FUNDO É BRANCO — e os dois fundos escuros que testei antes falharam:
//
//   · Quase-preto (como o card da referência, rgb(1,1,13)): o objeto deles
//     é prateado, os nossos são corpo navy escuro (luminância medida:
//     61/255). No quase-preto o corpo some e sobram as arestas neon soltas.
//   · Navy médio: pior ainda — corpo navy e arestas azuis sobre gradiente
//     azul se camuflam. A imagem renderizava normalmente (conferido no
//     DOM) e mesmo assim não se via nada.
//
// No branco o objeto aparece, mas chega lavado: as arestas emissivas só
// brilham contra escuro. O REALCE abaixo compensa isso com contraste,
// saturação e sombra — é o que faz o objeto pousar no card em vez de
// parecer um decalque.
//
// TAMANHO: 4 colunas, não a escala de vitrine da referência. Eles têm 3
// itens e nós temos 8 — card gigante × 8 vira uma seção que engole o ciclo
// e o grafo, que são os set-pieces reais. Módulos é a lista do que se
// contrata.
//
// ANATOMIA
//   ┌──────────────────────┐
//   │ ░░  [ objeto 3D ]  ░░│  poça de luz azul clara atrás do objeto
//   ├──────────────────────┤
//   │ Título               │
//   │ Descrição            │
//   └──────────────────────┘
//
// A poça de luz não é enfeite: objeto recortado sobre branco chapado fica
// sem chão. O radial dá ambiente, e a elipse borrada na base faz de sombra
// de contato.
//
// A detecção do arquivo é automática (Server Component, checa o disco).
// Solte o PNG em public/modulos/<sigla>.png e o card acende.
// ============================================================

/** O PNG do módulo existe em /public/modulos/? Roda no servidor, em build. */
function iconeDoModulo(sigla: string) {
  const arquivo = `${sigla.toLowerCase()}.png`;
  const caminho = join(process.cwd(), "public", "modulos", arquivo);
  return existsSync(caminho) ? `/modulos/${arquivo}` : undefined;
}

// Fundo do card em três camadas.
//
// A luz fica ATRÁS do objeto, não numa quina. Os nossos objetos têm
// luminância média de 61/255 — são escuros. Sobre fundo quase preto o corpo
// deles desaparece e sobram só as arestas azuis (foi o que aconteceu com o
// card de Nova Contratação). Uma poça de luz onde o objeto está o recorta
// por trás, que é como se fotografa objeto escuro em estúdio.
//
// A referência não precisa disso porque o objeto dela é prateado e claro;
// o nosso é navy escuro. Copiar o fundo dela sem ajustar a luz seria copiar
// a aparência ignorando o motivo.
// Poça de luz azul MUITO clara sobre branco — dá chão ao objeto sem virar
// um retângulo colorido.
const FUNDO = [
  "radial-gradient(72% 64% at 50% 42%, rgba(91,155,255,0.16), transparent 74%)",
  "linear-gradient(#F3F7FD, #FFFFFF)",
].join(", ");

// Os PNGs foram renderizados pra fundo escuro: as arestas são emissivas e,
// no branco, o objeto chega lavado. Este filtro devolve o que se perde —
// mais contraste e saturação, e uma sombra azulada que faz o objeto pousar
// em vez de flutuar recortado.
const REALCE =
  "saturate(1.18) contrast(1.12) drop-shadow(0 14px 22px rgba(13,20,60,0.22))";

export default function ModulosSection() {
  const { modulos } = content;

  return (
    <Section id="modulos" eyebrow={modulos.eyebrow} inner="max-w-[1360px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <SectionTitle id="modulos-title" lines={modulos.titleLines} />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[42ch] text-[15px] leading-relaxed text-muted">
            {modulos.body}
          </p>
        </Reveal>
      </div>

      {/* 4 colunas: 8 módulos fecham em duas fileiras cheias, sem sobra.
          Em 3 colunas sobrariam 2 na última, e o mosaico de larguras
          diferentes dava peso de vitrine a uma seção que é lista. */}
      <StaggerReveal
        className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        stagger={0.055}
      >
        {modulos.itens.map((m) => {
          const icone = iconeDoModulo(m.sigla);

          return (
            <GlowCard
              key={m.sigla}
              as="article"
              materia={false}
              className="glow--borda group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(13,20,60,0.04),0_18px_44px_-28px_rgba(13,20,60,0.26)]"
            >
              {/* zona visual */}
              <div
                className="relative aspect-[5/4] overflow-hidden"
                style={{ background: FUNDO }}
              >
                {icone ? (
                  <Image
                    src={icone}
                    alt=""
                    width={640}
                    height={640}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="absolute inset-0 h-full w-full scale-[0.92] object-contain"
                    style={{ filter: REALCE }}
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center text-[3.6rem] leading-none font-bold text-navy/[0.08]"
                  >
                    {m.sigla}
                  </span>
                )}

                {/* Luz interna acompanhando o ponteiro. O halo do `.glow`
                    (::after, z-index -1) fica atrás do fundo próprio deste
                    card e não apareceria — então a versão de dentro é feita
                    aqui, acima dele. As coordenadas --mx/--my quem escreve é
                    o GlowCard. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(91,155,255,0.22), transparent 66%)",
                  }}
                />

                {/* dissolve pro rodapé branco, sem linha divisória */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-white"
                />
              </div>

              {/* zona de texto */}
              <div className="relative z-20 flex flex-1 flex-col px-4 pt-1 pb-5 sm:px-6 sm:pb-6">
                <h3 className="display-tight text-[14px] text-fg sm:text-[16.5px]">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted sm:text-[13.5px]">
                  {m.desc}
                </p>
              </div>
            </GlowCard>
          );
        })}
      </StaggerReveal>
    </Section>
  );
}
