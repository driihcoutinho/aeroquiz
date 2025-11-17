# AeroQuiz - Aviation Quiz PWA

Progressive Web App (PWA) de quiz de aviação com 1.270 questões oficiais do CMS ANAC, especialmente desenvolvido para comissários de bordo.

## Visão Geral

AeroQuiz é uma aplicação de quiz interativa que apresenta questões oficiais de aviação organizadas em 4 módulos especializados baseados nos documentos CMS ANAC. O sistema oferece feedback instantâneo, timer por questão e design moderno em tema roxo escuro.

### Características Principais

- 1.270 questões oficiais CMS ANAC validadas
- 4 módulos especializados (ESS, RPA, PSS, CGA)
- Design Tranquil Lily com tema roxo escuro
- Layout vertical de respostas
- Timer de 30 segundos por questão
- Feedback visual imediato (verde/vermelho)
- Sistema simplificado de contagem (acertos/erros)
- Interface responsiva e acessível
- Progressive Web App (PWA)

## Módulos Disponíveis

1. **GRUPO 1 - ESS** (391 questões) - Emergência, Segurança e Sobrevivência
2. **GRUPO 2 - RPA** (329 questões) - Regulamentação da Profissão de Aeronauta
3. **GRUPO 3 - PSS** (300 questões) - Primeiros Socorros e Saúde
4. **GRUPO 4 - CGA** (250 questões) - Conhecimentos Gerais de Aeronaves

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

1. **Push para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <seu-repo-github>
   git push -u origin main
   ```

2. **Conectar no Render**
   - Acesse [Render Dashboard](https://dashboard.render.com/)
   - Clique em "New +" > "Web Service"
   - Conecte seu repositório GitHub
   - O Render detectará automaticamente o `render.yaml`

3. **Variáveis de Ambiente**
   - `SESSION_SECRET` será gerado automaticamente
   - Adicione outras variáveis se necessário

4. **Deploy Automático**
   - O Render fará build e deploy automaticamente
   - A URL será algo como: `https://aeroquiz.onrender.com`

## Estrutura do Projeto

```
├── client/                # Frontend React + TypeScript
│   └── src/
│       ├── pages/         # Páginas principais (Home, Quiz, Results)
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
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion (animações)
- React Query (estado do servidor)
- Shadcn/ui (componentes)
- Wouter (roteamento)

**Backend:**
- Express.js
- TypeScript
- Zod (validação de schemas)
- In-memory storage (desenvolvimento)

**Ferramentas:**
- Mammoth (extração de DOCX)
- Drizzle ORM (preparado para PostgreSQL)

## API Endpoints

### POST /api/quiz/start
Inicia uma nova sessão de quiz

**Request:**
```json
{
  "module": "ess" | "rpa" | "pss" | "cga" | "misto"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "currentQuestionIndex": 0,
    "correctAnswers": 0,
    "totalQuestions": 10
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

## Design

**Tema Tranquil Lily:**
- Deep purple (#4B3F6E) - Background
- Medium purple (#6C5F8D) - Elementos primários
- Lavender (#9C8CB9) - Acentos
- Beige (#DCD7D5) - Detalhes
- Rose purple (#BA96C1) - Highlights

**Feedback:**
- Verde (#7FD957) - Resposta correta
- Vermelho (#FF6B6B) - Resposta incorreta

## Licença

MIT
