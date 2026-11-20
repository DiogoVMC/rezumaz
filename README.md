# rezumaz

Plataforma que transforma a experiência do dia a dia em um currículo pronto.

Global Solution 2026-2 · CitizenTech · FIAP · turma 1ESOA

---

## O problema

No Brasil há 46,6 milhões de jovens de 15 a 29 anos, e 17,5% deles não estavam
trabalhando, não estudavam no ensino regular e não faziam curso de qualificação
em 2025 (IBGE, PNAD Educação, junho de 2026). Entre os adolescentes de 14 a 17
anos que trabalham, 7 em cada 10 trabalham sem registro (Ministério do Trabalho
e Emprego, PNAD Contínua, 1º trimestre de 2026).

Nos dois casos a pessoa chega na primeira vaga formal sem nada escrito. O
rezumaz pergunta sobre a rotina dela, nunca sobre emprego anterior, e devolve um
currículo pronto.

ODS 10 · meta 10.2 e ODS 4 · meta 4.4.

### Fontes

- **OIT / ONU Brasil** · *OIT alerta para avanço do desemprego juvenil e maior
  dificuldade de acesso ao trabalho* (12/08/2026), sobre o relatório
  *Tendências Globais do Emprego Juvenil 2026*. É de onde vem a frase de
  Gilbert F. Houngbo que abre a página inicial.
  <https://brasil.un.org/pt-br/320872-oit-alerta-para-avan%C3%A7o-do-desemprego-juvenil-e-maior-dificuldade-de-acesso-ao-trabalho>

- **IBGE · Agência de Notícias** · *Cai a proporção de jovens que não
  trabalham, não estudam e nem se qualificam* (19/06/2026), PNAD Educação.
  É de onde vêm os 46,6 milhões de jovens e os 17,5%.
  <https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/47222-cai-a-proporcao-de-jovens-que-nao-trabalham-nao-estudam-e-nem-se-qualificam>

- **Ministério do Trabalho e Emprego · SEET** · *Diagnóstico da Juventude
  Brasileira*, PNAD Contínua do 1º trimestre de 2026. É de onde vêm os 72,8%
  de informalidade entre os adolescentes de 14 a 17 anos.
  <https://www.gov.br/trabalho-e-emprego/pt-br/noticias-e-conteudo/2026/junho/dadosmtetrabalhojovem20261.pdf>

- **Benchmarks de formulário** (Baymard Institute, HubSpot, Formstack) e
  **pesquisa Opinion Box / Influency.me** com 2.000 entrevistados, citados no
  card "Forma" da página inicial.

---

## Como abrir

Não precisa instalar nada e não precisa de servidor.

1. Descompacte a pasta do projeto.
2. Abra `index.html` em qualquer navegador. Duplo clique serve.
3. Navegue pelo menu do topo.

A página funciona mesmo com o JavaScript desligado: os textos continuam
visíveis, só as partes interativas deixam de responder.

---

## Estrutura dos arquivos

```
rezumaz/
├── index.html         problema com dado e fonte, personas, proposta, ODS
├── solucao.html       o que é a plataforma e como funciona
├── simulacao.html     as 4 etapas do questionário e o currículo pronto
├── impacto.html       quem sente a diferença, ODS e próximos passos
├── equipe.html        integrantes, RM e link do pitch
├── css/
│   └── estilos.css    folha única, com variáveis, responsividade,
│                      alto contraste e regras de impressão
├── js/
│   ├── dados.js       6 áreas, 60 atividades, 4 responsabilidades,
│   │                  4 frequências, 6 destinos, 6 cursos
│   ├── visual.js      barra de acessibilidade, máscaras e campos condicionais
│   ├── simulacao.js   afunilamento, frequência, currículo e aderência
│   ├── formulario.js  validação dos formulários
│   └── inicio.js      cartas que trocam o texto do painel
├── img/
│   ├── guard-and-stool.jpeg
│   └── Maxwell-Alexandre.jpg
└── README.md
```

