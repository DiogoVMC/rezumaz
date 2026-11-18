/* ==========================================================================
   rezumaz · validação dos formulários

   Campos obrigatórios validados em JS, com mensagem de erro e de sucesso
   NA PÁGINA, sem alert().

   Formulário da etapa 1 .... #formulario-inicio
     #tratamento      + #erro-tratamento   (só o primeiro nome)
     #idade           + #erro-idade

   Formulário final ......... #formulario-dados   (dentro da etapa 3)
     #nome-curriculo  + #erro-nome         (atenção: o span NÃO é erro-nome-curriculo)
     #telefone        + #erro-telefone
     #email           + #erro-email        (pulado se marcar "Não tenho e-mail")
     #cidade          + #erro-cidade
     #estado          + #erro-estado
     #escolaridade    + #erro-escolaridade

   Campos que só aparecem depois de a pessoa abrir o bloco deles
     #recado-local    + #erro-recado-local     (telefone de instituição)
     #instituicao     + #erro-instituicao      (depois de escolher a escolaridade)
     #ano-inicio      + #erro-ano-inicio
     #ano-fim         + #erro-ano-fim          (opcional se marcar "Ainda estou cursando")
     #pcd-categoria   + #erro-pcd-categoria    (só com a caixa de PCD marcada)
     #pcd-cid         + #erro-pcd-cid          (opcional, mas o formato é conferido)

   Continuam sem validação, porque são mesmo opcionais:
     #nome-social, #telefone-recado, #recado-tipo, #recado-nome,
     #sem-email, #ainda-cursando, #destino, #vaga-pcd, #pcd-adaptacao

   Recados gerais ........... #recado-erro  e  #recado-certo

   Para esconder e mostrar usamos a classe .oculto (a mesma do visual.js).
   A classe .campo--invalido vai na div.campo, porque o CSS é
   ".campo--invalido .campo__entrada".
   ========================================================================== */


/* --------------------------------------------------------------------------
   REGRAS
   Cada regra recebe o valor já sem espaços nas pontas e devolve a mensagem
   de erro, ou "" se estiver tudo certo. Para validar um campo novo, é só
   acrescentar uma linha aqui com o id dele.
   -------------------------------------------------------------------------- */

const regrasDosCampos = {

  "tratamento": function (valor) {
    if (valor === "") return "Conta pra gente como você quer ser chamado.";
    return "";
  },

  "idade": function (valor) {
    if (valor === "") return "Coloque a sua idade.";
    const anos = Number(valor);
    if (!Number.isInteger(anos)) return "Escreva a idade só com números, sem vírgula.";
    if (anos < 14) return "A partir de 14 anos já dá pra trabalhar como aprendiz. Antes disso, ainda não.";
    if (anos > 99) return "Confere a idade? Ela precisa ficar entre 14 e 99 anos.";
    return "";
  },

  "nome-curriculo": function (valor) {
    if (valor === "") return "Escreva o nome que vai aparecer no currículo.";
    const palavras = valor.split(/\s+/);
    if (palavras.length < 2) return "O nome precisa ser completo, com nome e sobrenome, igual do documento ou o seu nome social.";
    return "";
  },

  "telefone": function (valor) {
    if (valor === "") return "Coloque um telefone pra empresa conseguir te chamar.";
    const digitos = valor.replace(/\D/g, "");
    if (digitos.length < 10) return "Faltam números. Coloque o DDD junto, por exemplo (18) 99999-9999.";
    if (digitos.length > 11) return "Tem número sobrando. O telefone com DDD tem 10 ou 11 dígitos.";
    return "";
  },

  "email": function (valor) {
    if (valor === "") return "Coloque o seu e-mail ou marque a opção \"Não tenho e-mail\".";
    const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoDeEmail.test(valor)) return "Esse e-mail parece incompleto. Ele precisa ter @ e um ponto depois, como ana@email.com.";
    return "";
  },

  "cidade": function (valor) {
    if (valor === "") return "Coloque a cidade. Muitas vagas são filtradas por ela.";
    return "";
  },

  "estado": function (valor) {
    if (valor === "") return "Escolha o estado.";
    return "";
  },

  "escolaridade": function (valor) {
    if (valor === "") return "Escolha até onde você estudou. Vale também se ainda estiver estudando.";
    return "";
  },

  /* Daqui pra baixo sao campos que so existem quando a pessoa abre o
     bloco deles. Nao precisam checar se o bloco esta aberto: campo
     dentro de .oculto nem chega a ser validado. */

  "recado-local": function (valor) {
    if (valor === "") return "Escreva o nome do lugar que atende o recado.";
    return "";
  },

  "instituicao": function (valor) {
    if (valor === "") return "Escreva onde você estudou. Pode ser a escola, o EJA ou o curso.";
    return "";
  },

  "ano-inicio": function (valor) {
    if (valor === "") return "Escolha o ano em que você começou.";
    return "";
  },

  /* O ano de termino muda de sentido com a caixa "Ainda estou cursando":
     marcada, ele vira previsao de conclusao. A mensagem acompanha. */
  "ano-fim": function (valor) {
    const cursando = document.getElementById("ainda-cursando");
    const aindaCursa = cursando ? cursando.checked : false;

    /* quem ainda estuda pode nao saber quando termina, principalmente
       no EJA e no supletivo. a previsao fica opcional. so cobra o ano
       de quem ja terminou */
    if (valor === "") {
      return aindaCursa ? "" : "Escolha o ano em que você terminou.";
    }

    const inicio = document.getElementById("ano-inicio");
    const comecou = inicio ? Number(inicio.value) : 0;
    const terminou = Number(valor);

    if (comecou && terminou < comecou) {
      return "O ano de término não pode ser antes do ano de início.";
    }

    if (aindaCursa && terminou < new Date().getFullYear()) {
      return "A previsão precisa ser deste ano pra frente, porque você ainda está cursando.";
    }

    return "";
  },

  "pcd-categoria": function (valor) {
    if (valor === "") return "Escolha a categoria. Sem ela a identificação não vale pra vaga de cota.";
    return "";
  },

  /* CID e opcional, entao so confere o formato de quem escreveu alguma
     coisa. Um codigo da CID-10 e uma letra e dois numeros, e as vezes
     um ponto e mais um numero depois: H90.3, F84, E11.9. */
  "pcd-cid": function (valor) {
    if (valor === "") return "";
    const formatoDeCid = /^[A-Z]\d{2}(\.\d{1,2})?$/;
    if (!formatoDeCid.test(valor.toUpperCase())) {
      return "O CID tem uma letra e dois números, às vezes com ponto e mais um, como H90.3.";
    }
    return "";
  }
};

