const CARTAS_POR_TELA = 6;
const CARTAS_QUENTES = 3;
const TELAS_VAZIAS_PARA_TROCAR_DE_NIVEL = 2;
const ORDEM_DOS_NIVEIS = ["comum", "intermediaria", "incomum"];

// quanto do que a pessoa marcou precisa cair na area escolhida pra
// aderencia parar de ser fraca. abaixo disso o aviso aparece
const ADERENCIA_FRACA = 0.3;
const ADERENCIA_FORTE = 0.6;

let fases = [];
let faseAtual = -1;
let nivelAtual = 0;
let telasVaziasSeguidas = 0;
let acabaram = false;

let jaMostradas = [];
let marcadas = [];
let mostradasPorArea = {};


function acharAtividade(id) {
  let achada = atividades.find(a => a.id === id);
  if (achada) {
    return achada;
  }
  return responsabilidades.find(r => r.id === id);
}


function sobrouNoNivel(nivel) {
  return atividades.filter(a => a.nivel === nivel && jaMostradas.indexOf(a.id) === -1);
}


// areas ordenadas da mais quente pra mais fria. quente = onde a pessoa
// ja marcou mais coisa. area sem nenhuma marcacao nao entra na lista
function areasPorCalor() {
  let calor = {};

  for (let i = 0; i < marcadas.length; i++) {
    let area = marcadas[i].area;

    // responsabilidade entra em marcadas com area vazia. ela nao
    // esquenta area nenhuma, e se entrasse aqui a area "" viraria
    // um grupo na frequencia, repetindo as mesmas pilulas duas vezes
    if (!area) {
      continue;
    }

    if (!calor[area]) {
      calor[area] = 0;
    }
    calor[area]++;
  }

  let lista = Object.keys(calor);
  lista.sort((uma, outra) => calor[outra] - calor[uma]);
  return lista;
}


// tira N cartas da lista, uma de cada area por vez, comecando pela area
// que menos apareceu. sem isso sai tela com 6 cartas da mesma area
function espalharPorArea(lista, quantas) {
  let porArea = {};
  let areas = [];

  for (let i = 0; i < lista.length; i++) {
    let area = lista[i].area;

    if (!porArea[area]) {
      porArea[area] = [];
      areas.push(area);
    }

    porArea[area].push(lista[i]);
  }

  areas.sort((uma, outra) => (mostradasPorArea[uma] || 0) - (mostradasPorArea[outra] || 0));

  let escolhidas = [];
  let rodada = 0;

  while (escolhidas.length < quantas) {
    let entrouAlguma = false;

    for (let i = 0; i < areas.length; i++) {
      if (escolhidas.length >= quantas) {
        break;
      }

      let daArea = porArea[areas[i]];

      if (daArea.length > rodada) {
        escolhidas.push(daArea[rodada]);
        entrouAlguma = true;
      }
    }

    if (!entrouAlguma) {
      break;
    }

    rodada++;
  }

  return escolhidas;
}


// monta as 6 cartas do nivel atual. no comum nao afunila nada, porque
// ainda nao existe calor pra medir: espalha entre as 6 areas.
// nos outros niveis sao 3 das areas mais quentes e 3 do resto
function montarCartasDoNivel() {
  let restantes = sobrouNoNivel(ORDEM_DOS_NIVEIS[nivelAtual]);

  if (restantes.length === 0) {
    return [];
  }

  if (ORDEM_DOS_NIVEIS[nivelAtual] === "comum") {
    return espalharPorArea(restantes, CARTAS_POR_TELA);
  }

  let quentes = areasPorCalor();

  if (quentes.length === 0) {
    return espalharPorArea(restantes, CARTAS_POR_TELA);
  }

  // as 3 quentes saem da area mais quente primeiro. acabando as dela
  // no nivel, continua pela segunda mais quente, e assim por diante
  let escolhidas = [];

  for (let i = 0; i < quentes.length; i++) {
    if (escolhidas.length >= CARTAS_QUENTES) {
      break;
    }

    let daArea = restantes.filter(a => a.area === quentes[i]);

    for (let j = 0; j < daArea.length; j++) {
      if (escolhidas.length >= CARTAS_QUENTES) {
        break;
      }
      escolhidas.push(daArea[j]);
    }
  }

  // as 3 frias vem das areas que a pessoa nao tocou, espalhadas
  let frias = restantes.filter(
    a => quentes.indexOf(a.area) === -1 && escolhidas.indexOf(a) === -1
  );
  escolhidas = escolhidas.concat(
    espalharPorArea(frias, CARTAS_POR_TELA - escolhidas.length)
  );

  // nao deu 6: completa com o que sobrou do proprio nivel
  if (escolhidas.length < CARTAS_POR_TELA) {
    let sobrando = restantes.filter(a => escolhidas.indexOf(a) === -1);
    escolhidas = escolhidas.concat(
      espalharPorArea(sobrando, CARTAS_POR_TELA - escolhidas.length)
    );
  }

  return escolhidas;
}


function registrarQueFoiMostrada(carta) {
  jaMostradas.push(carta.id);

  if (carta.area) {
    if (!mostradasPorArea[carta.area]) {
      mostradasPorArea[carta.area] = 0;
    }
    mostradasPorArea[carta.area]++;
  }
}


// as 4 responsabilidades nao pertencem a area nenhuma. elas sao a
// ultima fase, porque so fazem sentido depois que a pessoa ja disse
// o que fazia: responsavel sozinho pelo que?
function montarFaseDeResponsabilidades() {
  let faltando = responsabilidades.filter(r => jaMostradas.indexOf(r.id) === -1);

  if (faltando.length === 0) {
    return [];
  }

  return faltando;
}


