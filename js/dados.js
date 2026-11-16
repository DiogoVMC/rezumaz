/* ==========================================================================
   rezumaz · dados do questionário
   Só dados. Nenhuma função, nenhuma mecânica — isso fica nos outros arquivos.

   É daqui que sai o requisito "array com 10 ou mais objetos exibido no DOM":
   o array atividades tem 60 objetos e é ele que o JS percorre para montar
   as cartas de cada tela.

   Campos de cada atividade:
     id          identificador único
     area        id da área (o usuário NUNCA vê isso)
     texto       o que aparece na carta, na língua da pessoa
     dica        exemplo concreto embaixo do texto
     nivel       comum | intermediaria | incomum
                 a sonda sempre começa pelas comuns; quando a pessoa não
                 marca nada, o botão vira "Ver mais atividades" e a tela
                 seguinte desce um nível
     competencia o NOME da habilidade. Vira pílula na tela e é a palavra-
                 chave que o anúncio de vaga usa.
     acao        o que a pessoa FEZ, em primeira pessoa e no passado.
                 Minúscula, sem ponto final, sem dizer onde foi.

   POR QUE NÃO EXISTE MAIS "EXPERIÊNCIA"
   Atividade de casa não entra como experiência profissional: isso convida o
   recrutador a descartar. O conselho padrão para primeiro emprego é apagar o
   bloco de experiência e trocar por habilidades. E habilidade não é só o
   nome: ela é escrita ligando a habilidade à ação.

   No currículo os dois campos saem juntos, assim:
     Controle financeiro — registrei entradas e saídas em caderno ou planilha
   Nunca "em casa", nunca "por hobby". O que vale é o que a pessoa sabe fazer.

   Atenção: a COR da carta não vem da área. O JS aplica cor-1 a cor-6 pela
   posição na tela e gira a sequência a cada tela. A cor da área só é usada
   depois do questionário, nas pílulas de competência.
   ========================================================================== */

/* ---------- as 6 áreas -------------------------------------------------- */
/* classe: usada só depois do questionário, nunca nas cartas */

const areas = [
  { id: "comercio",       nome: "Comércio e atendimento",   classe: "area-comercio" },
  { id: "cuidado",        nome: "Cuidado de pessoas",       classe: "area-cuidado" },
  { id: "cozinha",        nome: "Cozinha e alimentação",    classe: "area-cozinha" },
  { id: "limpeza",        nome: "Limpeza e manutenção",     classe: "area-limpeza" },
  { id: "tecnologia",     nome: "Tecnologia e suporte",     classe: "area-tecnologia" },
  { id: "administrativo", nome: "Administrativo e dinheiro", classe: "area-administrativo" }
];

/* ---------- as 60 atividades (array principal) -------------------------- */

