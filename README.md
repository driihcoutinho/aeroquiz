# AeroQuiz - Aviation Quiz PWA

Progressive Web App (PWA) de quiz de aviação com 1.270 questões oficiais do CMS ANAC, especialmente desenvolvido para comissários de bordo.

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

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar versão de produção
npm start
```

O servidor estará disponível em `http://localhost:5000`

## Deploy no Render

### Pré-requisitos
- Conta no [GitHub](https://github.com)
- Conta no [Render](https://render.com)

### Passos para Deploy

**1. Push para GitHub**
```bash
git init
git add .
git commit -m "feat: AeroQuiz PWA completo com 1.270 questões ANAC"
git branch -M main
git remote add origin <seu-repo-github>
git push -u origin main
```

**2. Conectar no Render**
- Acesse [Render Dashboard](https://dashboard.render.com/)
- Clique em "New +" > "Web Service"
- Conecte seu repositório GitHub
- O Render detectará automaticamente o `render.yaml`

**3. Configuração Automática**
O `render.yaml` já configura:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node
- `SESSION_SECRET` gerado automaticamente

**4. Deploy**
- Clique em "Create Web Service"
- Aguarde o build (2-3 minutos)
- App disponível em: `https://aeroquiz.onrender.com`

**5. Atualizações Futuras**
```bash
git add .
git commit -m "descrição da mudança"
git push origin main
# Deploy automático no Render!
```

## Estrutura do Projeto

```
├── client/                # Frontend React + TypeScript
│   └── src/
│       ├── pages/         # Home, Quiz, Results
│       ├── components/    # Componentes reutilizáveis
│       └── lib/           # Utilitários e configuração
├── server/                # Backend Express + TypeScript
│   ├── routes.ts          # Rotas da API
│   ├── storage.ts         # Armazenamento em memória
│   └── vite.ts            # Configuração Vite
├── shared/                # Código compartilhado
│   ├── schema.ts          # Tipos e validações Zod
│   └── data/              # Dados das questões
│       ├── questions.ts   # 1.270 questões oficiais
│       └── gabaritos.ts   # Gabaritos ANAC
├── scripts/               # Scripts de processamento
│   └── extract-questions.ts  # Pipeline de extração DOCX
└── render.yaml            # Configuração do Render
```

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

## API Endpoints

### POST /api/quiz/start
Inicia uma nova sessão de quiz

**Request:**
```json
{
  "module": "ess" | "rpa" | "pss" | "cga"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "currentQuestionIndex": 0,
    "correctAnswers": 0,
    "totalQuestions": 391
  },
  "questions": [
    {
      "id": "ess-1",
      "question": "Texto da pergunta...",
      "options": ["A", "B", "C", "D"],
      "category": "Emergência",
      "difficulty": "medium",
      "timeLimit": 30
    }
  ]
}
```

### POST /api/quiz/answer
Submete resposta de uma questão

**Request:**
```json
{
  "sessionId": "uuid",
  "questionIndex": 0,
  "selectedAnswer": 2,
  "timeSpent": 15.5
}
```

**Response:**
```json
{
  "isCorrect": true,
  "correctAnswer": 2
}
```

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

**Desenvolvido para comissários de bordo** 🛫✈️
Estude com questões oficiais ANAC e alcance seus objetivos!