---

## O que a plataforma faz

**Etapa 1 · quem é.** Nome de tratamento e idade. Nada mais.

**Etapa 2 · as cartas.** Seis atividades por tela, três delas da área que a
pessoa mais marcou até ali. O nível sobe conforme ela responde: começa pelas
atividades comuns, vai para as intermediárias e depois para as incomuns. Duas
telas seguidas sem nenhuma marcação trocam o nível. Quem pula todas as comuns
encerra a sondagem e recebe sugestão de curso. No fim vêm as
responsabilidades, que não pertencem a nenhuma área.

**Etapa 2 · a frequência.** Uma área por tela. A pessoa diz quantas vezes fez
cada atividade, e o tom da pílula escurece conforme a frequência. No alto
contraste, onde a cor some, a frequência também aparece como uma régua no pé da
pílula, porque cor não pode ser o único sinal.

**Etapa 3 · a prévia e os dados.** Mostra o que já dá para escrever e pede só o
que falta: contato, cidade, escolaridade e, se a pessoa quiser, nome social,
identificação de pessoa com deficiência e a área para a qual quer direcionar.

**Etapa 4 · o currículo.** Objetivo conforme a área escolhida, habilidades
ordenadas pelo peso da frequência, experiência prática e formação. Dá para
imprimir em uma folha A4 ou baixar em Markdown para colar num chat de IA.

**Voltar rebobina o estado**, não só a tela. O calor das áreas volta ao que era
antes da fase, porque voltar não garante que a pessoa vá escolher o mesmo de
novo.

---

## Acessibilidade

- Barra fixa no topo com atalhos de teclado, no padrão e-MAG: `1` para o
  conteúdo, `2` para o menu, `6` para o alto contraste.
- Botões de aumentar e diminuir o tamanho da letra.
- Modo de alto contraste, com a frequência indicada por régua e não só por cor.
- Toda a navegação funciona por teclado, com `aria-expanded`, `aria-controls`,
  `role="status"` e `role="alert"` onde são necessários.
- Todo campo tem `<label>`, toda imagem tem `alt`, cada página tem um só `h1`.
- Contraste conferido: as cores usadas com texto passam de 4.5:1.

---

## Combinados de código

- Só **HTML, CSS e JavaScript puros**. Nenhuma biblioteca ou framework de fora.
- **Nenhum CSS dentro do HTML.** Sem `style=`, sem `<style>`. Tudo em
  `css/estilos.css`.
- **Nenhum estilo pelo JS.** Troca-se classe, nunca `elemento.style.cor`.
- Nome de **função, variável, id e classe em português**.
- **Nenhum `alert()`, `confirm()` ou `prompt()`.** Erro e sucesso aparecem na
  própria página.
- Nada é enviado para servidor: o questionário inteiro roda no navegador.

---

## Integrantes

| Nome completo | RM | O que fez |
|---|---|---|
| Diogo Victor Martins | 569373 | Elaboração da ideia do projeto e do conceito de design. Mecânica dos cards de afunilamento e CSS. |
| Gabriel Antônio Gonçalves | 573249 | Estrutura do currículo e mecânica de download. Aviso de aderência com sugestão de curso.  |
| Rafael Simeoni Pereira | 572414 |Validação dos formulários, campos condicionais da etapa 1 e página de impacto.|

---

## Link do pitch

`_____`

---

## Imagens

As duas obras usadas na página inicial são de **Maxwell Alexandre**, da série
*Novo Poder*, desdobramento de *Pardo é Papel*. Reprodução autorizada.

---

## Uso de inteligência artificial

| Ferramenta | Para quê |
|---|---|
| Claude (Anthropic) | Criação do FIGMA a ser seguido no projeto, revisão de acessibilidade e contraste, e revisão de texto, elaboração de texto de cada atividade. Todo o código foi lido e revisado pelo grupo antes de entrar.|