const atividades = [

  /* --- comércio e atendimento --- */
  { id: "com-atender",  area: "comercio", nivel: "comum",
    texto: "Atendi quem chegava",
    dica: "Perguntei o que a pessoa precisava e levei até o produto",
    competencia: "Atendimento ao público",
    acao: "atendi clientes e orientei sobre os produtos" },
  { id: "com-caixa",    area: "comercio", nivel: "comum",
    texto: "Fiquei no caixa",
    dica: "Recebi dinheiro, dei troco, fechei no fim do dia",
    competencia: "Operação de caixa",
    acao: "recebi pagamentos e fechei o caixa" },
  { id: "com-rede",     area: "comercio", nivel: "comum",
    texto: "Vendi por WhatsApp ou rede social",
    dica: "Do primeiro contato até combinar a entrega",
    competencia: "Venda direta",
    acao: "vendi por redes sociais, do contato à entrega" },
  { id: "com-produto",  area: "comercio", nivel: "intermediaria",
    texto: "Expliquei produto pra cliente",
    dica: "Falei preço, diferença entre marcas, prazo de garantia",
    competencia: "Orientação ao cliente",
    acao: "expliquei preço, diferença entre marcas e garantia" },
  { id: "com-repor",    area: "comercio", nivel: "intermediaria",
    texto: "Repus prateleira",
    dica: "Conferi o que estava faltando, arrumei e pedi mais",
    competencia: "Reposição e estoque",
    acao: "conferi, repus e organizei mercadorias" },
  { id: "com-troca",    area: "comercio", nivel: "intermediaria",
    texto: "Resolvi reclamação ou troca",
    dica: "Cliente voltou bravo e eu que resolvi",
    competencia: "Pós-venda",
    acao: "resolvi reclamações, trocas e devoluções" },
  { id: "com-pedido",   area: "comercio", nivel: "intermediaria",
    texto: "Anotei pedido por telefone",
    dica: "Alguém ligou pedindo e eu anotei certo",
    competencia: "Registro de pedidos",
    acao: "anotei e conferi pedidos por telefone" },
  { id: "com-vitrine",  area: "comercio", nivel: "incomum",
    texto: "Arrumei a loja ou montei vitrine",
    dica: "Deixei o lugar apresentável pro cliente",
    competencia: "Organização de ponto de venda",
    acao: "montei vitrine e organizei a loja" },
  { id: "com-entrega",  area: "comercio", nivel: "incomum",
    texto: "Fiz entrega",
    dica: "Levei a mercadoria até a casa do cliente",
    competencia: "Entrega",
    acao: "entreguei mercadorias ao cliente" },
  { id: "com-turno",    area: "comercio", nivel: "incomum",
    texto: "Fiquei responsável pela loja",
    dica: "Um período inteiro sem ter ninguém acima",
    competencia: "Responsabilidade por turno",
    acao: "respondi pelo funcionamento do ponto durante o turno" },

  /* --- cuidado de pessoas --- */
  { id: "cui-crianca",  area: "cuidado", nivel: "comum",
    texto: "Cuidei de criança",
    dica: "Irmão, sobrinho, filho de vizinho",
    competencia: "Cuidado infantil",
    acao: "cuidei de criança, com rotina de alimentação e higiene" },
  { id: "cui-idoso",    area: "cuidado", nivel: "comum",
    texto: "Cuidei de idoso ou de doente",
    dica: "Acompanhei alguém que precisava de ajuda o dia todo",
    competencia: "Cuidado de pessoa dependente",
    acao: "acompanhei pessoa idosa ou em recuperação" },
  { id: "cui-remedio",  area: "cuidado", nivel: "comum",
    texto: "Dei remédio na hora certa",
    dica: "Controlei o horário da medicação de alguém",
    competencia: "Controle de medicação",
    acao: "controlei horários de medicação" },
  { id: "cui-consulta", area: "cuidado", nivel: "intermediaria",
    texto: "Levei alguém em consulta",
    dica: "Acompanhei no posto, no hospital, no exame",
    competencia: "Acompanhamento em saúde",
    acao: "acompanhei consultas e exames" },
  { id: "cui-higiene",  area: "cuidado", nivel: "intermediaria",
    texto: "Ajudei alguém no banho e a se vestir",
    dica: "Quem não consegue mais fazer sozinho",
    competencia: "Higiene e conforto",
    acao: "apoiei em higiene pessoal e conforto" },
  { id: "cui-dieta",    area: "cuidado", nivel: "intermediaria",
    texto: "Fiz comida pra quem tem restrição",
    dica: "Diabético, sem sal, sem glúten, batido",
    competencia: "Alimentação assistida",
    acao: "preparei refeições com restrição alimentar" },
  { id: "cui-licao",    area: "cuidado", nivel: "intermediaria",
    texto: "Ajudei criança com a lição",
    dica: "Sentei junto e expliquei até entender",
    competencia: "Apoio escolar",
    acao: "apoiei criança em atividade escolar" },
  { id: "cui-curativo", area: "cuidado", nivel: "incomum",
    texto: "Troquei curativo ou fralda",
    dica: "Cuidado que precisa de mão firme e higiene",
    competencia: "Cuidados básicos de higiene",
    acao: "troquei curativos seguindo orientação" },
  { id: "cui-noite",    area: "cuidado", nivel: "incomum",
    texto: "Cuidei de alguém à noite",
    dica: "Dormi por perto porque alguém podia precisar",
    competencia: "Cuidado noturno",
    acao: "acompanhei pessoa dependente em turno noturno" },
  { id: "cui-rotina",   area: "cuidado", nivel: "incomum",
    texto: "Organizei a rotina de cuidado de alguém",
    dica: "Eu que lembrava dos remédios, consultas e refeições",
    competencia: "Organização de rotina de cuidado",
    acao: "organizei rotina de medicação, consultas e refeições" },

  /* --- cozinha e alimentação --- */
  { id: "coz-familia",  area: "cozinha", nivel: "comum",
    texto: "Cozinhei pra casa toda",
    dica: "Almoço de todo dia pra várias pessoas",
    competencia: "Preparo de refeições",
    acao: "preparei refeições em quantidade" },
  { id: "coz-louca",    area: "cozinha", nivel: "comum",
    texto: "Lavei louça e limpei a cozinha",
    dica: "Depois que todo mundo comeu, sobrou pra mim",
    competencia: "Higiene de cozinha",
    acao: "higienizei utensílios e área de preparo" },
  { id: "coz-vender",   area: "cozinha", nivel: "comum",
    texto: "Fiz bolo, salgado ou doce pra vender",
    dica: "Encomenda de aniversário, venda na rua, no trabalho",
    competencia: "Produção de alimentos",
    acao: "produzi alimentos para venda" },
  { id: "coz-evento",   area: "cozinha", nivel: "intermediaria",
    texto: "Cozinhei pra festa",
    dica: "Aniversário, almoço de família grande, evento da igreja",
    competencia: "Preparo para evento",
    acao: "preparei alimentos para eventos" },
  { id: "coz-servir",   area: "cozinha", nivel: "intermediaria",
    texto: "Servi comida pra bastante gente",
    dica: "Montei o prato, servi, repus a travessa",
    competencia: "Serviço de alimentação",
    acao: "servi e distribuí refeições" },
  { id: "coz-compra",   area: "cozinha", nivel: "intermediaria",
    texto: "Fiz a lista e comprei o rancho",
    dica: "Calculei o que ia precisar pro mês",
    competencia: "Controle de insumos",
    acao: "levantei a necessidade e comprei insumos" },
  { id: "coz-marmita",  area: "cozinha", nivel: "intermediaria",
    texto: "Montei marmita",
    dica: "Dividi em porção, embalei, etiquetei",
    competencia: "Porcionamento",
    acao: "porcionei e embalei refeições" },
  { id: "coz-validade", area: "cozinha", nivel: "incomum",
    texto: "Conferi validade dos alimentos",
    dica: "Olhei data, joguei o vencido, organizei o resto",
    competencia: "Controle de validade",
    acao: "conferi validade e organizei o armazenamento" },
  { id: "coz-pressao",  area: "cozinha", nivel: "incomum",
    texto: "Cozinhei com horário apertado",
    dica: "Muita gente esperando e pouco tempo",
    competencia: "Trabalho sob pressão",
    acao: "preparei refeições em ritmo de alta demanda" },
  { id: "coz-ensinar",  area: "cozinha", nivel: "incomum",
    texto: "Ensinei alguém a cozinhar",
    dica: "Passei a receita e acompanhei fazendo",
    competencia: "Treinamento",
    acao: "orientei outra pessoa no preparo" },

  /* --- limpeza e manutenção --- */
  { id: "lim-faxina",   area: "limpeza", nivel: "comum",
    texto: "Fiz a faxina de um lugar inteiro",
    dica: "Casa, salão, igreja, loja",
    competencia: "Limpeza e conservação",
    acao: "limpei ambientes por completo" },
  { id: "lim-roupa",    area: "limpeza", nivel: "comum",
    texto: "Lavei e passei roupa",
    dica: "Da casa toda, ou pra fora",
    competencia: "Lavanderia",
    acao: "lavei, sequei e passei roupas" },
  { id: "lim-planta",   area: "limpeza", nivel: "comum",
    texto: "Cuidei de planta, quintal ou horta",
    dica: "Reguei, podei, capinei, plantei",
    competencia: "Jardinagem",
    acao: "cuidei de área verde, com rega e poda" },
  { id: "lim-estoque",  area: "limpeza", nivel: "intermediaria",
    texto: "Organizei armário, depósito ou estoque",
    dica: "Separei, etiquetei, deixei achando rápido",
    competencia: "Organização de estoque",
    acao: "organizei e etiquetei estoque" },
  { id: "lim-reparo",   area: "limpeza", nivel: "intermediaria",
    texto: "Consertei coisa pequena",
    dica: "Torneira pingando, tomada, dobradiça, chuveiro",
    competencia: "Manutenção básica",
    acao: "fiz pequenos reparos de manutenção" },
  { id: "lim-pintura",  area: "limpeza", nivel: "intermediaria",
    texto: "Pintei parede ou móvel",
    dica: "Lixei, passei massa, pintei",
    competencia: "Pintura",
    acao: "preparei superfície e pintei" },
  { id: "lim-animal",   area: "limpeza", nivel: "intermediaria",
    texto: "Cuidei de animal",
    dica: "Alimentei, dei banho, levei no veterinário",
    competencia: "Cuidado animal",
    acao: "alimentei e cuidei de animais" },
  { id: "lim-pesada",   area: "limpeza", nivel: "incomum",
    texto: "Limpei depois de obra ou de festa",
    dica: "Aquela limpeza que ninguém quer fazer",
    competencia: "Limpeza pesada",
    acao: "fiz limpeza pós-obra e pós-evento" },
  { id: "lim-produto",  area: "limpeza", nivel: "incomum",
    texto: "Usei produto de limpeza forte",
    dica: "Li o rótulo, usei luva, não misturei",
    competencia: "Uso seguro de produtos",
    acao: "usei produtos de limpeza seguindo as orientações de segurança" },
  { id: "lim-continua", area: "limpeza", nivel: "incomum",
    texto: "Cuidei da manutenção de um lugar",
    dica: "Era eu que mantinha aquilo funcionando",
    competencia: "Conservação continuada",
    acao: "mantive um ambiente conservado por meses" },

  /* --- tecnologia e suporte --- */
  { id: "tec-ensinar",  area: "tecnologia", nivel: "comum",
    texto: "Ensinei alguém a usar celular",
    dica: "Pix, WhatsApp, app do banco, foto",
    competencia: "Suporte a usuário",
    acao: "orientei pessoas no uso de aplicativos e aparelhos" },
  { id: "tec-internet", area: "tecnologia", nivel: "comum",
    texto: "Resolvi problema de internet",
    dica: "Wi-Fi caindo, roteador, senha, sinal",
    competencia: "Suporte de rede",
    acao: "configurei internet e resolvi problemas de conexão" },
  { id: "tec-office",   area: "tecnologia", nivel: "comum",
    texto: "Mexi com planilha no computador",
    dica: "Fiz um texto, uma tabela, um orçamento",
    competencia: "Planilhas e editor de texto",
    acao: "montei tabelas e documentos no computador" },
  { id: "tec-config",   area: "tecnologia", nivel: "intermediaria",
    texto: "Configurei aparelho novo",
    dica: "Celular, TV, impressora, caixa de som",
    competencia: "Instalação e configuração",
    acao: "instalei e configurei equipamentos" },
  { id: "tec-social",   area: "tecnologia", nivel: "intermediaria",
    texto: "Cuidei da rede social de alguém",
    dica: "De um negócio, de uma igreja, de um grupo",
    competencia: "Redes sociais",
    acao: "publiquei e respondi em redes sociais" },
  { id: "tec-foto",     area: "tecnologia", nivel: "intermediaria",
    texto: "Tirei e editei foto pra divulgar",
    dica: "Foto de produto, de evento, pra venda",
    competencia: "Produção de conteúdo",
    acao: "registrei e editei imagens para divulgação" },
  { id: "tec-formatar", area: "tecnologia", nivel: "intermediaria",
    texto: "Formatei ou instalei programa",
    dica: "Deixei a máquina de alguém funcionando de novo",
    competencia: "Manutenção de equipamento",
    acao: "formatei computador e instalei programas" },
  { id: "tec-consertar", area: "tecnologia", nivel: "incomum",
    texto: "Consertei aparelho",
    dica: "Troquei peça, abri, soldei, fiz voltar a ligar",
    competencia: "Reparo de equipamento",
    acao: "reparei aparelhos eletrônicos" },
  { id: "tec-cadastro", area: "tecnologia", nivel: "incomum",
    texto: "Montei cadastro no computador",
    dica: "Lista de clientes, de produto, de presença",
    competencia: "Cadastro e registro",
    acao: "cadastrei e organizei registros no computador" },
  { id: "tec-aprender", area: "tecnologia", nivel: "incomum",
    texto: "Aprendi um programa novo sozinho",
    dica: "Precisei resolver e fui atrás, sem curso",
    competencia: "Aprendizagem autônoma",
    acao: "aprendi ferramenta nova por conta própria" },

  /* --- administrativo e dinheiro --- */
  { id: "adm-anotar",   area: "administrativo", nivel: "comum",
    texto: "Anotei entrada e saída de dinheiro",
    dica: "Caderno, bloco de notas, planilha",
    competencia: "Controle financeiro",
    acao: "registrei entradas e saídas em caderno ou planilha" },
  { id: "adm-conta",    area: "administrativo", nivel: "comum",
    texto: "Paguei conta e boleto",
    dica: "Eu que lembrava do vencimento",
    competencia: "Controle de prazos",
    acao: "controlei vencimentos e paguei contas no prazo" },
  { id: "adm-documento", area: "administrativo", nivel: "comum",
    texto: "Guardei documento importante",
    dica: "Sabia onde estava cada papel da casa",
    competencia: "Organização de documentos",
    acao: "organizei e arquivei documentos" },
  { id: "adm-orcamento", area: "administrativo", nivel: "intermediaria",
    texto: "Comparei preço antes de comprar",
    dica: "Pesquisei em três lugares pra achar o melhor",
    competencia: "Pesquisa de preço",
    acao: "pesquisei preços e montei orçamento" },
  { id: "adm-telefone", area: "administrativo", nivel: "intermediaria",
    texto: "Atendi telefone e passei recado",
    dica: "Anotei quem ligou e o que queria",
    competencia: "Atendimento telefônico",
    acao: "atendi telefone e encaminhei solicitações" },
  { id: "adm-ficha",    area: "administrativo", nivel: "intermediaria",
    texto: "Preenchi formulário ou ficha pra alguém",
    dica: "Cadastro, inscrição, requerimento",
    competencia: "Preenchimento de cadastro",
    acao: "preenchi formulários e fichas cadastrais" },
  { id: "adm-mes",      area: "administrativo", nivel: "intermediaria",
    texto: "Controlei o gasto do mês",
    dica: "Dividi o dinheiro pra chegar até o fim",
    competencia: "Planejamento de orçamento",
    acao: "planejei o orçamento do mês" },
  { id: "adm-negociar", area: "administrativo", nivel: "incomum",
    texto: "Negociei dívida ou prazo",
    dica: "Liguei, pedi desconto, parcelei",
    competencia: "Negociação",
    acao: "negociei prazos e valores" },
  { id: "adm-banco",    area: "administrativo", nivel: "incomum",
    texto: "Ajudei alguém com o banco",
    dica: "Resolvi o que a pessoa não conseguia sozinha",
    competencia: "Serviços bancários",
    acao: "apoiei em operações bancárias e aplicativos" },
  { id: "adm-agenda",   area: "administrativo", nivel: "incomum",
    texto: "Organizei a agenda de alguém",
    dica: "Marquei consulta, reunião, compromisso",
    competencia: "Organização de agenda",
    acao: "organizei agenda e compromissos" }
];

