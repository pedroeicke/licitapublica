// ============================================================
// CONTEÚDO — pt-BR
//
// Todo o texto do site do cliente, preservado. As mudanças são de
// EDIÇÃO, não de invenção: o parágrafo de 5 linhas do hero virou
// subhead de 2 linhas + o resto foi realocado pras seções onde a
// informação é relevante. Nenhum número, nenhuma citação de lei e
// nenhuma promessa nova foi criada.
// ============================================================

export const pt = {
  meta: {
    title: "Licita Pública — a inteligência artificial das contratações públicas",
    description:
      "Minutas de DFD, ETP, TR, Edital e Contratos geradas por IA, com pesquisa de preços no rito da IN nº 65/2021 e respostas com fonte citada. Produto da Plenum Brasil.",
  },

  nav: {
    // "Grafo" saiu da nav (a seção continua na página): pra quem compra,
    // "Para quem" e "Segurança" decidem mais que o clímax visual.
    links: [
      { href: "#ciclo", label: "O ciclo" },
      { href: "#telas", label: "Telas" },
      { href: "#precos", label: "Preços" },
      { href: "#consultor", label: "Consultor" },
      { href: "#para-quem", label: "Para quem" },
      { href: "#seguranca", label: "Segurança" },
      { href: "#modulos", label: "Módulos" },
    ],
    cta: "Demonstração",
    // Login da plataforma. O produto e o site institucional dividem o mesmo
    // domínio — /login é a rota real do app, conferida no bundle.
    entrar: { label: "Entrar", href: "https://licitapublica.com.br/login" },
  },

  hero: {
    eyebrow: "Inteligência artificial · Lei nº 14.133/2021",
    // Uma cor só no título. A ênfase é feita pela quebra de linha e pelo
    // peso — não por navy/verde/ouro na mesma frase.
    titleLines: ["A inteligência artificial", "das contratações públicas."],
    // Duas linhas. O briefing completo foi pra tese e pras seções.
    sub: "Uma conversa guiada gera as minutas da fase interna — contextualizadas, editáveis e juridicamente seguras.",
    ctaPrimary: "Agendar demonstração",
    ctaGhost: "Conhecer o ciclo",
    // Só números aqui. "Plenum Brasil" era o terceiro item no original,
    // mas assinatura de marca não é dado — em ouro e em mono ela lia como
    // métrica. Virou crédito, abaixo.
    stats: [
      { value: "30.000+", label: "gestores capacitados" },
      { value: "10+", label: "anos em gestão pública" },
    ],
    credito: "Produto da Plenum Brasil",

    // Moldura e cartões flutuantes do palco. O restante do que existia
    // aqui (trilho de módulos, painel de fontes, linhas do documento) era
    // material do mockup em HTML — agora quem mostra o produto é a
    // gravação real em /public/hero-demo.mp4.
    visual: {
      janela: "licitapublica.app / montar-processo",
      fonte: {
        titulo: "Fonte citada",
        ref: "Lei nº 14.133/2021, art. 84",
      },
      badge: {
        valor: "80%",
        label: "menos tempo na fase preparatória",
      },
    },
  },

  tese: {
    eyebrow: "Do DFD ao apoio de gestão de instrumentos contratuais",
    titleLines: ["Do planejamento à fiscalização,", "num fluxo inteligente."],
    body: "Minutas contextualizadas e coerentes de DFD, ETP, TR, Edital e Contratos são alguns exemplos do que oferecemos para economizar até 80% do tempo gasto na fase preparatória. Documentos editáveis, segurança jurídica e agilidade do início ao fim.",
    stats: [
      {
        value: "+10",
        label:
          "Minutas principais: DFD, ETP, TR/PB, Mapa de Risco, Edital, Avisos de Contratação, Ata, Contratos e outros",
      },
      {
        value: "+10",
        label:
          "Diversas fontes de Pesquisa de Preços para formar uma cotação bem fundamentada, diversificada e segura",
      },
      {
        value: "+50",
        label:
          "Minutas Complementares para fortalecer cada fase da contratação e auxiliar o agente de contratação",
      },
      {
        value: "3",
        label:
          "linhas de defesa no mesmo lugar: revisão, controle interno e auditoria",
      },
    ],
  },

  // Set-piece 1 — scroll horizontal pinado.
  ciclo: {
    eyebrow: "O ciclo completo · mergulho",
    titleLines: ["Nove etapas,", "um processo só."],
    intro:
      "O setor requisitante registra a necessidade e a estratégia numa entrevista guiada, ligada ao Plano de Contratações Anual. Daí em diante, cada etapa herda o contexto da anterior.",
    etapas: [
      {
        n: "01",
        title: "Planejamento",
        ref: "Plano de Contratações Anual",
        desc: "Toda contratação começa com uma necessidade. A entrevista guiada registra o que o órgão precisa e por quê, já vinculado ao PCA.",
      },
      {
        n: "02",
        title: "DFD",
        ref: "art. 72, I",
        desc: "Documento de Formalização da Demanda gerado a partir da entrevista, com justificativa da necessidade e vínculo ao planejamento.",
      },
      {
        n: "03",
        title: "ETP",
        ref: "art. 18",
        desc: "Estudo Técnico Preliminar completo ou simplificado, com levantamento de soluções, estimativa e justificativa da escolha.",
      },
      {
        n: "04",
        title: "Termo de Referência",
        ref: "art. 6º, XXIII",
        desc: "TR ou Projeto Básico derivado do ETP, com objeto, requisitos, modelo de execução e critérios de medição coerentes entre si.",
      },
      {
        n: "05",
        title: "Pesquisa de Preços",
        ref: "IN nº 65/2021",
        desc: "Cotação em fontes públicas, tratamento de outliers com justificativa registrada e memória de cálculo pronta pro processo.",
      },
      {
        n: "06",
        title: "Parecer",
        ref: "art. 53",
        desc: "Análise jurídica com histórico do processo, apontamentos por criticidade e minuta de parecer assistida por IA.",
      },
      {
        n: "07",
        title: "Edital",
        ref: "fase externa",
        desc: "Minuta de edital e avisos de contratação no padrão oficial, coerentes com o TR e com a pesquisa de preços.",
      },
      {
        n: "08",
        title: "Contrato",
        ref: "instrumento",
        desc: "Minutas de contrato e ata de registro de preços, com vigência, aditivos e medições sob controle desde a assinatura.",
      },
      {
        n: "09",
        title: "Fiscalização",
        ref: "prestação de contas",
        desc: "Painel do fiscal com checklist, trilha de auditoria e o histórico completo que o controle externo vai pedir.",
      },
    ],
  },

  // Set-piece 2 — troca de telas com GSAP Flip.
  telas: {
    eyebrow: "Produto real",
    titleLines: ["Menos erros.", "Contratações mais ágeis."],
    body: "Pesquisa, elaboração, análise e consultas no mesmo ambiente. Navegue pelas telas — o fluxo acontece de maneira didática e aprofundada.",
    abas: [
      {
        id: "pesquisa",
        label: "Pesquisa de Preços",
        title: "Cotação com memória de cálculo",
        desc: "PNCP, Notas Fiscais, BPS, SINAPI e outras fontes numa cotação só, com outliers saneados e justificativa registrada.",
        chips: [
          "Painel Resumo",
          "Mapa Comparativo",
          "Memorial de Cálculo",
          "Curva ABC",
        ],
      },
      {
        id: "contratacao",
        label: "Nova Contratação",
        title: "Entrevista guiada, minuta pronta",
        desc: "Da necessidade ao TR: cada resposta alimenta o documento seguinte, sem redigitar contexto.",
        chips: ["DFD", "ETP", "TR/PB", "Mapa de Risco"],
      },
      {
        id: "juridica",
        label: "Análise Jurídica",
        title: "Apontamentos por criticidade",
        desc: "Revisão contra checklist da Lei nº 14.133/2021, com histórico e minuta de parecer assistida.",
        chips: ["Checklist", "Criticidade", "Minuta de parecer", "Histórico"],
      },
      {
        id: "especialista",
        label: "Especialista",
        title: "Resposta com a fonte citada",
        desc: "Lei, decretos e acórdãos do TCU e dos TCEs — sempre com o dispositivo verificado junto.",
        chips: ["Lei 14.133", "Decretos", "TCU · TCEs", "Fonte citada"],
      },
    ],
  },

  precos: {
    eyebrow: "Pesquisa de preços",
    titleLines: ["O achado mais comum dos tribunais,", "resolvido no rito."],
    body: "A Lei 14.133/21 e a IN nº 65/2021 pedem metodologia: fontes públicas, tratamento de outliers e memória de cálculo. A plataforma cota no PNCP, em Notas Fiscais, no BPS, no SINAPI e em outras fontes, lê proposta de fornecedor até em foto, saneia valores com justificativa registrada e monta os relatórios saneados para a contratação.",
    artefatos: [
      "Painel Resumo",
      "Cotação Documento",
      "Mapa Comparativo",
      "Memorial de Cálculo",
      "Mapa de Apuração",
      "Curva ABC",
      "Fornecedor",
      "Outliers",
      "Conformidade IN 65",
      "Minuta de Proposta",
    ],
    curva: {
      titulo: "Curva ABC · Pesquisa 2026-014",
      faixas: [
        { classe: "A", valor: "R$ 148.400", pct: 69.8 },
        { classe: "B", valor: "R$ 52.170", pct: 24.6 },
        { classe: "C", valor: "R$ 11.925", pct: 5.6 },
      ],
      totalLabel: "Valor estimado",
      total: "R$ 212.495,00",
    },
  },

  consultor: {
    eyebrow: "Consultor com IA · mergulho",
    titleLines: ["Resposta jurídica com a", "fonte oficial e verificada."],
    pergunta: {
      autor: "Agente de Contratação",
      texto:
        "Posso prorrogar uma ata de registro de preços além dos 12 meses?",
    },
    resposta: {
      autor: "Consultor",
      antes: "Pode. O ",
      ref: "art. 84 da Lei nº 14.133/2021",
      depois:
        " fixa a vigência da ata em 1 ano e admite prorrogação por igual período, desde que comprovada a vantajosidade dos preços registrados.",
    },
    fonte: {
      label: "Fonte citada · Lei nº 14.133/2021, art. 84",
      citacao:
        "O prazo de vigência da ata de registro de preços será de 1 (um) ano e poderá ser prorrogado, por igual período, desde que comprovado o preço vantajoso.",
    },
    marquee: [
      "Citação aleatória sem vínculo com a fonte causa insegurança",
      "Valide e aprenda com quem sabe",
    ],
  },

  // Clímax — o grafo é o ativo proprietário do produto.
  grafo: {
    eyebrow: "O grafo de dados",
    titleLines: ["Os dados públicos, ligados.", "As respostas, com fonte."],
    body: "Lei, decretos, acórdãos do TCU e dos TCEs, preços do PNCP, SINAPI e BPS — num grafo único e atualizado diariamente. Passe o mouse ou toque: a constelação responde.",
    nos: [
      "Lei 14.133",
      "Decretos",
      "TCU · TCEs",
      "PNCP",
      "SINAPI",
      "BPS",
      "Seu processo",
      "Resposta com fonte",
    ],
    rodape: "Sincronização diária · PNCP · agendas dos tribunais",
  },

  // Vindo do site em produção (licitapublica.com.br). Faltava aqui: o
  // material do cliente descrevia O QUE o produto faz, mas nunca dizia a
  // QUEM cada parte serve — e num órgão a decisão passa por três mesas
  // diferentes.
  paraQuem: {
    eyebrow: "Para quem",
    titleLines: ["Cada servidor encontra", "o que precisa."],
    perfis: [
      {
        title: "Servidor Demandante",
        desc: "Elabore DFD e inicie o processo com assistência de IA, sem depender da equipe de licitações.",
        etapas: ["DFD", "Necessidade"],
      },
      {
        title: "Agente de Contratação",
        desc: "Monte ETP, TR e Edital com documentos padronizados e em conformidade legal.",
        etapas: ["ETP", "TR", "Edital"],
      },
      {
        title: "Assessor Jurídico e Controle Interno",
        desc: "Revise processos com checklist automatizado e emita pareceres com fundamentação.",
        etapas: ["Parecer", "Checklist"],
      },
    ],
  },

  governanca: {
    eyebrow: "Governança e sigilo",
    titleLines: ["Controle não é promessa.", "É arquitetura."],
    body: "Três linhas de defesa integradas no mesmo processo: requisitante, controle interno e auditoria. Cada uma com o que precisa pra fazer o seu trabalho, e nenhuma dependendo da boa vontade da anterior.",
    // `visual` descreve a demonstração que ocupa a metade de baixo de cada
    // card. Não é screenshot: é representação abstrata montada a partir do
    // que a própria descrição promete — checklist, criticidade, trilha.
    linhas: [
      {
        n: "1ª",
        title: "Revisão de documentos",
        desc: "Antes de o processo andar, um revisor automático confere DFD, ETP e TR contra um checklist da Lei nº 14.133/2021.",
        visual: {
          tipo: "checklist" as const,
          titulo: "Checklist · Lei nº 14.133/2021",
          itens: [
            { rotulo: "DFD", estado: "Conferido", ok: true },
            { rotulo: "ETP", estado: "Conferido", ok: true },
            { rotulo: "TR", estado: "1 apontamento", ok: false },
          ],
        },
      },
      {
        n: "2ª",
        title: "Controle interno e jurídico",
        desc: "Análise com histórico, minuta de parecer assistida por IA e registro de cada recomendação feita ao processo.",
        visual: {
          tipo: "criticidade" as const,
          titulo: "Apontamentos por criticidade",
          // Quatro itens de propósito: o último é cortado pela base do
          // card, que é o que dá a sensação de "isto continua".
          itens: [
            { rotulo: "Justificativa de preço", nivel: "Alta" },
            { rotulo: "Prazo de vigência", nivel: "Média" },
            { rotulo: "Redação do objeto", nivel: "Baixa" },
            { rotulo: "Vínculo com o PCA", nivel: "Baixa" },
          ],
        },
      },
      {
        n: "3ª",
        title: "Auditoria",
        desc: "Painel de conformidade, trilha de auditoria e transparência. O que o controle externo pergunta, o histórico responde.",
        visual: {
          tipo: "trilha" as const,
          titulo: "Trilha de auditoria",
          // Papéis, não nomes: inventar servidor seria o mesmo problema
          // dos depoimentos fictícios que ficaram de fora.
          // Ordem decrescente, como todo log — e na ordem inversa das
          // linhas de defesa, que é como o processo realmente andou.
          itens: [
            { hora: "09:12", autor: "Jurídico", acao: "Parecer emitido" },
            { hora: "08:40", autor: "Sistema", acao: "Checklist concluído" },
            { hora: "08:05", autor: "Controle interno", acao: "ETP revisado" },
            { hora: "07:52", autor: "Requisitante", acao: "DFD enviado" },
          ],
        },
      },
    ],
    marquee: [
      "Sigilo do art. 13",
      "Isolamento por órgão",
      "Chave de IA própria",
      "Região São Paulo",
      "LGPD e regulação de IA",
    ],
  },

  // Também do site em produção. Tínhamos só as três linhas de defesa; o
  // setor de compras pergunta muito além disso, e a resposta já existia
  // escrita — só não estava aqui.
  seguranca: {
    eyebrow: "Segurança e privacidade",
    titleLines: ["Confiança que a Administração", "Pública exige."],
    body: "Licitação envolve dados sensíveis, sigilo legal e responsabilidade institucional. Construímos a Licita Pública desde o primeiro byte para honrar esse padrão — com infraestrutura, governança e práticas auditáveis.",
    selos: [
      "Adequação à LGPD",
      "Sigilo legal da fase preparatória preservado",
      "Boas práticas reconhecidas pelo mercado",
    ],
    itens: [
      {
        title: "Conformidade com a LGPD",
        desc: "Tratamento de dados pessoais em observância à Lei Geral de Proteção de Dados, com finalidade definida e respeito aos direitos dos titulares.",
      },
      {
        title: "Dados protegidos",
        desc: "Informações sensíveis preservadas com práticas de proteção em padrões de mercado, tanto no tráfego quanto no armazenamento.",
      },
      {
        title: "Ambiente dedicado por órgão",
        desc: "Cada órgão opera em ambiente próprio e isolado. Os dados de um cliente jamais são visíveis a outro.",
      },
      {
        title: "Sigilo da fase preparatória",
        desc: "Confidencialidade preservada conforme a Lei nº 14.133/2021. Acesso restrito por papéis e segregação de funções entre as linhas de defesa.",
      },
      {
        title: "Rastreabilidade auditável",
        desc: "Cada ação relevante fica registrada com data, autor e contexto, permitindo prestação de contas a órgãos de controle.",
      },
      {
        title: "Continuidade e resiliência",
        desc: "Operação em conformidade com normas brasileiras, com rotinas de cópia de segurança e plano de continuidade de negócios.",
      },
    ],
    nota: "Mantemos um Encarregado de Dados (DPO) e canal exclusivo para titulares exercerem os direitos previstos na LGPD.",
    politica: "Política de Privacidade",
  },

  modulos: {
    eyebrow: "Módulos",
    titleLines: ["Uma plataforma.", "Toda a contratação."],
    body: "Contrate por módulo ou leve o ciclo inteiro. Tudo no mesmo banco, com o mesmo histórico.",
    // O ícone 3D de cada módulo NÃO fica aqui: o componente detecta
    // sozinho o arquivo /public/modulos/<sigla>.png. Soltar o PNG na pasta
    // é tudo o que precisa ser feito.
    itens: [
      {
        sigla: "NC",
        title: "Nova contratação e fase preparatória",
        desc: "DFD, ETP, TR e minutas guiados por IA",
      },
      {
        sigla: "ESP",
        title: "Especialista Licita Pública",
        desc: "Respostas com a fonte citada",
      },
      {
        sigla: "PP",
        title: "Pesquisa de Preços",
        desc: "Rito da IN nº 65/2021",
      },
      {
        sigla: "AJ",
        title: "Análise Jurídica",
        desc: "Apontamentos por criticidade",
      },
      {
        sigla: "CT",
        title: "Gestão de Contratos",
        desc: "Vigência, aditivos, medições e alertas de vencimento",
      },
      {
        sigla: "FX",
        title: "Painel do Fiscal",
        desc: "Checklist, registro de ocorrências e atesto de medições",
      },
      {
        sigla: "RP",
        title: "Gestão de Ata (RP)",
        desc: "Atas próprias e carona, com saldo por item e fornecedor",
      },
      {
        sigla: "CG",
        title: "Controladoria e Compliance",
        desc: "Rastreabilidade e permissões",
      },
    ],
  },

  quem: {
    eyebrow: "Quem está por trás",
    titleLines: ["Feita por quem ensina", "licitação há uma década."],
    body: "A Licita Pública é produto da Plenum Brasil, que capacitou mais de 30 mil gestores públicos em 10 anos. O conhecimento que virou apostila agora escreve documento, confere conformidade e responde dúvida dentro da plataforma.",
    nota: "Nada de depoimento inventado nem número inflado: o que mostramos é o produto real.",
    destaque: {
      valor: "80",
      sufixo: "%",
      desc: "de economia no tempo de elaboração dos documentos da fase preparatória.",
      reforco: "De semanas a poucas tardes.",
    },
  },

  demo: {
    eyebrow: "Demonstração",
    titleLines: ["Veja com o seu processo,", "não com o nosso exemplo."],
    body: "Na demonstração, a gente monta um processo do seu órgão do início ao fim: da entrevista do DFD ao relatório de pesquisa de preços. Traga um caso real e saia com ele encaminhado.",
    // Ordem pensada pro grid de 2 colunas: nome|órgão, cargo|whatsapp,
    // e-mail (linha inteira). Sem campo órfão sobrando numa linha.
    campos: [
      { name: "nome", label: "Nome", required: true, type: "text" },
      { name: "orgao", label: "Órgão", required: true, type: "text" },
      { name: "cargo", label: "Cargo", required: true, type: "text" },
      {
        name: "whatsapp",
        label: "WhatsApp (opcional)",
        required: false,
        type: "tel",
      },
      {
        name: "email",
        label: "E-mail institucional",
        required: true,
        type: "email",
      },
    ],
    lgpd:
      "Usamos seus dados apenas para responder ao pedido de demonstração, conforme a LGPD e a Política de Privacidade.",
    submit: "Quero uma demonstração",
  },

  faq: {
    eyebrow: "Perguntas de quem compra",
    titleLines: ["O que o setor de compras", "vai perguntar."],
    itens: [
      {
        q: "Como um órgão público contrata a plataforma?",
        a: "Depende do enquadramento: dispensa por valor, adesão ou processo próprio. A equipe comercial entrega a documentação para instruir o processo, incluindo proposta formal e comprovações da empresa.",
      },
      {
        q: "E o sigilo da fase preparatória?",
        a: "O art. 13 da Lei nº 14.133/2021 protege a fase preparatória: cada órgão opera em ambiente isolado, o conteúdo dos processos não entra em registro de atividade e nem a equipe da plataforma acessa os dados do cliente.",
      },
      {
        q: "A IA pode inventar uma lei ou um julgamento?",
        a: "Não. Citação sem fonte verificada não sai. Quando a base não tem a resposta, o ponto é marcado para revisão humana. O documento final é sempre revisado e assinado por servidor.",
      },
      {
        q: "Quais documentos saem prontos?",
        a: "DFD, ETP (completo ou simplificado), Termo de Referência, minutas de edital e contrato, parecer jurídico e ata de registro de preços — em DOCX no padrão oficial.",
      },
      {
        q: "Preciso trocar os sistemas que já uso?",
        a: "Não. A plataforma convive com o seu sistema de compras e o seu diário oficial. As integrações com PNCP e fontes públicas de preço já vêm prontas.",
      },
      {
        q: "Quanto custa?",
        a: "Os pacotes (Básico, Completo e Pro) variam com o porte do órgão e os módulos. Peça a demonstração e a proposta chega junto, em até 1 dia útil.",
      },
    ],
  },

  footer: {
    empresa: "Plenum Brasil",
    linha: "Licita Pública · Lei nº 14.133/2021",
    email: "contato@plenumbrasil.com.br",
    ano: "2026",
    politica: "Política de Privacidade",
    dpo: "Encarregado de Dados (DPO) e canal para titulares exercerem os direitos da LGPD.",
  },
} as const;
