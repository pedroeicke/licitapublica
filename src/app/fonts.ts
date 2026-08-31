import {
  Archivo,
  IBM_Plex_Mono,
  Montserrat,
  Plus_Jakarta_Sans,
} from "next/font/google";

// ============================================================
// SISTEMA TIPOGRÁFICO
//
// As variáveis são nomeadas pela FONTE, não pelo papel. O papel é atribuído
// em globals.css, no @theme inline — nomear pelo papel aqui criaria
// `--font-display: var(--font-display)` lá, referência circular que o CSS
// descarta silenciosamente.
// ============================================================

// DISPLAY — Archivo, variável no eixo `wdth`.
//
// A v1 usava Montserrat 700 nos headlines. Em corpo grande, peso 700 com
// letra de largura normal lê como landing page de curso, não como produto
// técnico. Archivo puxada pra wdth ~112 dá o corte geométrico-expandido de
// tipografia de engenharia, e o formato largo sustenta peso MÉDIO (500/600)
// em 67px — que é o que dá autoridade sem gritar.
//
// `axes: ["wdth"]` é o que traz o eixo variável; sem isso vem só a instância
// de largura padrão e o font-variation-settings do CSS não faz nada.
export const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// CORPO / UI — Plus Jakarta Sans. Altura-x maior que a Archivo, então segura
// parágrafo longo e label pequeno sem virar bloco cinza.
export const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// DADO / CITAÇÃO LEGAL — IBM Plex Mono. Artigo de lei, número de processo,
// valor de cotação. O leitor reconhece "isto é verificável", não copy.
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// MARCA — Montserrat 700 itálica, um peso só. Usada exclusivamente no
// wordmark, que é o lockup real do cliente. Fora dele, nada de Montserrat.
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  display: "swap",
});