/* ---------- responsabilidade (não pertence a área nenhuma) -------------- */
/* Aparece na última tela do afunilamento. Não vira bloco próprio: promove o
   título do bloco da área mais forte. */

const responsabilidades = [
  { id: "resp-sozinho",   texto: "Fiquei responsável sozinho por um período",
    dica: "Sem ninguém pra perguntar, decidindo na hora",
    competencia: "Autonomia",
    acao: "respondi sozinho por um período, sem supervisão",
    titulo: "com responsabilidade pelo turno" },
  { id: "resp-ensinar",   texto: "Ensinei outra pessoa a fazer o que eu fazia",
    dica: "Alguém chegou e eu que mostrei",
    competencia: "Treinamento de pessoas",
    acao: "treinei outra pessoa na atividade",
    titulo: "com treinamento de colegas" },
  { id: "resp-organizar", texto: "Organizei um evento ou mutirão",
    dica: "Dividi tarefa, marquei dia, cobrei quem faltou",
    competencia: "Organização de evento",
    acao: "organizei evento, dividindo tarefas",
    titulo: "e organização" },
  { id: "resp-coordenar", texto: "Coordenei um grupo de pessoas",
    dica: "Time, grupo da igreja, equipe de trabalho",
    competencia: "Coordenação de equipe",
    acao: "coordenei um grupo de pessoas",
    titulo: "e coordenação" }
];

