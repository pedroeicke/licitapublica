import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// MARCA — o lockup oficial do cliente (fitas + tipografia), não mais uma
// reconstrução em Montserrat ao lado do símbolo.
//
// DUAS VARIANTES, um arquivo cada, em vez de filtro CSS:
//   · /logo.svg        tipografia navy (#1A255E) — fundos claros
//   · /logo-branca.svg mesma arte com a tipografia em branco — fundos
//                      escuros (a pill do header, o rodapé navy)
//
// O verde e o ouro das fitas ficam intactos nas duas: são eles que
// carregam a identidade, e sobre navy é justamente onde brilham. Um
// `filter: invert()` mataria as duas cores junto com o texto.
//
// A API é por ALTURA, não largura: o lockup é deitado (686×239 ≈ 2.87:1) e
// o que precisa casar com a linha de texto ao lado é a altura.
// ============================================================

export default function Wordmark({
  className,
  altura = 26,
  variante = "cor",
}: {
  className?: string;
  /** Altura de referência em px — define só a proporção do <Image>. Pra
   *  mudar o tamanho renderizado use className (ex.: "h-[18px] md:h-6"). */
  altura?: number;
  variante?: "cor" | "branca";
}) {
  const src = variante === "branca" ? "/logo-branca.svg" : "/logo.svg";

  return (
    <Image
      src={src}
      alt="Licita Pública"
      width={Math.round((altura * 686) / 239)}
      height={altura}
      priority
      // A altura sai de uma CLASSE, não de style inline: inline venceria
      // qualquer utilitário responsivo e a logo não poderia encolher no
      // celular. Quem passa className manda; sem ela, vale a padrão.
      className={cn("w-auto", className ?? "h-6")}
    />
  );
}