function montarProximaFase() {
  while (nivelAtual < ORDEM_DOS_NIVEIS.length) {
    let cartas = montarCartasDoNivel();

    if (cartas.length > 0) {
      for (let i = 0; i < cartas.length; i++) {
        registrarQueFoiMostrada(cartas[i]);
      }
      return cartas;
    }

    nivelAtual++;
    telasVaziasSeguidas = 0;
  }

  let ultimas = montarFaseDeResponsabilidades();

  for (let i = 0; i < ultimas.length; i++) {
    registrarQueFoiMostrada(ultimas[i]);
  }

  return ultimas;
}


function escreverCartas(lote) {
  let cartas = document.querySelectorAll("#tela-atividades .opcao");

  for (let i = 0; i < cartas.length; i++) {
    let carta = cartas[i];
    let atividade = lote[i];
    let caixa = carta.querySelector(".opcao__caixa");
    let texto = carta.querySelector(".opcao__texto");
    let dica = carta.querySelector(".opcao__dica");

    // sobrou caixa e acabou atividade
    if (!atividade) {
      carta.classList.add("oculto");
      caixa.checked = false;
      continue;
    }

    carta.classList.remove("oculto");
    caixa.value = atividade.id;

    // volta marcada se a pessoa ja tinha marcado essa carta antes
    caixa.checked = marcadas.some(item => item.id === atividade.id);

    // o nome da atividade e um texto solto dentro do .opcao__texto,
    // antes do .opcao__dica. nodeType 3 quer dizer "no de texto"
    let no = texto.firstChild;

    while (no && no.nodeType !== 3) {
      no = no.nextSibling;
    }

    if (no) {
      no.nodeValue = atividade.texto;
    }

    dica.textContent = atividade.dica;
  }
}


function quantasMarcouNaFase(indice) {
  if (indice < 0 || indice >= fases.length) {
    return 0;
  }

  let quantas = 0;
  let lote = fases[indice];

  for (let i = 0; i < lote.length; i++) {
    if (marcadas.some(item => item.id === lote[i].id)) {
      quantas++;
    }
  }

  return quantas;
}


function anotarMarcacao(evento) {
  let caixa = evento.target;

  if (!caixa.classList || !caixa.classList.contains("opcao__caixa")) {
    return;
  }

  let jaEstava = marcadas.find(item => item.id === caixa.value);

  if (caixa.checked && !jaEstava) {
    let atividade = acharAtividade(caixa.value);

    if (atividade) {
      marcadas.push({ id: atividade.id, area: atividade.area || "", fase: faseAtual });
    }
  }

  if (!caixa.checked && jaEstava) {
    marcadas.splice(marcadas.indexOf(jaEstava), 1);
  }

  atualizarRecadoVazio();
}


// o visual.js conta so as caixas marcadas na tela atual, entao depois
// de virar a tela ele acha zero e mostra o recado de "nao marcou nada"
// mesmo pra quem marcou coisa nas telas anteriores
function atualizarRecadoVazio() {
  let recado = document.getElementById("ajuda-vazio");

  if (marcadas.length > 0) {
    recado.classList.add("oculto");
  }
}


// passou pelos comuns sem marcar nada: nao da pra afunilar o que nao
// esquentou. encerra aqui, troca o recado e manda pros cursos
function encerrarSondagemVazia() {
  acabaram = true;

  // o visual.js esconde o recado quando o botao vira "ultima",
  // entao o recado so aparece depois dessa chamada
  window.definirBotaoComo("ultima");

  document.getElementById("ajuda-vazio").classList.remove("oculto");
  document.getElementById("recado-tem-mais").classList.add("oculto");
  document.getElementById("recado-sem-entender").classList.remove("oculto");

  // AQUI entra a chamada de sugerirCursos() quando ela existir
}


function mostrarFase(indice) {
  faseAtual = indice;
  escreverCartas(fases[indice]);
  atualizarRecadoVazio();

  if (indice === fases.length - 1 && acabaram) {
    window.definirBotaoComo("ultima");
  } else {
    window.definirBotaoComo("normal");
  }
}


function avancarFase() {
  // a tela que a pessoa esta deixando contou como vazia?
  if (quantasMarcouNaFase(faseAtual) === 0) {
    telasVaziasSeguidas++;
  } else {
    telasVaziasSeguidas = 0;
  }

  // pulou telas demais neste nivel: desce pro proximo aprofundamento
  if (telasVaziasSeguidas >= TELAS_VAZIAS_PARA_TROCAR_DE_NIVEL) {
    nivelAtual++;
    telasVaziasSeguidas = 0;
  }

  if (nivelAtual > 0 && marcadas.length === 0) {
    encerrarSondagemVazia();
    return;
  }

  // ja existe fase gerada a frente (a pessoa tinha voltado): mostra ela
  if (faseAtual + 1 < fases.length) {
    mostrarFase(faseAtual + 1);
    return;
  }

  let cartas = montarProximaFase();

  if (cartas.length === 0) {
    acabaram = true;
    window.definirBotaoComo("ultima");
    return;
  }

  fases.push(cartas);
  mostrarFase(fases.length - 1);

  // olha uma fase a frente: se nao sobrou nada, o botao ja vira
  // Continuar agora, senao a pessoa da um clique que nao muda nada
  let aindaTem = false;

  for (let i = nivelAtual; i < ORDEM_DOS_NIVEIS.length; i++) {
    if (sobrouNoNivel(ORDEM_DOS_NIVEIS[i]).length > 0) {
      aindaTem = true;
    }
  }

  if (!aindaTem && montarFaseDeResponsabilidades().length === 0) {
    acabaram = true;
    window.definirBotaoComo("ultima");
  }
}


