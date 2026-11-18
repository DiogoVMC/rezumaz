/* ==========================================================================
   rezumaz · comportamento visual
   SÓ interface: mostrar, esconder, trocar classe e trocar texto de botão.
   Nada aqui calcula currículo, afunila área ou valida formulário. isso é
   de js/simulacao.js e js/formulario.js

   Regras seguidas:
   - nenhum elemento.style: só classList
   - nome de função e variável em português
   - se este arquivo não carregar, a página continua utilizável: tudo que é
     escondido aqui começa VISÍVEL no HTML e some na carga
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- utilidades ------------------------------------------------ */

  /* .oculto tira o elemento da tela E da leitura. É sempre essa a classe
     usada aqui: campo que ainda não deve existir não pode ser anunciado. */

  function esconder(elemento) {
    if (elemento) elemento.classList.add("oculto");
  }

  function mostrar(elemento) {
    if (elemento) elemento.classList.remove("oculto");
  }

  function alternar(elemento, deveAparecer) {
    if (!elemento) return;
    elemento.classList.toggle("oculto", !deveAparecer);
  }

  /* ---------- 1. avisos que dependem de uma caixa marcada ---------- */

  const paresDeAviso = [
    ["nome-social", "aviso-social"],
    ["vaga-pcd", "aviso-pcd"],
    ["telefone-recado", "bloco-recado"]
  ];

  function ligarAvisos() {
    paresDeAviso.forEach(function (par) {
      const caixa = document.getElementById(par[0]);
      const aviso = document.getElementById(par[1]);
      if (!caixa || !aviso) return;

      alternar(aviso, caixa.checked);

      caixa.addEventListener("change", function () {
        alternar(aviso, caixa.checked);
      });
    });
  }

  /* ------- 2. instituição e período aparecem com a escolaridade ------- */

  function ligarFormacao() {
    const escolha = document.getElementById("escolaridade");
    const bloco = document.getElementById("bloco-formacao");
    if (!escolha || !bloco) return;

    alternar(bloco, escolha.value !== "");

    escolha.addEventListener("change", function () {
      alternar(bloco, escolha.value !== "");
    });
  }

  /* ---------- 3. as cartas giram de cor a cada tela nova ----------------- */

  const TOTAL_DE_CORES = 8;

  function corAtual(carta) {
    for (let numero = 1; numero <= TOTAL_DE_CORES; numero += 1) {
      if (carta.classList.contains("cor-" + numero)) return numero;
    }
    return 0;
  }

  function girarCoresDasCartas() {
    const tela = document.getElementById("tela-atividades");
    if (!tela) return;

    tela.querySelectorAll(".opcao").forEach(function (carta) {
      const atual = corAtual(carta);
      if (!atual) return;
      const proxima = (atual % TOTAL_DE_CORES) + 1;
      carta.classList.remove("cor-" + atual);
      carta.classList.add("cor-" + proxima);
    });
  }

  /* ---------- 4. o texto do botão muda conforme o estado ----------------- */
  /* 
       marcou algo  -> Ver mais atividades
       não marcou   -> Ver outras atividades + ajuda abaixo
       última tela  -> Continuar  (quem decide isso é js/simulacao.js, que
                       vai chamar definirBotaoComo("ultima")) */

  function quantasMarcadas() {
    const tela = document.getElementById("tela-atividades");
    if (!tela) return 0;
    return tela.querySelectorAll(".opcao__caixa:checked").length;
  }

  function atualizarBotao() {
    const botao = document.getElementById("botao-avancar");
    const ajuda = document.getElementById("ajuda-vazio");
    if (!botao) return;

    if (botao.dataset.estado === "ultima") {
      botao.textContent = "Continuar";
      esconder(ajuda);
      return;
    }

    if (quantasMarcadas() > 0) {
      botao.textContent = "Ver mais atividades";
      esconder(ajuda);
    } else {
      botao.textContent = "Ver outras atividades";
      mostrar(ajuda);
    }
  }

  /* chamada por js/simulacao.js quando a etapa 2 chegar na última tela */
  window.definirBotaoComo = function (estado) {
    const botao = document.getElementById("botao-avancar");
    if (!botao) return;
    botao.dataset.estado = estado;
    atualizarBotao();
  };

  function ligarBotaoDeAtividades() {
    const tela = document.getElementById("tela-atividades");
    const botao = document.getElementById("botao-avancar");
    if (!tela || !botao) return;

    atualizarBotao();

    tela.addEventListener("change", atualizarBotao);

    botao.addEventListener("click", function () {
      if (botao.dataset.estado === "ultima") return;

      /* simulacao troca o conteúdo das 6 cartas aqui.
         tela se comporta como uma tela nova:
         as cores giram e as marcações zeram. */
      girarCoresDasCartas();
      tela.querySelectorAll(".opcao__caixa").forEach(function (caixa) {
        caixa.checked = false;
      });
      atualizarBotao();
    });
  }

  /* ---------- 5. aviso de aprendiz, a partir da idade -------------------- */

  function ligarAvisoDeAprendiz() {
    const idade = document.getElementById("idade");
    const aviso = document.getElementById("aviso-aprendiz");
    if (!idade || !aviso) return;

    function conferir() {
      const anos = Number(idade.value);
      alternar(aviso, anos >= 14 && anos < 24);
    }

    conferir();
    idade.addEventListener("input", conferir);
  }


  /* ---------- 6. quem não tem e-mail ------------------------------------ */

  function ligarSemEmail() {
    const caixa = document.getElementById("sem-email");
    const campo = document.getElementById("campo-email");
    const entrada = document.getElementById("email");
    if (!caixa || !campo || !entrada) return;

    function aplicar() {
      alternar(campo, !caixa.checked);
      entrada.required = !caixa.checked;
      if (caixa.checked) entrada.value = "";
    }

    aplicar();
    caixa.addEventListener("change", aplicar);
  }

  /* ---------- 7. exemplo do telefone de recado -------------------------- */

  function ligarExemploDeRecado() {
    const tipo = document.getElementById("recado-tipo");
    const quem = document.getElementById("recado-nome");
    const local = document.getElementById("recado-local");
    const fone = document.getElementById("telefone");
    const nome = document.getElementById("nome-curriculo");
    const exemplo = document.getElementById("exemplo-recado");
    if (!tipo || !quem || !exemplo) return;

    function montar() {
      const numero = (fone && fone.value.trim()) || "(18) 99999-9999";
      const dono = (nome && nome.value.trim().split(" ")[0]) || "Ana";
      const referencia = quem.value.trim();
      let onde;

      if (tipo.value === "instituicao") {
        const casa = (local && local.value.trim()) || "Centro POP";
        onde = "Recado no " + casa;
        if (referencia) onde += ", falar com " + referencia;
      } else {
        onde = "Recado com " + (referencia || "Maria");
      }

      exemplo.textContent = "";
      exemplo.append("No currículo vai sair assim: ");
      const forte = document.createElement("strong");
      forte.textContent = numero + " (" + onde + " - procurar por " + dono + ")";
      exemplo.append(forte);
    }

    montar();
    [tipo, quem, local, fone, nome].forEach(function (campo) {
      if (campo) campo.addEventListener("input", montar);
    });
    tipo.addEventListener("change", montar);
  }

  /* ---------- 8. ajuste de fonte e alto contraste ----------------------- */

  const ESCALAS = ["", "fonte-media", "fonte-grande"];
  let escalaAtual = 0;

  const CHAVE_ESCALA = "rezumaz-escala";
  const CHAVE_CONTRASTE = "rezumaz-contraste";

  function guardar(chave, valor) {
    try {
      window.localStorage.setItem(chave, valor);
    } catch (erro) {
    }
  }

  function lembrar(chave) {
    try {
      return window.localStorage.getItem(chave);
    } catch (erro) {
      return null;
    }
  }

  function aplicarEscala() {
    const raiz = document.documentElement;
    ESCALAS.forEach(function (classe) {
      if (classe) raiz.classList.remove(classe);
    });
    if (ESCALAS[escalaAtual]) raiz.classList.add(ESCALAS[escalaAtual]);

    const menor = document.getElementById("fonte-menor");
    const maior = document.getElementById("fonte-maior");
    if (menor) menor.disabled = escalaAtual === 0;
    if (maior) maior.disabled = escalaAtual === ESCALAS.length - 1;
  }

  function ligarControlesDeAcesso() {
    const menor = document.getElementById("fonte-menor");
    const maior = document.getElementById("fonte-maior");
    const contraste = document.getElementById("alto-contraste");

    if (menor) {
      menor.addEventListener("click", function () {
        if (escalaAtual > 0) escalaAtual -= 1;
        aplicarEscala();
        guardar(CHAVE_ESCALA, String(escalaAtual));
      });
    }

    if (maior) {
      maior.addEventListener("click", function () {
        if (escalaAtual < ESCALAS.length - 1) escalaAtual += 1;
        aplicarEscala();
        guardar(CHAVE_ESCALA, String(escalaAtual));
      });
    }

    if (contraste) {
      contraste.addEventListener("click", function () {
        const ligado = document.documentElement.classList.toggle("alto-contraste");
        contraste.setAttribute("aria-pressed", ligado ? "true" : "false");
        guardar(CHAVE_CONTRASTE, ligado ? "1" : "0");
      });
    }

    const escalaGuardada = Number(lembrar(CHAVE_ESCALA));
    if (escalaGuardada >= 0 && escalaGuardada < ESCALAS.length) {
      escalaAtual = escalaGuardada;
    }

    if (lembrar(CHAVE_CONTRASTE) === "1") {
      document.documentElement.classList.add("alto-contraste");
      if (contraste) contraste.setAttribute("aria-pressed", "true");
    }

    aplicarEscala();
  }

  /* ---------- 9. foco ao trocar de etapa -------------------------------- */
  
  window.levarFocoPara = function (idDaSecao) {
    const secao = document.getElementById(idDaSecao);
    if (!secao) return;
    const titulo = secao.querySelector("h1, h2, h3");
    if (!titulo) return;
    titulo.setAttribute("tabindex", "-1");
    titulo.focus();
  };


  /* ---------- 10. aderência da área escolhida --------------------------- */
  /* aqui fica só o mostrar e esconder, e uma checagem
     provisória por quantidade de marcações */

  window.avisarAderencia = function (ehFraca) {
    alternar(document.getElementById("aviso-aderencia"), ehFraca);
  };

  function ligarAderencia() {
    const destino = document.getElementById("destino");
    if (!destino) return;

    destino.addEventListener("change", function () {
      if (typeof window.calcularAderencia === "function") {
        window.avisarAderencia(window.calcularAderencia(destino.value) === "fraca");
        return;
      }
      /* sem resposta nenhuma marcada, qualquer área escolhida tem pouca coisa para mostrar */
      const marcadas = document.querySelectorAll(".opcao__caixa:checked").length;
      window.avisarAderencia(destino.value !== "" && marcadas === 0);
    });
  }

  /* ---------- 11. anos de estudo ---------------------------------------- */

  const ANOS_PARA_TRAS = 50;
  /* a previsão de conclusão precisa de anos no futuro (faculdade dura até 6 anos) */
  const ANOS_PARA_FRENTE_PREVISAO = 6;

  function encherAnos(select, vazio, anosParaFrente) {
    if (!select || select.options.length) return;
    const agora = new Date().getFullYear();
    const primeiro = document.createElement("option");
    primeiro.value = "";
    primeiro.textContent = vazio;
    select.append(primeiro);
    for (let ano = agora + anosParaFrente; ano >= agora - ANOS_PARA_TRAS; ano -= 1) {
      const opcao = document.createElement("option");
      opcao.value = String(ano);
      opcao.textContent = String(ano);
      select.append(opcao);
    }
  }

  function ligarAnos() {
    const inicio = document.getElementById("ano-inicio");
    const fim = document.getElementById("ano-fim");
    const cursando = document.getElementById("ainda-cursando");
    if (!inicio || !fim) return;

    encherAnos(inicio, "Ano", 0);
    encherAnos(fim, "Ano", ANOS_PARA_FRENTE_PREVISAO);

    if (!cursando) return;

    function aplicar() {
      /* o select continua clicável: marcado, ele vira a previsão de conclusão.
         Ao trocar, limpa o ano, porque ele muda de sentido. */
      fim.value = "";
      const rotulo = document.querySelector('label[for="ano-fim"]');
      if (rotulo) rotulo.textContent = cursando.checked ? "Previsão" : "Terminei em";
    }

    aplicar();
    cursando.addEventListener("change", aplicar);
  }

  /* ---------- 11b. o telefone se formata sozinho ------------------------ */
  /* (18) 99999-9999 e (18) 9999-9999. Só dígitos entram, e o formato
     aparece enquanto a pessoa digita, sem precisar ensinar o padrão. */

  function formatarTelefone(bruto) {
    const numeros = bruto.replace(/\D/g, "").slice(0, 11);
    if (numeros.length === 0) return "";
    if (numeros.length <= 2) return "(" + numeros;

    const ddd = numeros.slice(0, 2);
    const resto = numeros.slice(2);

    /* O hifen so entra com 10 digitos no total. Antes disso nao da pra
       saber se e fixo (8) ou celular (9, com o 9 na frente), e colocar
       o hifen cedo joga o numero pro lugar errado enquanto digita. */
    if (numeros.length < 10) return "(" + ddd + ") " + resto;

    const corte = resto.length > 8 ? 5 : 4;
    return "(" + ddd + ") " + resto.slice(0, corte) + "-" + resto.slice(corte);
  }

  function ligarMascaraDeTelefone() {
    const campo = document.getElementById("telefone");
    if (!campo) return;

    campo.setAttribute("inputmode", "numeric");
    campo.setAttribute("maxlength", "15");

    campo.addEventListener("input", function () {
      campo.value = formatarTelefone(campo.value);
    });
  }


  /* ---------- 12. telefone de recado: pessoa ou instituição ------------- */

  function ligarTipoDeRecado() {
    const tipo = document.getElementById("recado-tipo");
    const campoLocal = document.getElementById("campo-recado-local");
    const rotuloQuem = document.querySelector('label[for="recado-nome"]');
    if (!tipo || !campoLocal) return;

    function aplicar() {
      const ehInstituicao = tipo.value === "instituicao";
      alternar(campoLocal, ehInstituicao);
      if (rotuloQuem) {
        rotuloQuem.textContent = ehInstituicao
          ? "Setor ou pessoa de referência"
          : "Nome de quem atende";
      }
    }

    aplicar();
    tipo.addEventListener("change", aplicar);
  }


  document.addEventListener("DOMContentLoaded", function () {
    ligarAvisos();
    ligarFormacao();
    ligarBotaoDeAtividades();
    ligarAvisoDeAprendiz();
    ligarSemEmail();
    ligarExemploDeRecado();
    ligarControlesDeAcesso();
    ligarAderencia();
    ligarAnos();
    ligarMascaraDeTelefone();
    ligarTipoDeRecado();
  });
})();
