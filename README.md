# AeroQuiz - Aviation Quiz PWA

Quiz interativo de aviação inspirado no Kahoot!, com 11 módulos de estudo baseados em documentos de aviação da ANAC.

## 🚀 Deploy no Render

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
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - O Render detectará automaticamente o `render.yaml`

3. **Variáveis de Ambiente**
   - `SESSION_SECRET` será gerado automaticamente
   - Adicione outras variáveis se necessário

4. **Deploy Automático**
   - O Render fará build e deploy automaticamente
   - A URL será algo como: `https://aeroquiz.onrender.com`

## 🛠️ Desenvolvimento Local

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

## 📦 Estrutura do Projeto

```
├── client/          # Frontend React + TypeScript
│   └── src/
│       ├── pages/   # Páginas principais
│       ├── components/  # Componentes reutilizáveis
│       └── lib/     # Utilitários
├── server/          # Backend Express + TypeScript
│   ├── routes.ts    # Rotas da API
│   └── storage.ts   # Armazenamento em memória
├── shared/          # Schemas compartilhados
│   └── schema.ts    # Tipos e validações Zod
└── render.yaml      # Configuração do Render
```

## 🎮 Funcionalidades

- ✅ 11 módulos de estudo (10 específicos + Quiz Misto)
- ✅ Perguntas de múltipla escolha com timer
- ✅ Sistema de pontuação baseado em tempo de resposta
- ✅ Feedback visual instantâneo
- ✅ Interface inspirada no Kahoot!
- ✅ Design responsivo e acessível
- ✅ PWA (Progressive Web App)

## 📚 Módulos Disponíveis

1. **Sistemas da Aeronave** - Ar condicionado, oxigênio, proteção contra fogo
2. **Motores** - Conhecimentos técnicos sobre motores
3. **Sistema de Alimentação** - Combustível e componentes
4. **Estrutura e Componentes** - Asas, fuselagem, controles
5. **Meteorologia - Nuvens** - Classificação e tipos
6. **Sistema de Aviação Civil** - Regulamentação e história
7. **Emergência e Segurança** - Procedimentos de emergência
8. **Primeiros Socorros** - Atendimento pré-hospitalar
9. **Fatores Humanos** - CRM e comunicação
10. **Situações a Bordo** - Código aeronáutico brasileiro
11. **Quiz Misto** - Questões aleatórias de todos os módulos

## 🔧 Tecnologias

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Query
- Shadcn/ui

**Backend:**
- Express.js
- TypeScript
- Zod (validação)
- In-memory storage

## 📝 Licença

MIT