// voltar nao e so trocar a tela: o estado inteiro volta pro momento em
// que a pessoa chegou naquela fase. as marcacoes feitas nela saem, e as
// fases da frente sao jogadas fora, porque foram montadas por um calor
// que pode nao existir mais
function rebobinarPara(indice) {
  fases = fases.slice(0, indice + 1);
  marcadas = marcadas.filter(item => item.fase < indice);

  jaMostradas = [];
  mostradasPorArea = {};

  for (let i = 0; i < fases.length; i++) {
    for (let j = 0; j < fases[i].length; j++) {
      registrarQueFoiMostrada(fases[i][j]);
    }
  }

  let nivelDaFase = fases[indice][0] && fases[indice][0].nivel;

  if (nivelDaFase) {
    nivelAtual = ORDEM_DOS_NIVEIS.indexOf(nivelDaFase);
  } else {
    nivelAtual = ORDEM_DOS_NIVEIS.length;
  }

  telasVaziasSeguidas = 0;
  acabaram = false;
}


function voltarFase() {
  if (faseAtual > 0) {
    rebobinarPara(faseAtual - 1);
    mostrarFase(faseAtual - 1);
    return true;
  }
  return false;
}


// cada etapa tem duas telas, e cada uma e uma div fechada com o seu
// proprio titulo, conteudo e navegacao. trocar de tela e esconder uma
// e mostrar a outra, nunca esconder pedaco solto
function trocarTela(idQueSai, idQueEntra, levarFoco) {
  document.getElementById(idQueSai).classList.add("oculto");
  document.getElementById(idQueEntra).classList.remove("oculto");

  if (levarFoco) {
    window.levarFocoPara(idQueEntra);
  }
}


// ---------------------------------------------------------------
// O CURRÍCULO
// ---------------------------------------------------------------

// peso da frequencia que a pessoa deu pra uma atividade.
// sem resposta vale 0 e vai pro fim da fila
function pesoDaAtividade(id) {
  let escolhida = frequenciaPorAtividade[id];

  if (!escolhida) {
    return 0;
  }

  let f = acharFrequencia(escolhida);
  return f ? f.peso : 0;
}


// as habilidades, da mais frequente pra menos. duas atividades podem
// cair na mesma competencia: fica a de maior peso
function habilidadesDoCurriculo() {
  let escolhidas = [];

  for (let i = 0; i < marcadas.length; i++) {
    let atividade = acharAtividade(marcadas[i].id);

    // responsabilidade nao entra aqui, tem secao propria
    if (!atividade || !atividade.area) {
      continue;
    }

    let repetida = escolhidas.find(x => x.competencia === atividade.competencia);
    let peso = pesoDaAtividade(atividade.id);

    if (repetida) {
      if (peso > repetida.peso) {
        repetida.peso = peso;
        repetida.acao = atividade.acao;
      }
      continue;
    }

    escolhidas.push({
      competencia: atividade.competencia,
      acao: atividade.acao,
      peso: peso
    });
  }

  escolhidas.sort((uma, outra) => outra.peso - uma.peso);

  // o curriculo mostra no maximo 6: lista de 20 palavras soltas
  // e erro classico, 5 ou 6 bem escolhidas bastam
  return escolhidas.slice(0, MAXIMO_DE_HABILIDADES);
}


/* as acoes do dados.js comecam minusculas porque foram escritas pra vir
   emendadas na competencia. no curriculo elas comecam frase, entao a
   primeira letra sobe */