/* Campo escondido (por exemplo o e-mail quando a pessoa marca "Não tenho
   e-mail") não é validado: quem não vê o campo não tem como corrigir. */
function campoEstaVisivel(campo) {
  return campo.closest(".oculto") === null;
}

/* Acha o span de erro olhando dentro da div.campo, e não pelo id, porque o
   id do erro do nome não segue o padrão. */
function acharSpanDeErro(campo) {
  const caixa = campo.closest(".campo");
  if (!caixa) return null;
  return caixa.querySelector(".campo__erro");
}

/* Só os campos que têm regra, dentro de um formulário. */
function camposComRegra(formulario) {
  const lista = [];
  Array.from(formulario.elements).forEach(function (campo) {
    if (regrasDosCampos[campo.id]) lista.push(campo);
  });
  return lista;
}


/* --------------------------------------------------------------------------
   validarCampo(campo)
   Devolve a mensagem de erro em texto, ou "" se estiver certo.
   -------------------------------------------------------------------------- */

function validarCampo(campo) {
  const regra = regrasDosCampos[campo.id];
  if (!regra) return "";
  if (!campoEstaVisivel(campo)) return "";
  return regra(campo.value.trim());
}


/* --------------------------------------------------------------------------
   mostrarErro(campo, mensagem)  e  limparErro(campo)
   -------------------------------------------------------------------------- */

function mostrarErro(campo, mensagem) {
  const span = acharSpanDeErro(campo);
  const caixa = campo.closest(".campo");

  if (span) {
    span.textContent = mensagem;
    span.classList.remove("oculto");
  }
  if (caixa) caixa.classList.add("campo--invalido");
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  const span = acharSpanDeErro(campo);
  const caixa = campo.closest(".campo");

  if (span) {
    span.textContent = "";
    span.classList.add("oculto");
  }
  if (caixa) caixa.classList.remove("campo--invalido");
  campo.removeAttribute("aria-invalid");
}

/* Valida um campo e já mostra ou limpa o erro. Devolve true se estiver certo. */
function conferirCampo(campo) {
  const mensagem = validarCampo(campo);
  if (mensagem) {
    mostrarErro(campo, mensagem);
    return false;
  }
  limparErro(campo);
  return true;
}