/* ---------- frequência -------------------------------------------------- */
/* A pergunta NUNCA nomeia a área. A tela devolve as cartas que a pessoa
   marcou, com as palavras dela, e pergunta em cima delas:
   "Com que frequência você fazia isso?" */

const frequencias = [
  { id: "freq-diaria",   texto: "Todo dia, por meses", dica: "Era parte da minha rotina",                peso: 4 },
  { id: "freq-semanal",  texto: "Toda semana",         dica: "Fim de semana, feriado, dia de movimento", peso: 3 },
  { id: "freq-eventual", texto: "De vez em quando",    dica: "Quando precisavam de mim",                 peso: 2 },
  { id: "freq-poucas",   texto: "Poucas vezes",        dica: "Já fiz, mas não era comum",                peso: 1 }
];

/* O peso faz duas coisas, e nenhuma delas aparece escrita no currículo:
   1. ordena as habilidades, da mais frequente para a menos
   2. corta: peso 1 não vira habilidade listada.
      É o que impede "ajudei uma vez na loja do tio" de virar linha.
     O currículo mostra no MÁXIMO 6 habilidades. Lista de 20 palavras soltas é
     erro clássico; 5 ou 6 bem escolhidas bastam. */

const MAXIMO_DE_HABILIDADES = 6;

