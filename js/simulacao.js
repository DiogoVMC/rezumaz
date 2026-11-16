/* ==========================================================================
   Tudo em HTML, CSS e JS puros. Sem biblioteca de fora.
   ========================================================================== */

/* --------------------------------------------------------------------------
   O QUE ESTE ARQUIVO PRECISA FAZER

   1. montarOpcoes()
      Percorre os arrays de js/dados.js e cria os cards no DOM.
      - areas[]        -> dentro de #lista-areas
      - habilidades[]  -> dentro de #lista-habilidades, um fieldset por área
      - frequencias[]  -> dentro de #lista-frequencia
      - destinos[]     -> dentro de #lista-destinos
      - cursos[]       -> dentro de #lista-cursos
      Este é o requisito avaliado: array de 10+ objetos exibido no DOM.
      O card modelo de cada lista já está no HTML — copiar essa marcação
      exata, inclusive o SVG do tique, senão o CSS do estado marcado não pega.

   2. mostrarEtapa(numero)
      Deixa visível só a seção #etapa-<numero> e esconde as outras com a
      classe .esconder. Também move o foco para o título da etapa, senão
      quem usa teclado ou leitor de tela se perde.

   3. atualizarBarra(numero)
      Troca a classe .trecho-1 ... .trecho-7 na div .etapa-cabeca__trecho
      e atualiza o texto "Etapa N de 7".

   4. guardarResposta(etapa)
      Lê o que foi marcado e guarda num objeto em memória, por exemplo
      respostas = { nome, idade, areas: [], habilidades: [], frequencia,
      destino, contato: {} }.
      Não usar servidor nem banco: o projeto promete que o dado não sai do
      aparelho, e isso está escrito na tela.

   5. filtrarHabilidades()
      Na etapa 3, mostrar só as habilidades cujo campo .area está entre as
      áreas marcadas na etapa 2.

   6. gerarCurriculo()
      Junta as competencias[] e as frases[] das habilidades marcadas,
      ordena pelo peso da frequência escolhida, e escreve dentro de
      #folha-final e #previa-competencias.

   7. avisarCompatibilidade()
      Compara o destino escolhido com destinos[].combina. Se a combinação
      for fraca, mostra o aviso e sugere um curso de cursos[].

   REGRAS QUE NÃO PODEM SER QUEBRADAS
   - Nenhum alert(). Erro e sucesso aparecem na própria página.
   - Nome de função, variável, id e classe em português.
   - Se o JS não carregar, a página continua legível. Por isso o card
     marcável funciona sem JS (input:checked + irmão no CSS).
   -------------------------------------------------------------------------- */
function montarOpcoes(){}; 
function mostrarEtapa(numero){};
function atualizarBarra(numero){};
function guardarResposta(etapa){};
function filtrarHabilidades(){};
function gerarCurriculo(){};
function avisarCompatibilidade(){};
