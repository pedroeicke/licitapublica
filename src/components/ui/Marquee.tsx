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
  duration = 46,
  className,
}: {
  itens: readonly string[];
  duration?: number;
  className?: string;
}) {
  const bloco = (
    <div className="flex shrink-0 items-center" aria-hidden={undefined}>
      {itens.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="data px-7 text-[11px] tracking-[0.2em] whitespace-nowrap uppercase">
            {t}
          </span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-35" />
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