function comMaiuscula(texto) {
  if (!texto) {
    return "";
  }

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


function responsabilidadesDoCurriculo() {
  let lista = [];

  for (let i = 0; i < marcadas.length; i++) {
    let item = acharAtividade(marcadas[i].id);

    if (item && !item.area) {
      lista.push(comMaiuscula(item.acao));
    }
  }

  return lista;
}


function escreverHabilidades(lista, habilidades) {
  lista.textContent = "";

  for (let i = 0; i < habilidades.length; i++) {
    let item = document.createElement("li");
    let forte = document.createElement("strong");

    forte.textContent = habilidades[i].competencia;
    item.appendChild(forte);
    item.appendChild(document.createTextNode(" - " + comMaiuscula(habilidades[i].acao)));

    lista.appendChild(item);
  }
}


function escreverAtividades(secao, lista, acoes) {
  lista.textContent = "";

  if (acoes.length === 0) {
    secao.classList.add("oculto");
    return;
  }

  secao.classList.remove("oculto");

  for (let i = 0; i < acoes.length; i++) {
    let item = document.createElement("li");
    item.textContent = acoes[i];
    lista.appendChild(item);
  }
}


// le o que a pessoa escolheu num <select>, em palavras
function textoDoSelect(id) {
  let campo = document.getElementById(id);

  if (!campo || campo.value === "") {
    return "";
  }

  return campo.options[campo.selectedIndex].textContent.trim();
}


function valorDoCampo(id) {
  let campo = document.getElementById(id);
  return campo ? campo.value.trim() : "";
}


function marcado(id) {
  let campo = document.getElementById(id);
  return campo ? campo.checked : false;
}


// junta os pedacos que existem, separados por ponto, pulando os vazios
function juntarPedacos(pedacos) {
  let cheios = [];

  for (let i = 0; i < pedacos.length; i++) {
    if (pedacos[i]) {
      cheios.push(pedacos[i]);
    }
  }

  return cheios.join(" · ");
}


function montarFormacao() {
  let escolaridade = textoDoSelect("escolaridade");

  if (!escolaridade) {
    return "";
  }

  let instituicao = valorDoCampo("instituicao");
  let inicio = valorDoCampo("ano-inicio");
  let fim = marcado("ainda-cursando") ? "hoje" : valorDoCampo("ano-fim");
  let periodo = "";

  if (inicio && fim) {
    periodo = inicio + " a " + fim;
  } else if (inicio) {
    periodo = "desde " + inicio;
  }

  return juntarPedacos([escolaridade, instituicao, periodo]);
}


function preencherDadosDaFolhaFinal() {
  let nome = valorDoCampo("nome-curriculo");
  document.getElementById("final-nome").textContent = nome ? nome.toUpperCase() : "";

  // declarar nome social e escolha da pessoa. so sai na folha se ela
  // marcou a caixa, e vem logo embaixo do nome
  document.getElementById("folha-nome-social")
    .classList.toggle("oculto", !marcado("nome-social"));

  document.getElementById("final-contato").textContent =
    juntarPedacos([valorDoCampo("telefone"), valorDoCampo("email")]);

  // "Araçatuba, SP" e nao "Araçatuba · São Paulo": a sigla e o padrao
  // do curriculo, e o parser le cidade e UF como dois campos
  let cidade = valorDoCampo("cidade");
  let uf = valorDoCampo("estado");
  let ondeMora = cidade;

  if (cidade && uf) {
    ondeMora = cidade + ", " + uf;
  } else if (uf) {
    ondeMora = uf;
  }

  document.getElementById("final-cidade").textContent = ondeMora;

  // a idade vem la da etapa 1. pra vaga de aprendiz ela conta, entao
  // sai na folha. se a pessoa nao respondeu, a linha nem aparece
  let idade = valorDoCampo("idade");
  let linhaIdade = document.getElementById("folha-idade");

  linhaIdade.textContent = idade ? idade + " anos" : "";

  if (idade) {
    linhaIdade.classList.remove("oculto");
  } else {
    linhaIdade.classList.add("oculto");
  }

  let formacao = montarFormacao();
  let linhaFormacao = document.getElementById("final-formacao");
  linhaFormacao.textContent = formacao;
  linhaFormacao.parentNode.classList.toggle("oculto", formacao === "");

  // a identificacao de PCD fecha o cabecalho, nunca entra no meio
  // das habilidades. e so aparece se a pessoa escolheu declarar
  let linhaPcd = document.getElementById("folha-pcd");
  let linhaAdaptacao = document.getElementById("folha-adaptacao");

  if (marcado("vaga-pcd")) {
    linhaPcd.textContent = juntarPedacos([
      "Pessoa com deficiência",
      textoDoSelect("pcd-categoria"),
      valorDoCampo("pcd-cid") ? "CID " + valorDoCampo("pcd-cid") : ""
    ]);
    linhaPcd.classList.remove("oculto");

    let recurso = valorDoCampo("pcd-adaptacao");
    linhaAdaptacao.textContent = recurso ? "Recurso para entrevista: " + recurso : "";
    linhaAdaptacao.classList.toggle("oculto", recurso === "");
  } else {
    linhaPcd.classList.add("oculto");
    linhaAdaptacao.classList.add("oculto");
  }
}


// o objetivo vem pronto em destinos[], um texto por area. quem deixou
// "pode deixar geral" nao ganha a secao: frase vazia de objetivo e das
// primeiras coisas que o recrutador descarta
function escreverObjetivo(secao, linha) {
  let escolhido = document.getElementById("destino");
  let destino = null;

  if (escolhido && escolhido.value) {
    destino = destinos.find(d => d.id === escolhido.value);
  }

  if (!destino) {
    secao.classList.add("oculto");
    linha.textContent = "";
    return;
  }

  secao.classList.remove("oculto");
  linha.textContent = destino.objetivo;
}


function gerarCurriculo() {
  let habilidades = habilidadesDoCurriculo();
  let acoes = responsabilidadesDoCurriculo();

  escreverObjetivo(
    document.getElementById("previa-objetivo"),
    document.getElementById("previa-texto-objetivo")
  );
  escreverObjetivo(
    document.getElementById("final-objetivo"),
    document.getElementById("final-texto-objetivo")
  );

  escreverHabilidades(document.getElementById("previa-habilidades"), habilidades);
  escreverHabilidades(document.getElementById("final-habilidades"), habilidades);

  escreverAtividades(
    document.getElementById("previa-atividades"),
    document.getElementById("previa-lista-atividades"),
    acoes
  );
  escreverAtividades(
    document.getElementById("final-atividades"),
    document.getElementById("final-lista-atividades"),
    acoes
  );

  let total = document.getElementById("total-competencias");

  if (total) {
    total.textContent = habilidades.length;
  }

  preencherDadosDaFolhaFinal();
  conferirAderencia();
}


// cada marcacao vale de 1 a 5. o +1 e pra atividade sem frequencia
// respondida ainda contar alguma coisa, e pra nunca dividir por zero
function forcaDaMarcacao(id) {
  return pesoDaAtividade(id) + 1;
}


// o quanto do que a pessoa marcou cai dentro da area que ela escolheu.
// responsabilidade nao tem area e serve pra qualquer vaga, entao fica
// de fora da conta: ela nao ajuda nem atrapalha nenhum destino.
//
// devolve "forte", "media" ou "fraca". o visual.js so olha o "fraca",
// que e o que faz o aviso de "combina pouco" aparecer.
function calcularAderencia(idDoDestino) {
  let destino = destinos.find(d => d.id === idDoDestino);

  if (!destino) {
    return "sem-escolha";
  }

  let total = 0;
  let dentro = 0;

  for (let i = 0; i < marcadas.length; i++) {
    let atividade = acharAtividade(marcadas[i].id);

    if (!atividade || !atividade.area) {
      continue;
    }

    let forca = forcaDaMarcacao(atividade.id);
    total = total + forca;

    if (destino.combina.indexOf(atividade.area) !== -1) {
      dentro = dentro + forca;
    }
  }

  // nao marcou nada com area: nao da pra mostrar nada de area nenhuma
  if (total === 0) {
    return "fraca";
  }

  let parte = dentro / total;

  if (parte < ADERENCIA_FRACA) {
    return "fraca";
  }

  if (parte < ADERENCIA_FORTE) {
    return "media";
  }

  return "forte";
}


/* ---- o card de curso do aviso de aderencia ----
   Monta pelo array cursos[] do dados.js, filtrando pelo destino que a
   pessoa escolheu. E uma div e nao um link porque a parceria com as
   instituicoes ainda nao existe: o nome do curso ja serve pra pessoa
   saber o que procurar, e um link que nao leva a lugar nenhum seria
   pior do que nao ter link. */
function montarCartaDeCurso(curso) {
  let carta = document.createElement("div");
  carta.className = "curso " + curso.classe;

  let selo = document.createElement("span");
  selo.className = "curso__selo";
  selo.setAttribute("aria-hidden", "true");

  let nome = document.createElement("span");
  nome.className = "curso__nome";
  nome.textContent = curso.nome;

  let detalhe = document.createElement("span");
  detalhe.className = "curso__detalhe";
  detalhe.textContent = "Curso gratuito · em breve no rezumaz";

  carta.appendChild(selo);
  carta.appendChild(nome);
  carta.appendChild(detalhe);

  return carta;
}


function montarCursosDoAviso(idDoDestino) {
  let lugar = document.getElementById("cursos-do-aviso");

  if (!lugar) {
    return;
  }

  lugar.textContent = "";

  let doDestino = cursos.filter(c => c.destino === idDoDestino);

  for (let i = 0; i < doDestino.length; i++) {
    lugar.appendChild(montarCartaDeCurso(doDestino[i]));
  }
}



// o visual.js ja recalcula quando a pessoa troca o select. isso aqui
// e pra hora de entrar na etapa, que nao dispara change nenhum
function conferirAderencia() {
  let escolhido = document.getElementById("destino");

  if (!escolhido || typeof window.avisarAderencia !== "function") {
    return;
  }

  let fraca = calcularAderencia(escolhido.value) === "fraca";

  if (fraca) {
    montarCursosDoAviso(escolhido.value);
  }

  window.avisarAderencia(fraca);
}


// se nao sobrou nem habilidade nem responsabilidade, o curriculo sai
// em branco. nesse caso nao adianta mostrar a previa
function curriculoVazio() {
  return habilidadesDoCurriculo().length === 0 &&
         responsabilidadesDoCurriculo().length === 0;
}


function abrirAvisoSemHabilidades() {
  let modal = document.getElementById("modal-sem-habilidades");

  if (!modal) {
    return;
  }

  modal.classList.remove("oculto");

  // o foco vai pro botao grande, que e a saida que a gente sugere
  let botao = document.getElementById("modal-ver-cursos");

  if (botao) {
    botao.focus();
  }
}


function fecharAvisoSemHabilidades() {
  let modal = document.getElementById("modal-sem-habilidades");

  if (modal) {
    modal.classList.add("oculto");
  }
}


/* ---- Baixar para IA ----
   Markdown, e nao PDF nem imagem, porque a ideia e colar esse arquivo
   num chat de IA pra ela ajudar a adaptar o curriculo. O # e o - dizem
   pra maquina o que e titulo e o que e item sem precisar adivinhar
   pela posicao na pagina, que e onde o texto extraido de PDF se perde. */
function linhasDoCabecalhoParaIa() {
  let linhas = [];
  let nome = valorDoCampo("nome-curriculo");

  linhas.push("# " + (nome || "Curriculo"));
  linhas.push("");

  if (marcado("nome-social")) {
    linhas.push("Nome social.");
  }

  let idade = valorDoCampo("idade");

  if (idade) {
    linhas.push("Idade: " + idade + " anos");
  }

  let contato = juntarPedacos([valorDoCampo("telefone"), valorDoCampo("email")]);

  if (contato) {
    linhas.push("Contato: " + contato);
  }

  let cidade = valorDoCampo("cidade");
  let uf = valorDoCampo("estado");

  if (cidade || uf) {
    linhas.push("Cidade: " + (cidade && uf ? cidade + ", " + uf : cidade || uf));
  }

  if (marcado("vaga-pcd")) {
    linhas.push("Pessoa com deficiencia: " + juntarPedacos([
      textoDoSelect("pcd-categoria"),
      valorDoCampo("pcd-cid") ? "CID " + valorDoCampo("pcd-cid") : ""
    ]));

    let recurso = valorDoCampo("pcd-adaptacao");

    if (recurso) {
      linhas.push("Recurso para entrevista: " + recurso);
    }
  }

  return linhas;
}


function textoDoCurriculoParaIa() {
  let linhas = linhasDoCabecalhoParaIa();

  let escolhido = document.getElementById("destino");
  let destino = escolhido && escolhido.value
    ? destinos.find(d => d.id === escolhido.value)
    : null;

  if (destino) {
    linhas.push("");
    linhas.push("## Objetivo");
    linhas.push("");
    linhas.push(destino.objetivo);
  }

  let habilidades = habilidadesDoCurriculo();

  if (habilidades.length > 0) {
    linhas.push("");
    linhas.push("## Habilidades e competencias");
    linhas.push("");

    for (let i = 0; i < habilidades.length; i++) {
      linhas.push("- **" + habilidades[i].competencia + "**: " + comMaiuscula(habilidades[i].acao));
    }
  }

  let praticas = responsabilidadesDoCurriculo();

  if (praticas.length > 0) {
    linhas.push("");
    linhas.push("## Experiencia pratica");
    linhas.push("");

    for (let i = 0; i < praticas.length; i++) {
      linhas.push("- " + praticas[i]);
    }
  }

  let formacao = montarFormacao();

  if (formacao) {
    linhas.push("");
    linhas.push("## Formacao");
    linhas.push("");
    linhas.push(formacao);
  }

  linhas.push("");
  linhas.push("---");
  linhas.push("");
  linhas.push("Curriculo montado no rezumaz a partir de atividades do dia a dia.");

  return linhas.join("\n");
}


/* o navegador nao deixa gravar arquivo direto. o caminho e montar o
   conteudo na memoria, criar um link invisivel apontando pra ele,
   clicar nesse link por codigo e jogar fora em seguida */
function baixarArquivo(nomeDoArquivo, conteudo) {
  let bolha = new Blob([conteudo], { type: "text/markdown;charset=utf-8" });
  let endereco = URL.createObjectURL(bolha);
  let link = document.createElement("a");

  link.href = endereco;
  link.download = nomeDoArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(endereco);
}


function nomeDoArquivoDeCurriculo() {
  let nome = valorDoCampo("nome-curriculo");

  if (!nome) {
    return "curriculo-rezumaz.md";
  }

  let limpo = nome.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return "curriculo-" + (limpo || "rezumaz") + ".md";
}


function baixarParaIa() {
  baixarArquivo(nomeDoArquivoDeCurriculo(), textoDoCurriculoParaIa());
}



function mostrarTelaDeAtividades() {
  trocarTela("tela-frequencia", "tela-cartas", false);
}


// as areas que acenderam, cada uma com as atividades que a pessoa
// marcou nela. a ordem e da mais quente pra mais fria
function agruparMarcadasPorArea() {
  let grupos = [];

  let ordem = areasPorCalor();

  for (let i = 0; i < ordem.length; i++) {
    let daArea = [];

    for (let j = 0; j < marcadas.length; j++) {
      if (marcadas[j].area === ordem[i]) {
        daArea.push(acharAtividade(marcadas[j].id));
      }
    }

    if (daArea.length > 0) {
      grupos.push({ area: ordem[i], atividades: daArea });
    }
  }

  // as responsabilidades nao tem area, entao viram um grupo so
  let semArea = [];

  for (let i = 0; i < marcadas.length; i++) {
    if (!marcadas[i].area) {
      semArea.push(acharAtividade(marcadas[i].id));
    }
  }

  if (semArea.length > 0) {
    grupos.push({ area: "responsabilidades", atividades: semArea });
  }

  return grupos;
}


let gruposDeFrequencia = [];
let grupoDeFrequenciaAtual = 0;
let frequenciaPorAtividade = {};
let pilulasSelecionadas = [];


function classeDaArea(area) {
  let achada = areas.find(a => a.id === area);

  if (achada) {
    return achada.classe;
  }

  return "area-responsabilidades";
}


function acharFrequencia(id) {
  return frequencias.find(f => f.id === id);
}


function montarFrequencia() {
  gruposDeFrequencia = agruparMarcadasPorArea();
  grupoDeFrequenciaAtual = 0;
  frequenciaPorAtividade = {};
  pilulasSelecionadas = [];

  let vazio = document.getElementById("frequencia-vazia");
  let ajuda = document.getElementById("ajuda-frequencia");

  if (gruposDeFrequencia.length === 0) {
    vazio.classList.remove("oculto");
    ajuda.classList.add("oculto");
    document.getElementById("pilulas-frequencia").textContent = "";
    document.getElementById("opcoes-frequencia").textContent = "";
    document.getElementById("botao-frequencia").textContent = "Continuar";
    return;
  }

  vazio.classList.add("oculto");
  ajuda.classList.remove("oculto");
  mostrarGrupoDeFrequencia(0);
}


// uma area por tela, com todas as pilulas que a pessoa marcou nela.
// a area nunca aparece escrita: so as palavras dela
function mostrarGrupoDeFrequencia(indice) {
  grupoDeFrequenciaAtual = indice;
  pilulasSelecionadas = [];
  desenharGrupo();
}


function desenharGrupo() {
  let grupo = gruposDeFrequencia[grupoDeFrequenciaAtual];
  let classe = classeDaArea(grupo.area);

  let lista = document.getElementById("pilulas-frequencia");
  lista.textContent = "";
  lista.className = "lista-pilulas " + classe;

  for (let i = 0; i < grupo.atividades.length; i++) {
    let atividade = grupo.atividades[i];
    let item = document.createElement("li");
    let pilula = document.createElement("button");

    pilula.type = "button";
    pilula.className = "pilula pilula--clicavel";
    pilula.textContent = atividade.texto;

    let escolhida = frequenciaPorAtividade[atividade.id];

    if (escolhida) {
      let f = acharFrequencia(escolhida);
      pilula.classList.add("pilula--tom-" + f.peso);

      /* a regua no pe da pilula e desenhada pelo CSS. serve pra
         frequencia nao depender so da cor, que some no alto contraste */
      pilula.classList.add("pilula--respondida");
      pilula.setAttribute("aria-label", atividade.texto + ". " + f.texto);
    } else {
      pilula.classList.add("pilula--sem-resposta");
      pilula.setAttribute("aria-label", atividade.texto + ". Sem frequência ainda.");
    }

    if (pilulasSelecionadas.indexOf(atividade.id) !== -1) {
      pilula.classList.add("pilula--selecionada");
      pilula.setAttribute("aria-pressed", "true");
    } else {
      pilula.setAttribute("aria-pressed", "false");
    }

    pilula.addEventListener("click", () => alternarPilula(atividade.id));

    item.appendChild(pilula);
    lista.appendChild(item);
  }

  let caixa = document.getElementById("opcoes-frequencia");
  caixa.textContent = "";
  caixa.className = "pilha pilha--curta " + classe;

  for (let i = 0; i < frequencias.length; i++) {
    let f = frequencias[i];
    let botao = document.createElement("button");

    botao.type = "button";
    botao.className = "opcao-frequencia opcao-frequencia--tom-" + f.peso;

    let titulo = document.createElement("span");
    titulo.className = "opcao-frequencia__texto";
    titulo.textContent = f.texto;

    let dica = document.createElement("span");
    dica.className = "opcao-frequencia__dica";
    dica.textContent = f.dica;

    botao.appendChild(titulo);
    botao.appendChild(dica);
    botao.addEventListener("click", () => pintarSelecionadas(f.id));

    caixa.appendChild(botao);
  }

  let botaoSeguir = document.getElementById("botao-frequencia");
  let ultimo = grupoDeFrequenciaAtual >= gruposDeFrequencia.length - 1;
  botaoSeguir.textContent = ultimo ? "Continuar" : "Próximo";

  document.getElementById("erro-frequencia").classList.add("esconder");
}


function alternarPilula(id) {
  let posicao = pilulasSelecionadas.indexOf(id);

  if (posicao === -1) {
    pilulasSelecionadas.push(id);
  } else {
    pilulasSelecionadas.splice(posicao, 1);
  }

  desenharGrupo();
}


// pinta as pilulas escolhidas com o tom da frequencia e limpa a
// selecao, pra pessoa poder responder o resto da area em outra leva
function pintarSelecionadas(idDaFrequencia) {
  let erro = document.getElementById("erro-frequencia");

  // clicou na frequencia sem escolher atividade nenhuma
  if (pilulasSelecionadas.length === 0) {
    erro.textContent = "Toque primeiro nas atividades que você fazia nessa frequência.";
    erro.classList.remove("esconder");
    return;
  }

  for (let i = 0; i < pilulasSelecionadas.length; i++) {
    frequenciaPorAtividade[pilulasSelecionadas[i]] = idDaFrequencia;
  }

  pilulasSelecionadas = [];
  desenharGrupo();
}


function faltaPintarNoGrupo() {
  let grupo = gruposDeFrequencia[grupoDeFrequenciaAtual];

  if (!grupo) {
    return 0;
  }

  let faltam = 0;

  for (let i = 0; i < grupo.atividades.length; i++) {
    if (!frequenciaPorAtividade[grupo.atividades[i].id]) {
      faltam++;
    }
  }

  return faltam;
}


function seguirDaFrequencia() {
  if (gruposDeFrequencia.length === 0) {
    mostrarEtapa(3, true);
    return;
  }

  let faltam = faltaPintarNoGrupo();
  let erro = document.getElementById("erro-frequencia");

  if (faltam > 0) {
    if (faltam === 1) {
      erro.textContent = "Falta dizer com que frequência você fazia 1 delas.";
    } else {
      erro.textContent = "Falta dizer com que frequência você fazia " + faltam + " delas.";
    }
    erro.classList.remove("esconder");
    return;
  }

  if (grupoDeFrequenciaAtual < gruposDeFrequencia.length - 1) {
    mostrarGrupoDeFrequencia(grupoDeFrequenciaAtual + 1);
    window.scrollTo(0, 0);
    window.levarFocoPara("tela-frequencia");
    return;
  }

  mostrarEtapa(3, true);
}


function lerFrequencias() {
  return frequenciaPorAtividade;
}


function mostrarTelaDeFrequencia() {
  montarFrequencia();
  trocarTela("tela-cartas", "tela-frequencia", true);
}


// esconde as outras etapas. usa .oculto e nao .esconder, porque a
// .esconder some da vista mas o leitor de tela continua lendo
function mostrarEtapa(numero, levarFoco) {
  // trocou de etapa, o aviso nao faz mais sentido na tela
  fecharAvisoSemHabilidades();

  let avisoPendente = false;

  for (let i = 1; i <= 4; i++) {
    let secao = document.getElementById("etapa-" + i);

    if (i === numero) {
      secao.classList.remove("oculto");
    } else {
      secao.classList.add("oculto");
    }
  }

  // entrando numa etapa, ela sempre abre na primeira das duas telas
  if (numero === 2) {
    mostrarTelaDeAtividades();
  }

  if (numero === 3) {
    gerarCurriculo();
    trocarTela("tela-dados", "tela-previa", false);

    avisoPendente = curriculoVazio();
  }

  if (numero === 4) {
    gerarCurriculo();
  }

  window.scrollTo(0, 0);

  // no carregamento da pagina nao leva foco, senao o titulo abre
  // com cara de selecionado sem ninguem ter clicado em nada
  if (levarFoco) {
    window.levarFocoPara("etapa-" + numero);
  }

  // por ultimo, senao o foco do titulo da etapa passa na frente
  if (avisoPendente) {
    abrirAvisoSemHabilidades();
  }
}


function ligarUmLink(link) {
  let destino = link.getAttribute("href");

  // esses dois tem tratamento proprio no iniciar()
  if (!destino || destino[0] !== "#") {
    return;
  }

  if (link.id === "botao-avancar" || link.id === "botao-frequencia") {
    return;
  }

  // o Voltar da tela de cartas anda uma fase pra tras. so sai da
  // etapa 2 quando nao existe fase anterior
  if (destino === "#etapa-1") {
    link.addEventListener("click", evento => {
      evento.preventDefault();

      if (!voltarFase()) {
        mostrarEtapa(1, true);
      }
    });
    return;
  }

  for (let numero = 2; numero <= 4; numero++) {
    if (destino === "#etapa-" + numero) {
      link.addEventListener("click", evento => {
        evento.preventDefault();

        // a validacao do js/formulario.js so olha campo que esta na tela.
        // se a etapa trocar antes dela rodar, ela aprova tudo sem ver nada,
        // entao quem sai da etapa 1 pergunta pra ela primeiro
        if (numero === 2 && typeof window.validarEtapaUm === "function") {
          if (window.validarEtapaUm() === false) {
            return;
          }
        }

        mostrarEtapa(numero, true);
      });
      return;
    }
  }

  // href="#" sao os lugares que ainda nao existem: os cursos e o
  // botao do aviso. sem isso a pagina pula pro topo a cada clique
  if (destino === "#") {
    link.addEventListener("click", evento => evento.preventDefault());
    return;
  }

  if (destino === "#tela-atividades") {
    link.addEventListener("click", evento => {
      evento.preventDefault();
      mostrarTelaDeAtividades();
      window.levarFocoPara("tela-cartas");
    });
    return;
  }

  // "Adicionar meus dados", na etapa 3
  // "Adicionar meus dados" na etapa 3 e "Corrigir meus dados" na etapa 4
  // levam pro mesmo lugar. Vindo da etapa 4 precisa voltar pra etapa 3
  // antes, senao o clique nao muda nada na tela.
  if (destino === "#tela-dados") {
    link.addEventListener("click", evento => {
      evento.preventDefault();
      mostrarEtapa(3, false);
      trocarTela("tela-previa", "tela-dados", true);
    });
  }
}


function iniciar() {
  let tela = document.getElementById("tela-atividades");
  let botao = document.getElementById("botao-avancar");

  if (!tela || !botao) {
    return;
  }

  // a primeira fase e montada aqui, por cima das 6 cartas do HTML
  let primeira = montarProximaFase();
  fases.push(primeira);

  tela.addEventListener("change", anotarMarcacao);

  // o botao e um <a>, sem o preventDefault o navegador pula a ancora
  // e parece que trocou de etapa
  botao.addEventListener("click", evento => {
    evento.preventDefault();

    if (botao.dataset.estado === "ultima") {
      mostrarTelaDeFrequencia();
    } else {
      avancarFase();
    }
  });

  // "Gerar meu curriculo" e um <button type="submit">. Sem o
  // preventDefault o navegador envia o formulario, recarrega a pagina
  // e a pessoa cai na etapa 1 com tudo perdido.
  // A validacao fica em js/formulario.js: se ela existir e disser que
  // nao, o fluxo para aqui.
  let formulario = document.getElementById("formulario-dados");

  if (formulario) {
    formulario.addEventListener("submit", evento => {
      evento.preventDefault();

      // so barra se a validacao disser false na cara. a funcao vazia
      // de js/formulario.js devolve undefined, e undefined nao e "nao"
      if (typeof window.validarFormulario === "function") {
        if (window.validarFormulario(formulario) === false) {
          return;
        }
      }

      mostrarEtapa(4, true);
    });
  }

  let botaoFrequencia = document.getElementById("botao-frequencia");

  botaoFrequencia.addEventListener("click", evento => {
    evento.preventDefault();
    seguirDaFrequencia();
  });

  let voltarDoAviso = document.getElementById("modal-voltar");

  if (voltarDoAviso) {
    voltarDoAviso.addEventListener("click", () => mostrarEtapa(2, true));
  }

  // o visual.js ja cuida de mostrar e esconder o aviso de aderencia.
  // aqui so enche ele com o curso da area, que depende do dados.js
  let destinoEscolhido = document.getElementById("destino");

  if (destinoEscolhido) {
    destinoEscolhido.addEventListener("change", evento =>
      montarCursosDoAviso(evento.currentTarget.value));
  }

  let botaoParaIa = document.getElementById("baixar-para-ia");

  if (botaoParaIa) {
    botaoParaIa.addEventListener("click", baixarParaIa);
  }

  let botaoBaixar = document.getElementById("baixar-curriculo");

  if (botaoBaixar) {
    botaoBaixar.addEventListener("click", () => window.print());
  }

  let links = document.querySelectorAll("a");

  for (let i = 0; i < links.length; i++) {
    ligarUmLink(links[i]);
  }

  mostrarEtapa(1, false);
  mostrarFase(0);
}


function lerMarcadas() {
  return marcadas;
}


iniciar();
