# AeroQuiz - Aviation Quiz PWA

## Overview

AeroQuiz is a Progressive Web Application (PWA) designed as an interactive aviation quiz platform, inspired by Kahoot!'s gamified learning experience. The application presents aviation-related questions across various categories (Meteorology, Regulations, Navigation) with timed gameplay, instant feedback, and engaging visual design. It's built to help aviation students study for exams through an energetic, full-screen quiz experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, bundled using Vite for optimal development experience and production builds.

**UI Component System**: Utilizes shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI elements. The component library follows a consistent design system with Tailwind CSS for styling.

**State Management**: React Query (@tanstack/react-query) handles server state, data fetching, and caching. Local component state is managed through React hooks (useState, useEffect) for quiz progression, user answers, and timers.

**Animation**: Framer Motion provides smooth animations and transitions for quiz interactions, answer feedback, and screen transitions.

**Design System**: Kahoot-inspired vibrant theme with:
- Custom color palette for quiz answer buttons (red, blue, yellow, green)
- Poppins font family for bold, modern typography
- Full-screen viewport sections for immersive gameplay
- Geometric shapes and high-contrast visual elements

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