/* ---------- rótulos de grupo -------------------------------------------- */
/* ATENÇÃO: Estes rótulos servem só DENTRO DO APP, para agrupar as
   habilidades na tela da etapa 3 e deixar a lista legível.
   Duas variantes por área; empate vai para a A. */

const titulos = [
  { area: "comercio", variante: "A", titulo: "Atendimento em comércio",
    quando: ["com-atender", "com-caixa", "com-produto", "com-repor", "com-troca", "com-vitrine", "com-turno"] },
  { area: "comercio", variante: "B", titulo: "Venda por conta própria",
    quando: ["com-rede", "com-pedido", "com-entrega"] },

  { area: "cuidado", variante: "A", titulo: "Cuidado de criança",
    quando: ["cui-crianca", "cui-licao"] },
  { area: "cuidado", variante: "B", titulo: "Cuidado de pessoa idosa ou doente",
    quando: ["cui-idoso", "cui-remedio", "cui-higiene", "cui-curativo", "cui-noite", "cui-rotina", "cui-consulta", "cui-dieta"] },

  { area: "cozinha", variante: "A", titulo: "Cozinha e apoio em refeições",
    quando: ["coz-familia", "coz-louca", "coz-servir", "coz-compra", "coz-validade", "coz-ensinar"] },
  { area: "cozinha", variante: "B", titulo: "Produção de alimentos",
    quando: ["coz-vender", "coz-evento", "coz-marmita", "coz-pressao"] },

  { area: "limpeza", variante: "A", titulo: "Limpeza e conservação",
    quando: ["lim-faxina", "lim-roupa", "lim-pesada", "lim-produto", "lim-estoque"] },
  { area: "limpeza", variante: "B", titulo: "Manutenção e área externa",
    quando: ["lim-reparo", "lim-pintura", "lim-planta", "lim-animal", "lim-continua"] },

  { area: "tecnologia", variante: "A", titulo: "Suporte a usuários",
    quando: ["tec-ensinar", "tec-internet", "tec-config", "tec-consertar"] },
  { area: "tecnologia", variante: "B", titulo: "Apoio com computador",
    quando: ["tec-office", "tec-social", "tec-foto", "tec-cadastro", "tec-formatar", "tec-aprender"] },

  { area: "administrativo", variante: "A", titulo: "Controle financeiro",
    quando: ["adm-anotar", "adm-conta", "adm-orcamento", "adm-mes", "adm-negociar"] },
  { area: "administrativo", variante: "B", titulo: "Rotina administrativa",
    quando: ["adm-documento", "adm-telefone", "adm-ficha", "adm-banco", "adm-agenda"] }
];

