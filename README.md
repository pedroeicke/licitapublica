# Licita Pública — site

Redesenho do site da Licita Pública (produto da Plenum Brasil). Mesma paleta,
mesmo conteúdo e mesmas afirmações do site enviado pelo cliente — a mudança é
de **hierarquia, ritmo e motion**.

Next.js 16 · React 19 · Tailwind 4 · GSAP (ScrollTrigger + Flip) · Lenis.

```bash
npm install
npm run dev
```

---

## O diagnóstico

O que travava o site original:

1. **Tipografia fazendo trabalho de cor.** O H1 usava navy, verde e ouro na
   mesma frase. Cor virou hierarquia porque não havia contraste tipográfico —
   uma família só (Montserrat 800) fazia display, corpo e label.
2. **Hero como briefing.** Cinco linhas de parágrafo com negrito espalhado em
   três trechos antes do CTA, e a marca de fitas ocupando um terço da tela ao
   lado do título.
3. **Ritmo vertical uniforme.** Nove seções no mesmo compasso (label → título →
   grid). Sem variação, tudo parece igualmente importante — e nada parece
   importante.
4. **A onda navy como único recurso de transição**, repetida seção após seção.
5. **Constelação de partículas genérica no hero**, enquanto o ativo realmente
   proprietário do produto — o grafo de dados públicos ligados — estava
   enterrado na seção 6.

## As decisões

### Cor: azul e branco

| Token | Papel | Onde aparece |
|---|---|---|
| branco `#FFFFFF` | o mundo | fundo da maioria das seções |
| navy `#0D143C` | mergulho, profundidade | hero, consultor, grafo, demonstração, rodapé |
| azul `#2B62E0` / `#5B9BFF` | **ação e luz** | CTA, link ativo, números, glow, grafo |

**Verde e ouro entram só nos mergulhos navy**, como acento dentro do texto
branco — é o jogo do material original do cliente: fundo azul, texto branco, e
as cores da logo pontuando. Verde marca estado "ok" (selos de conformidade,
etiqueta do consultor, e-mail do rodapé); ouro marca dado verificável
(números, o dispositivo legal citado, títulos dos itens de segurança).

No mundo claro eles não aparecem: sobre papel o verde perde contraste e o ouro
some. Os tons também são puxados pra cima em relação à logo (`#8ACB52` /
`#F7CB4E`), porque sobre navy os originais escurecem demais.

**A proporção é o ponto.** O site é predominantemente branco: oito seções
claras contra quatro em navy. O navy é *momento*, não ambiente — aparece só
onde a imersão paga (a abertura, a prova de que a IA cita fonte, o grafo, e o
fechamento). Tecnicamente isso está no CSS: os tokens de texto, linha e
superfície são definidos **em claro** no `:root`, e `.dive-navy` os inverte.
O tema padrão é o branco; o escuro é a exceção declarada.

### Tipografia: quatro famílias, quatro papéis

- **Archivo** (variável, eixo `wdth` em ~112) — display. Peso médio numa letra
  expandida: o formato largo sustenta peso baixo em corpo grande, e peso baixo
  é o que dá autoridade sem gritar.
- **Plus Jakarta Sans** — corpo e UI. Altura-x maior, segura parágrafo longo.
- **IBM Plex Mono** — dado e citação legal. Artigo de lei, valor de cotação,
  ID de fonte. É o detalhe que separa legal-tech de landing page genérica.
- **Montserrat 700 itálica** — só o wordmark, o lockup real do cliente.

### Luz e matéria

O que faz o site parecer produto e não template está em `globals.css`:

- **`.glow`** — a luz azul segue o ponteiro pela borda do card. São duas
  camadas: um anel na moldura e um halo difuso por dentro, ambos centrados em
  `--mx`/`--my`. O anel usa `mask-composite: exclude` pra recortar o miolo e
  sobrar gradiente só na borda — borda com gradiente real, que o CSS não faz
  nativamente. O componente `GlowCard` só escreve as coordenadas no nó: custom
  property vai direto pro `style`, o CSS reavalia e a composição acontece na
  GPU. Zero re-render de React a 60fps.
