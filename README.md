# rezumaz

Plataforma que transforma a experiência do dia a dia em um currículo pronto.
Global Solution 2026-2 · CitizenTech · FIAP · turma 1ESOA.

## Como abrir

Não precisa instalar nada e não precisa de servidor.

1. Baixe ou descompacte a pasta do projeto.
2. Abra o arquivo `index.html` em qualquer navegador (duplo clique serve).
3. Para navegar, use o menu do topo.

---

## Estrutura dos arquivos

```
rezumaz/
├── index.html         página inicial - cidadão, problema com dado e fonte, proposta, ODS
├── solucao.html       a plataforma: o que é, como funciona, tecnologias, ecossistema
├── simulacao.html     as 4 etapas do questionário e o currículo pronto
├── impacto.html       números, ODS e próximos passos    [ESQUELETO - falta conteúdo]
├── equipe.html        integrantes, RM e link do pitch   [ESQUELETO - falta conteúdo]
├── css/
│   └── estilos.css    folha única 
├── js/
│   ├── dados.js       dados do questionário
│   ├── simulacao.js   mecânica das etapas                [VAZIO - a fazer]
│   └── formulario.js  validação dos formulários          [VAZIO - a fazer]
└── README.md
```

---

## Estado atual

| Parte | Situação |
|---|---|
| Front-end de todas as páginas | pronto |
| CSS completo com variáveis, responsividade e acessibilidade | pronto |
| Dados do questionário (`js/dados.js`) · 6 áreas, 60 atividades | pronto |


| Trocar de etapa, montar cards, gerar currículo | **a fazer** |
| Validação dos formulários | **a fazer** |
| Conteúdo de `impacto.html` e `equipe.html` | **a fazer** |
| Conferir instituição e carga horária dos cursos sugeridos | **a fazer** |


Cada arquivo de JS tem, no começo, a lista do que precisa fazer e o nome
sugerido de cada função.

---

## Combinados de código

- Só **HTML, CSS e JavaScript puros**. Nenhuma biblioteca ou framework de fora:
  o que for feito com framework externo não pontua.
- **Nenhum CSS dentro do HTML.** Sem `style=`, sem `<style>`. Tudo em
  `css/estilos.css`.
- **Nenhum estilo pelo JS.** Troque classe, nunca `elemento.style.cor`.
- Nome de **função, variável, id e classe em português**.
- **Nenhum `alert()`, `confirm()` ou `prompt()`.** Erro e sucesso aparecem na
  própria página.
---

## Integrantes

| Nome completo | RM | O que fez |

## Link do pitch

`_____`


## Uso de inteligência artificial

| Ferramenta | Para quê |


---

## Checklist da entrega (19/11, até 23h55)

- [ ] Todos os links internos abrem
- [ ] Nenhum `style=` no HTML
- [ ] Nenhum `alert()` no JS
- [ ] Todo campo de formulário tem `<label>`
- [ ] Testado em celular e em computador
- [ ] Testado navegando só pelo teclado (Tab e Enter)
- [ ] `.zip` com as pastas `css`, `js`, `img` e este README
- [ ] Arquivo de entrega em **`.txt` e em `.pdf`**
- [ ] Arquivo de entrega com nome do grupo, nome e RM de cada integrante e link
      do pitch
- [ ] Link do pitch público, testado em aba anônima
