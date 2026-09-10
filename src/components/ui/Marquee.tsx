import { cn } from "@/lib/utils";

// ============================================================
// MARQUEE — faixa corrida.
//
// O texto vinha embolado porque não havia `whitespace-nowrap`: cada cópia
// era um flex item sem largura definida, então a frase quebrava em várias
// linhas dentro da faixa e as cópias se empilhavam umas sobre as outras.
//
// Agora cada frase é uma linha só, separada por um marcador, e o texto vem
// como LISTA de trechos em vez de uma string gigante — assim os separadores
// caem entre os pedaços certos e a faixa tem ritmo de leitura, não um
// paredão de caixa-alta.
//
// O track é duplicado e translada -50%: o loop costura sem salto. A segunda
// cópia é aria-hidden pra leitor de tela não ler duas vezes.
// ============================================================

export default function Marquee({
  itens,
  pontos = "neutro",
  duration = 46,
  className,
}: {
  itens: readonly string[];
  /** "marca" pinta os separadores no verde e no ouro da logo, alternados. */
  pontos?: "neutro" | "marca";
  duration?: number;
  className?: string;
}) {
  // O track duplica o bloco e translada -50%, então cada metade precisa ser
  // MAIS LARGA que a tela — senão o fim da segunda cópia aparece antes de a
  // primeira voltar, e o loop abre um buraco. Com duas frases curtas era
  // exatamente o que acontecia. Repetir a lista até somar ~8 trechos cobre
  // as larguras que o site encontra, sem medir nada em runtime.
  const repeticoes = Math.max(1, Math.ceil(8 / Math.max(itens.length, 1)));
  const sequencia = Array.from({ length: repeticoes }, () => itens).flat();

  const bloco = (
    <div className="flex shrink-0 items-center" aria-hidden={undefined}>
      {sequencia.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="data px-7 text-[11px] tracking-[0.2em] whitespace-nowrap uppercase">
            {t}
          </span>
          {/* O separador é onde a cor da marca entra. No texto ela custaria
              legibilidade; num ponto de 4px ela só pontua o ritmo. */}
          <span
            className={cn(
              "h-1 w-1 shrink-0 rounded-full",
              pontos === "marca"
                ? i % 2 === 0
                  ? "bg-leaf"
                  : "bg-gold"
                : "bg-current opacity-35"
            )}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y border-line py-4",
        className
      )}
      style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
    >
      <div
        className="animate-marquee flex w-max"
        style={{ "--duration": `${duration}s` } as React.CSSProperties}
      >
        {bloco}
        <div aria-hidden>{bloco}</div>
      </div>
    </div>
  );
}
