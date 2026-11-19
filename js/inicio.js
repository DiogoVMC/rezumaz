/* ==========================================================================
   js/inicio.js — só a página inicial usa este arquivo.

   Faz uma coisa só: as três cartas da seção "A proposta"
   escolhem qual texto aparece no painel logo abaixo delas, e a escolhida
   fica com a mesma cara da carta marcada lá no questionário: fundo mais
   forte e o tique no quadradinho.

   No HTML elas nascem abertas de propósito. Se este script não carregar,
   a página continua inteira e legível; é ele que fecha tudo ao entrar.
   ========================================================================== */

function corpoDaCarta(botao) {
  return document.getElementById(botao.getAttribute("aria-controls"));
}


/* o botão está dentro do h3, que está dentro da carta */
function cartaDoBotao(botao) {
  return botao.parentNode.parentNode;
}


function fecharCarta(botao) {
  let corpo = corpoDaCarta(botao);

  if (!corpo) {
    return;
  }

  botao.setAttribute("aria-expanded", "false");
  corpo.classList.add("oculto");
  cartaDoBotao(botao).classList.remove("carta-texto--aberta");
}


function abrirCarta(botao) {
  let corpo = corpoDaCarta(botao);

  if (!corpo) {
    return;
  }

  botao.setAttribute("aria-expanded", "true");
  corpo.classList.remove("oculto");
  cartaDoBotao(botao).classList.add("carta-texto--aberta");
}


/* uma carta de cada vez: o painel mostra um texto so, entao abrir uma
   fecha as outras duas. clicar na que ja esta aberta nao fecha nada,
   senao o painel ficaria vazio */
function escolherCarta(botao) {
  let botoes = document.querySelectorAll(".carta-texto__botao");

  for (let i = 0; i < botoes.length; i++) {
    if (botoes[i] === botao) {
      abrirCarta(botoes[i]);
    } else {
      fecharCarta(botoes[i]);
    }
  }
}


function ligarCartasDeTexto() {
  let botoes = document.querySelectorAll(".carta-texto__botao");

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", evento => escolherCarta(evento.currentTarget));
  }

  // comeca com a primeira escolhida, pra que o painel nunca apareca vazio
  if (botoes.length > 0) {
    escolherCarta(botoes[0]);
  }
}


ligarCartasDeTexto();