- **`.orb` + `.orb-a`/`.orb-b`** — os blooms azuis de fundo. Dois orbes
  desfocados respirando fora de fase em keyframes CSS. Animação de composição
  pura: sem WebGL, sem `requestAnimationFrame` concorrendo com o ScrollTrigger.
- **`.card`** — se adapta ao tema pelos tokens, sem regra duplicada. Sobre
  branco é sombra difusa; sobre navy é highlight `inset 0 1px 0` no topo.
- **`.cta`** — `conic-gradient` girando na borda via `@property --sb-angle`,
  uma faixa de luz dando a volta no botão. Sobre branco o preenchimento é
  navy; sobre navy ele clareia pro azul, senão sumiria no fundo. Em touch vira
  sólido — repintar conic todo frame engasga o scroll.
- **`.texture-grain`** — grão de filme, quebra o banding dos blurs grandes e
  tira o aspecto de gradiente CSS chapado.
- **`.reg-marks`** — os "+" nas quinas do hero, da prova de impressão.

### Card em duas zonas

Padrão usado na Governança (`GovernancaSection.tsx`), inspirado na estrutura
de caixa do site da Panda Video — a anatomia, não as cores:

```
┌──────────────────────┐
│ [◇ 1ª LINHA]         │  zona de texto, padding generoso
│ Título               │
│ Descrição            │
├──────────────────────┤
│  demonstração        │  zona visual, SEM padding,
│  sangrando pra fora  │  cortada pelas bordas do card
└──────────────────────┘
```

Duas coisas fazem o padrão funcionar:

- **A pill de categoria** acrescenta um degrau de hierarquia antes do título,
  e carrega a numeração — a sequência revisão → controle → auditoria fica
  explícita sem uma frase pra dizer isso.
- **O sangramento.** Um painel inteiro dentro do card lê como ícone grande;
  um painel cortado pela borda lê como "isto continua". Mesma lógica do palco
  do hero, na escala do card. Por isso as listas têm um item a mais do que
  cabe: é o corte que produz o efeito.

Os visuais **não são screenshots** — são representações abstratas montadas a
partir do que a descrição de cada linha já promete (checklist da Lei 14.133,
apontamentos por criticidade, trilha com hora e autor). Os autores da trilha
são papéis, não nomes: inventar servidor seria o mesmo problema dos
depoimentos fictícios que ficaram de fora.

### Ritmo: cinco movimentos, três set-pieces

```
                                        ░ = branco   █ = mergulho navy

I.   PROMESSA   ░ Hero pinado ──▶ █ tese
II.  MÉTODO     ░ Ciclo horizontal ★ ──▶ ░ telas com Flip ★
III. PROVA      ░ Preços ──▶ █ Consultor ──▶ █ Grafo ★ (clímax)
IV.  CONFIANÇA  ░ Para quem ──▶ ░ Governança ──▶ █ Segurança
                ──▶ ░ Módulos ──▶ ░ Quem está por trás
V.   AÇÃO       █ Demonstração ──▶ ░ FAQ ──▶ █ rodapé
```

Oito claras, quatro escuras. Cada mergulho navy é um momento escolhido, e o
branco em volta é o que faz ele existir. A tese é navy justamente porque o
hero é branco — o corte claro → escuro é a passagem.

A tese chegava por cima do hero pinado (margin-top negativo, efeito cortina),
mas isso a trazia no meio do mergulho da tela do produto e a ação de levantar
nunca terminava de ser vista. Agora o hero conclui o movimento, segura um
instante, e só então o navy entra.

★ = set-piece: sai do compasso padrão de propósito. É o contraste que faz o
ritmo existir.

Cada seção carrega um **numeral fantasma** (`.ghost-num`) de ~200px sangrando
atrás do cabeçalho. Não é enfeite: com tudo dentro de uma caixa de 1180px e o
mesmo padding, nada tem tamanho relativo a nada e a página lê como documento.
O numeral estabelece a medida contra a qual o resto é lido.

- **Ciclo horizontal** (`CicloHorizontal.tsx`) — as nove etapas em scroll
  horizontal pinado. Um processo é uma sequência; mostrar em horizontal
  transforma "ler nove itens" em "percorrer um fluxo". Em mobile vira carrossel
  com scroll-snap nativo — pin horizontal em touch briga com o gesto de voltar.
