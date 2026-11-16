/* ==========================================================================
  

   essa parte aqui sozinha vale ponto
   
   *****campos obrigatórios validados em
   JS, com mensagem de erro e de sucesso NA PÁGINA, sem alert().****

   ========================================================================== */

/* --------------------------------------------------------------------------
   O QUE JÁ ESTÁ PRONTO NO HTML

   Formulário da etapa 1 .... #formulario-identificacao
     #nome      + #erro-nome
     #idade     + #erro-idade

   Formulário da etapa 7 .... #formulario-dados
     #telefone        + #erro-telefone
     #email           + #erro-email
     #bairro          + #erro-bairro
     #escolaridade    + #erro-escolaridade
     #disponibilidade (opcional, sem validação)

   Recados gerais ........... #recado-erro  e  #recado-certo

   Cada <span class="campo__erro"> já tem role="alert" e começa com a classe
   .esconder. Cada campo já tem aria-describedby apontando para o seu erro.

--------------------------------------------------------------------------------
   O QUE ESTE ARQUIVO PRECISA FAZER

   1. validarCampo(campo)
      Devolve a mensagem de erro em texto, ou string vazia se estiver certo.
      Regras combinadas:
        nome      obrigatório, pelo menos duas palavras
        idade     obrigatório, número entre 14 e 99
        telefone  obrigatório, pelo menos 10 dígitos contando o DDD
        email     obrigatório, tem que ter @ e um ponto depois dele
        cidade    obrigatório,
        escolaridade  obrigatório.

   2. mostrarErro(campo, mensagem)
      Escreve a mensagem dentro do span de erro do campo, tira a classe
      .esconder dele, põe .campo--invalido no label e marca o input com
      aria-invalid="true".

   3. limparErro(campo)
      Desfaz o de cima.

   4. validarFormulario(formulario)
      valida todos os campos, impede o envio se tiver erro
      (evento submit + preventDefault), mostra #recado-erro com um resumo
      e manda o foco para o primeiro campo errado.
      se estiver tudo certo, mostra #recado-certo e chama gerarCurriculo().

   5. Validar também quando a pessoa sai do campo (evento blur), não só no
      envio. É o que faz parecer um site de verdade.

   REGRAS QUE NÃO PODEM SER QUEBRADAS
   - Nenhum alert(), confirm() ou prompt().
   - Mensagem de erro em português e em linguagem humana: "O nome precisa ser completo, 
     igual do documento", não "Campo inválido".
   - Nome de função e variável em português.
   -------------------------------------------------------------------------- */
function validarCampo(campo){};
function mostrarErro(campo, mensagem){}
function limparErro(campo){};
function validarFormulario(formulario){};
function validarCampo(campo) {};