/* --------------------------------------------------------------------------
   Recados gerais (#recado-erro e #recado-certo)
   -------------------------------------------------------------------------- */

function mostrarRecado(tipo, texto) {
  const recadoErro = document.getElementById("recado-erro");
  const recadoCerto = document.getElementById("recado-certo");
  if (!recadoErro || !recadoCerto) return;

  const aparece = tipo === "erro" ? recadoErro : recadoCerto;
  const some = tipo === "erro" ? recadoCerto : recadoErro;

  some.textContent = "";
  some.classList.add("oculto");
  aparece.textContent = texto;
  aparece.classList.remove("oculto");
}


/* --------------------------------------------------------------------------
   validarFormulario(formulario)
   Valida todos os campos de uma vez. Devolve true se estiver tudo certo.
   Se tiver erro, manda o foco para o primeiro campo errado.
   -------------------------------------------------------------------------- */

function validarFormulario(formulario) {
  const errados = [];

  camposComRegra(formulario).forEach(function (campo) {
    if (!conferirCampo(campo)) errados.push(campo);
  });

  if (errados.length > 0) {
    errados[0].focus();
  }

  return errados.length === 0;
}


/* --------------------------------------------------------------------------
   Validar quando a pessoa sai do campo (blur)
   E, se o campo já está marcado com erro, revalidar enquanto ela digita,
   para a mensagem sumir assim que ela corrigir.
   -------------------------------------------------------------------------- */

function ligarValidacaoAoSair(formulario) {
  camposComRegra(formulario).forEach(function (campo) {

    campo.addEventListener("blur", function () {
      conferirCampo(campo);
    });

    const evento = campo.tagName === "SELECT" ? "change" : "input";
    campo.addEventListener(evento, function () {
      if (campo.getAttribute("aria-invalid") === "true") conferirCampo(campo);
    });
  });
}


/* --------------------------------------------------------------------------
   Etapa 1
   Ela não tem botão de envio: o "Continuar" é um link para #etapa-2.
   Se tiver erro, o link não navega (preventDefault).

   Para quem fizer o simulacao.js: antes de chamar mostrarEtapa(2) no clique
   desse mesmo botão, confira "if (evento.defaultPrevented) return;".
   Também dá pra chamar validarEtapaUm() direto, que devolve true ou false.
   -------------------------------------------------------------------------- */

function validarEtapaUm() {
  const formulario = document.getElementById("formulario-inicio");
  if (!formulario) return true;
  return validarFormulario(formulario);
}

function ligarEtapaUm() {
  const formulario = document.getElementById("formulario-inicio");
  if (!formulario) return;

  ligarValidacaoAoSair(formulario);

  const botaoContinuar = document.querySelector('#etapa-1 .navegacao-etapa a[href="#etapa-2"]');
  if (botaoContinuar) {
    botaoContinuar.addEventListener("click", function (evento) {
      if (!validarEtapaUm()) evento.preventDefault();
    });
  }

  /* se o formulário for enviado de algum outro jeito, ele não recarrega a página */
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (validarEtapaUm() && botaoContinuar) botaoContinuar.click();
  });
}


/* --------------------------------------------------------------------------
   Formulário final (#formulario-dados)
   -------------------------------------------------------------------------- */

function ligarFormularioDados() {
  const formulario = document.getElementById("formulario-dados");
  if (!formulario) return;

  ligarValidacaoAoSair(formulario);

  formulario.addEventListener("submit", function (evento) {
    /* o projeto não tem servidor: o envio nunca sai da página */
    evento.preventDefault();

    const tudoCerto = validarFormulario(formulario);

    if (!tudoCerto) {
      const quantos = formulario.querySelectorAll('[aria-invalid="true"]').length;
      const texto = quantos === 1
        ? "Falta arrumar 1 campo. Ele está marcado em vermelho logo abaixo."
        : "Faltam arrumar " + quantos + " campos. Eles estão marcados em vermelho logo abaixo.";
      mostrarRecado("erro", texto);
      return;
    }

    mostrarRecado("certo", "Tudo certo! Seu currículo está sendo montado.");

    /* gerarCurriculo() fica no simulacao.js. Enquanto ele não existir,
       a validação continua funcionando sem quebrar a página. */
    if (typeof gerarCurriculo === "function") {
      gerarCurriculo();
    }
  });
}


/* --------------------------------------------------------------------------
   Liga tudo quando a página termina de carregar
   -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  ligarEtapaUm();
  ligarFormularioDados();
});