- **Telas com Flip** (`TelasSection.tsx`) — o indicador da aba viaja entre os
  botões em vez de sumir e reaparecer. É a diferença entre "trocou de conteúdo"
  e "a interface se moveu".
- **Grafo** (`GrafoSection.tsx`) — canvas 2D, promovido a clímax. Cada ponto tem
  nome e cada linha tem sentido; os pulsos correm sempre no sentido
  fonte → processo → resposta, que é a direção do argumento.

### O hero como palco

Três tentativas até chegar aqui, e vale registrar por quê:

- **v1** — uma coluna de tipografia empilhada. Promessa sem produto.
- **v2** — texto à esquerda, mockup num card à direita. Layout de SaaS:
  correto, previsível, e nada acontecia quando o cliente entrava.
- **v3 (atual)** — a tela do produto deixa de ser figura ao lado do texto e
  vira **palco**.

A manchete fica centralizada no alto, e a tela do produto (`HeroStage.tsx`)
ocupa a largura toda, deitada em perspectiva e **cortada pela borda inferior
da viewport**. O que aparece ali é a **gravação real da plataforma**
(`/public/hero-demo.mp4`, 1280×722, 35s) dentro de uma barra de navegador —
não um mockup em HTML.

O corte é o truque da imersão: um retângulo inteiro dentro da tela é uma
figura — você olha *pra* ela. Um retângulo que sai da tela vira espaço — você
está *dentro* dele.

Duas camadas de movimento, nenhuma custando um frame de canvas:

1. **Entrada** — a manchete sobe atrás de máscara; o palco emerge de baixo com
   a perspectiva fechada e vai abrindo.
2. **Mergulho no scroll** — a tela **se levanta** (`rotationX` → 0) e sobe até
   caber inteira na viewport, enquanto o texto recua e desfoca. A ação
   TERMINA: o corte se resolve e o produto fica visível e legível. A timeline
   tem 1.0 de duração — 0.72 pro movimento e **0.28 de pausa no fim**, que é o
   momento de ver a tela parada antes de qualquer outra coisa acontecer. Só
   depois o navy da tese entra.

**O vídeo acompanha o movimento.** Ele começa pausado, no poster. Quando a
timeline passa de 0.72 — ou seja, quando a tela acabou de se levantar — o play
dispara; abaixo de 0.66 ele pausa. Dois detalhes importam aqui:

- O gatilho lê o progresso da **timeline**, não o do ScrollTrigger. Com
  `scrub: 0.7` o movimento visível fica até 0,7s atrás do scroll, e usar o
  progresso do trigger faria o vídeo começar com a tela ainda subindo.
- Os limiares são diferentes (0.72 pra tocar, 0.66 pra pausar). Com um valor
  só, parar de rolar em cima do ponto de virada faria o vídeo piscar
  ligando/desligando.

A escala do mergulho é calculada, não fixa: `min(1.2, alturaDisponível /
alturaDaTela)`. O vídeo deixou a janela mais alta que o mockup anterior, e uma
escala fixa passou a estourar a borda inferior em telas curtas — o corte
nunca se resolvia, que era justamente o problema a corrigir. O teto de 1.2
existe pra telas altas: sem ele o efeito viraria zoom, não "levantar".

No mobile não há mergulho (o pin briga com o gesto de scroll), então lá o
gatilho do vídeo é um `IntersectionObserver`: toca quando entra em cena.

**Uma regra que saiu daqui e vale pro projeto todo:** entrada e scroll nunca
animam o mesmo nó. Um tween com `scrub` grava seu estado inicial quando o
ScrollTrigger inicializa — e nesse instante a animação de entrada ainda está
no `from`. O resultado é a tela saltando de volta pro começo assim que você
rola. Por isso existem `.hs-tilt` (inclinação e mergulho) e `.hs-window`
(entrada) como elementos separados, e o mesmo par para os flutuantes
(`.h-floats` / `.h-float`).

Todo o conteúdo da tela é material real: os módulos do trilho, as fontes de
preço (PNCP, SINAPI, BPS, Notas Fiscais), o art. 6º XXIII do TR, o art. 84 da
ata, os 80% da própria promessa do cliente.