/* ---------- áreas de destino (pergunta opcional da etapa 3) ------------- */
/* Escolher um destino SÓ reordena os blocos. Nenhum texto muda. */

const destinos = [
  { id: "vendas",         nome: "Vendas e comércio", classe: "area-comercio",       combina: ["comercio", "administrativo"] },
  { id: "saude",          nome: "Saúde e cuidado",   classe: "area-cuidado",        combina: ["cuidado", "limpeza"] },
  { id: "atendimento",    nome: "Atendimento",       classe: "area-administrativo", combina: ["comercio", "tecnologia", "administrativo"] },
  { id: "alimentacao",    nome: "Alimentação",       classe: "area-cozinha",        combina: ["cozinha", "limpeza"] },
  { id: "servicos",       nome: "Serviços gerais",   classe: "area-limpeza",        combina: ["limpeza", "cuidado"] },
  { id: "administrativo", nome: "Administrativo",    classe: "area-tecnologia",     combina: ["administrativo", "tecnologia"] }
];

/* ---------- cursos gratuitos sugeridos ---------------------------------- */

const cursos = [
  { id: "venda",       nome: "Técnicas de venda",        destino: "vendas",         classe: "area-comercio",       instituicao: "a conferir", carga: "a conferir", link: "#" },
  { id: "atendimento", nome: "Atendimento ao cliente",   destino: "atendimento",    classe: "area-cuidado",        instituicao: "a conferir", carga: "a conferir", link: "#" },
  { id: "primeiros",   nome: "Primeiros socorros",       destino: "saude",          classe: "area-cuidado",        instituicao: "a conferir", carga: "a conferir", link: "#" },
  { id: "manipulacao", nome: "Manipulação de alimentos", destino: "alimentacao",    classe: "area-cozinha",        instituicao: "a conferir", carga: "a conferir", link: "#" },
  { id: "informatica", nome: "Informática básica",       destino: "administrativo", classe: "area-tecnologia",     instituicao: "a conferir", carga: "a conferir", link: "#" },
  { id: "seguranca",   nome: "Segurança no trabalho",    destino: "servicos",       classe: "area-limpeza",        instituicao: "a conferir", carga: "a conferir", link: "#" }
];


/* ---------- categorias de deficiência ----------------------------------- */

const categoriasPcd = [
  { id: "fisica",       nome: "Física" },
  { id: "auditiva",     nome: "Auditiva" },
  { id: "visual",       nome: "Visual" },
  { id: "intelectual",  nome: "Intelectual" },
  { id: "multipla",     nome: "Múltipla" },
  { id: "tea",          nome: "Transtorno do Espectro Autista (TEA)" },
  { id: "psicossocial", nome: "Mental ou psicossocial" },
  { id: "reabilitado",  nome: "Reabilitado pelo INSS" }
];
