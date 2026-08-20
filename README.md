# AeroQuiz - Aviation Quiz PWA

Progressive Web App (PWA) de quiz de aviação com 1.270 questões oficiais do CMS ANAC, especialmente desenvolvido para comissários de bordo.

| | |
|---|---|
| **Questões** | 1.270 extraídas de 4 documentos oficiais CMS ANAC |
| **Stack** | React 18 + TypeScript · Express · Vite · TailwindCSS |
| **Tipo** | Progressive Web App — instalável e funcional offline |
| **Rodar** | `npm install && npm run dev` |

## Por que existe

O AeroQuiz nasceu para uma pessoa: minha esposa, que estava no processo seletivo de comissária de bordo da LATAM.

O material oficial do CMS ANAC são 1.281 questões espalhadas por quatro documentos DOCX, com os gabaritos em imagens separadas. Estudar assim significa alternar entre arquivos e conferir resposta por resposta, à mão. Em vez de imprimir tudo, escrevi um pipeline que lê os DOCX oficiais, separa enunciado e alternativas, cruza com os gabaritos e monta um quiz com correção instantânea e progresso salvo.

Ela não passou no processo. O aplicativo continuou de pé, e outros comissários passaram a usar para estudar, foi assim que o projeto virou um case que publiquei no LinkedIn.

## Visão Geral

AeroQuiz é uma aplicação de quiz interativa que apresenta questões oficiais de aviação organizadas em 4 módulos especializados baseados nos documentos CMS ANAC. O sistema oferece feedback instantâneo, salvamento automático de progresso e design moderno em tema amarelo/escuro.

### Características Principais

- **1.270 questões oficiais CMS ANAC** validadas
- **4 módulos especializados** (ESS, RPA, PSS, CGA)
- **Design amarelo/escuro** profissional
- **Layout vertical responsivo**
- **Salvamento automático de progresso** (24h)
- **Feedback visual imediato** (verde/vermelho)
- **Sistema simplificado** de contagem (acertos/erros por módulo)
- **Progressive Web App (PWA)** - funciona offline
- **Sistema de retomada** - continue de onde parou

## Módulos Disponíveis

1. **GRUPO 1 - ESS** (391 questões) - Emergência, Segurança e Sobrevivência
2. **GRUPO 2 - RPA** (329 questões) - Regulamentação da Profissão de Aeronauta
3. **GRUPO 3 - PSS** (300 questões) - Primeiros Socorros e Saúde
4. **GRUPO 4 - CGA** (250 questões) - Conhecimentos Gerais de Aeronaves

Cada módulo funciona de forma **independente** - você pode fazer um módulo por vez e o progresso é salvo automaticamente!

## Design

**Paleta Amarela/Escura:**
- Dark Navy (#192230) - Background
- Dark Gray (#3d474e) - Cards
- Vibrant Yellow (#ffcd00) - Accent principal
- Darker Gray (#2c2f38) - Secundário

**Feedback Visual:**
- Verde claro (#d1f4e0) com borda verde - Resposta correta
- Rosa claro (#ffd4d4) com borda vermelha - Resposta incorreta

## Sistema de Progresso

- **Salvamento automático**: Ao clicar em "Início" durante o quiz
- **Badge "Em progresso"**: Indica módulos com progresso salvo
- **Dialog de retomada**: Pergunta se quer continuar ou começar novo
- **Expiração**: Progresso mantido por 24 horas
- **Indicador**: Mostra em qual questão você parou

## Como rodar

Requer Node.js 18 ou superior.

```bash
npm install
```

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5000` — API e cliente na mesma porta. Para usar outra, defina `PORT`:

```bash
PORT=3000 npm run dev
```

Build de produção:

```bash
npm run build && npm start
```

Verificação de tipos:

```bash
npm run check
```

## Arquitetura

```
client/          React 18 + TypeScript, servido pelo Vite em desenvolvimento
  src/pages/     Home (seleção de módulo), Quiz, Results
  src/components/  Componentes próprios + Shadcn/ui
  public/sw.js   Service Worker — cache offline e atualização automática
server/          Express + TypeScript
  routes.ts      API de questões e progresso
  storage.ts     Armazenamento em memória (interface pronta para PostgreSQL)
  vite.ts        Middleware do Vite em dev, arquivos estáticos em produção
shared/          Código compartilhado entre cliente e servidor
  schema.ts      Schemas Zod — uma fonte de verdade para os dois lados
  data/          1.270 questões e gabaritos já processados
scripts/         Pipeline de extração dos DOCX oficiais da ANAC
```

O `shared/` existe para que cliente e servidor validem contra **o mesmo schema Zod**, sem duplicar tipo nem deixar contrato divergir.

### O pipeline de extração

As questões não foram digitadas à mão. Os scripts em `scripts/` leem os DOCX oficiais da ANAC com `mammoth`, separam enunciado e alternativas por regex, cruzam com os gabaritos transcritos e rejeitam o que não bate. As 11 questões descartadas (de 1.281) tinham defeito de formatação no documento de origem — o parser prefere descartar a inserir questão com alternativa errada.

## Tecnologias

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Framer Motion (animações)
- React Query (estado do servidor)
- Shadcn/ui (componentes)
- Wouter (roteamento)

**Backend:**
- Express.js + TypeScript
- Zod (validação de schemas)
- In-memory storage

**Ferramentas:**
- Mammoth (extração de DOCX)
- Drizzle ORM (preparado para PostgreSQL)


## Dados Oficiais

As questões foram extraídas de documentos oficiais ANAC:
- **Fonte**: Documentos DOCX oficiais CMS ANAC
- **Taxa de sucesso**: 99,1% (1.270/1.281 questões)
- **Pipeline**: Extração automatizada com mammoth + regex parser
- **Validação**: Gabaritos oficiais ANAC manualmente transcritos

**Breakdown por Módulo:**
- ESS: 391/399 (98,0%)
- RPA: 329/332 (99,1%)
- PSS: 300/300 (100%)
- CGA: 250/250 (100%)

## Como Usar

1. **Escolha um módulo** na tela inicial
2. **Continue de onde parou** ou comece um novo quiz
3. **Responda as questões** - feedback instantâneo
4. **Clique "Início"** a qualquer momento para pausar
5. **Veja seus resultados** ao completar o módulo
6. **Reinicie** ou volte para home


## Licença

MIT

---

Feito para uma comissária estudar. Acabou servindo a outras.