### A fita

`RibbonSpine.tsx` — três fitas desenhadas por scroll, do topo ao rodapé, atrás
de todo o conteúdo. A ideia é do próprio cliente ("espiral de 3 fitas atravessa
a página seguindo o scroll") e é a melhor coisa do site original; aqui ela é o
elemento-assinatura em vez de ficar soterrada sob partículas. Em três tons de
azul: o motivo das fitas fica, a cor segue a paleta.

Revelada por `clip-path: inset()`, não por `stroke-dashoffset` — o SVG precisa
esticar pra cobrir a página, e sob escala não-uniforme o comprimento do path e
o dash em pixels de tela deixam de bater. `clip-path` é porcentagem da própria
caixa, imune à escala.

---

## Estrutura

```
src/
  app/
    globals.css        design system: tokens, papéis de cor, .dive-light, CTAs
    fonts.ts           as 4 famílias (nomeadas pela fonte, não pelo papel)
    layout.tsx         shell + ambiente de fundo
    page.tsx           a partitura dos cinco movimentos
  content/pt.ts        TODO o texto, num arquivo só
  lib/gsap.ts          registro de ScrollTrigger + Flip + useGSAP
  components/
    SmoothScroll.tsx   Lenis + sync do ScrollTrigger + âncoras suaves
    motion/            Reveal, StaggerReveal, SplitReveal, RibbonSpine
    sections/          uma por movimento (Hero + HeroStage = o palco)
    ui/                Section, SectionTitle, GlowCard, Wordmark, Marquee
```

Todo o texto vive em `src/content/pt.ts`. Nenhuma seção tem copy hard-coded —
ajuste de conteúdo é um arquivo só, sem tocar em componente.

---

## Conteúdo trazido do site em produção

Além do HTML enviado pelo cliente, parte do conteúdo veio de
**licitapublica.com.br** — só o conteúdo, nada da identidade visual:

- **Para quem** (`ParaQuemSection.tsx`) — os três perfis de servidor.
  Faltava por completo: o material descrevia o que o produto faz, mas nunca a
  quem cada parte serve, e num órgão a compra passa por três mesas.
- **Segurança e privacidade** (`SegurancaSection.tsx`) — os seis itens
  (LGPD, dados protegidos, ambiente dedicado, sigilo da fase preparatória,
  rastreabilidade, continuidade), os selos de conformidade, o DPO e a Política
  de Privacidade. Tínhamos só as três linhas de defesa.
- **Detalhes de módulos** — "alertas de vencimento" em Contratos, "registro de
  ocorrências e atesto de medições" no Painel do Fiscal, "atas próprias e
  carona, com saldo por item e fornecedor" no Registro de Preços.
- **Rodapé** — Política de Privacidade e a nota do Encarregado de Dados.

**O que ficou de fora, de propósito:** os três depoimentos. O site em produção
os traz com a nota "*nomes e cargos são fictícios*", e o HTML enviado pelo
cliente afirma o oposto — "Nada de depoimento inventado nem número inflado: o
que mostramos é o produto real". As duas fontes se contradizem; a decisão é do
cliente, não nossa.

**Números não trazidos:** o site em produção mostra mais duas métricas
("consultorias realizadas para municípios" e "cursos realizados em todo o
Brasil"), mas os valores são contadores animados e vêm zerados no HTML. Sem os
números reais, não dá pra trazer.

## Pendências

- **Formulário sem back-end.** `DemoSection.tsx` marca o ponto de integração em
  `enviar()` (`TODO(integração)`). Hoje ele confirma o recebimento localmente e
  **não transmite nada** — não finge sucesso de envio.
- **Telas do produto são wireframe abstrato.** `TelasSection.tsx` desenha linhas
  de documento + bloco de valor como placeholder honesto. Trocar por screenshot
  real assim que o cliente liberar.
- **Verificação visual foi feita em desktop** (1555px). Mobile foi revisado no
  código — breakpoints, carrossel do ciclo, menu, hero sem pin — mas não
  conferido em tela.
- `_ref_solvy/` é o clone do repo de referência, ignorado pelo git. Pode apagar.
