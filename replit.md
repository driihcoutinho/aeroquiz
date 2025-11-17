# AeroQuiz - Aviation Quiz PWA

## Overview

AeroQuiz is a Progressive Web Application (PWA) designed as an interactive aviation quiz platform, inspired by Kahoot!'s gamified learning experience. The application presents aviation-related questions organized into 11 specialized modules covering ANAC regulations, aircraft systems, meteorology, emergency procedures, and more. Features timed gameplay, instant feedback, module-based study selection, and engaging Kahoot-style visual design.

**Latest Updates (November 2025):**
- **Data Ingestion**: Processed 1.270 questões oficiais CMS ANAC (99,1% success rate) from official DOCX files
  - ESS: 391/399 (98,0%)
  - RPA: 329/332 (99,1%)
  - PSS: 300/300 (100%)
  - CGA: 250/250 (100%)
- **Design System**: Yellow/dark theme based on professional color palette
  - Background: #192230 (dark navy)
  - Cards: #3d474e (dark gray)
  - Primary accent: #ffcd00 (vibrant yellow)
  - Secondary: #2c2f38 (darker gray)
  - Correct answers: Light green (#d1f4e0) with green borders
  - Incorrect answers: Light pink (#ffd4d4) with red borders
- **Module-Based Quiz System**: 4 independent quiz sessions by module
  - Home screen displays all 4 modules with question counts
  - Each module tracks its own correct/incorrect answers
  - Results screen shows module-specific performance
- **Navigation**: "Início" button on all screens (Quiz, Results) for easy navigation
- **Progress Saving System**: Automatic progress tracking with localStorage
  - Progress saved automatically when user leaves quiz
  - Progress persists for 24 hours
  - "Em progresso" badge shows on modules with saved progress
  - Dialog prompts user to continue or start new quiz when returning
  - Clear indication of current question on module button
- **Sistema Simplificado**: Removed Kahoot-style scoring system and timer display
  - Durante quiz: apenas feedback "Correto!" ou "Incorreto"
  - Tela de resultados: mostra quantidade de acertos/erros e porcentagem por módulo
  - Sem cálculo de pontos baseado em tempo
  - Timer removido da interface para experiência mais limpa
- Automated question extraction pipeline using mammoth + regex parser
- Gabaritos oficiais ANAC manually transcribed and validated
- Prepared for production deployment on Render

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment

**Production Deployment**: Configured for Render.com deployment via GitHub integration
- Build command: `npm install && npm run build`
- Start command: `npm start`  
- Auto-generated SESSION_SECRET for security
- See README.md for detailed deployment instructions

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, bundled using Vite for optimal development experience and production builds.

**UI Component System**: Utilizes shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI elements. The component library follows a consistent design system with Tailwind CSS for styling.

**State Management**: React Query (@tanstack/react-query) handles server state, data fetching, and caching. Local component state is managed through React hooks (useState, useEffect) for quiz progression, user answers, and timers.

**Animation**: Framer Motion provides smooth animations and transitions for quiz interactions, answer feedback, and screen transitions.

**Design System**: Yellow/dark theme (dark mode only):
- **Palette**: Dark navy (#192230), Dark gray (#3d474e), Vibrant yellow (#ffcd00), Darker gray (#2c2f38)
- **Layout**: Vertical list of answer options, dark gray question cards
- **Feedback**: Light green (#d1f4e0) with green borders for correct, Light pink (#ffd4d4) with red borders for incorrect
- **Typography**: System sans for clean readability
- Full-screen immersive dark mode experience with yellow accents

**PWA Features**: Service worker implementation for offline functionality, manifest.json for installability, and mobile-first responsive design.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript for type safety.

**API Design**: RESTful endpoints for quiz operations:
- `POST /api/quiz/start` - Initializes a new quiz session with randomized questions
- `POST /api/quiz/answer` - Submits answer and receives immediate feedback

**Session Management**: Quiz sessions track user progress including current question index, score, correct answers, and answer history.

**Question Delivery**: Questions are served without correct answers to prevent client-side cheating. Answer validation occurs server-side.

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL, providing type-safe database operations and schema management.

**Database Schema**:
- **Questions Table**: Stores quiz questions with multiple-choice options, correct answer index, category, difficulty level, explanations, and time limits
- **Quiz Sessions Table**: Tracks individual quiz attempts with session state, scores, question sequence, and completion status

**Development Storage**: In-memory storage implementation (MemStorage class) for development and testing, seeded with aviation questions.

**Migration Strategy**: Drizzle Kit handles database migrations with schema definitions in TypeScript.

### External Dependencies

**Database**: Configured for PostgreSQL via Neon Database serverless driver (@neondatabase/serverless). Connection managed through DATABASE_URL environment variable.

**UI Component Libraries**:
- Radix UI - Comprehensive set of accessible, unstyled components
- shadcn/ui - Pre-styled component system built on Radix UI
- Lucide React - Icon library for consistent iconography

**Animation & Interaction**:
- Framer Motion - Declarative animations and gestures
- Embla Carousel - Touch-friendly carousel component

**Form Handling**:
- React Hook Form - Performant form state management
- Zod - Schema validation with TypeScript integration (@hookform/resolvers)

**Styling**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Component variant management
- clsx & tailwind-merge - Conditional class name utilities

**Build Tools**:
- Vite - Fast build tool and dev server
- esbuild - JavaScript bundler for production builds
- TypeScript - Type safety across the application

**Development Tools** (Replit-specific):
- @replit/vite-plugin-runtime-error-modal - Enhanced error reporting
- @replit/vite-plugin-cartographer - Development tooling
- @replit/vite-plugin-dev-banner - Development mode indicators

**PWA Support**:
- Service Worker API - Custom offline caching strategy
- Web App Manifest - Installability and app-like experience