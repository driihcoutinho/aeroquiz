import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Module types
export const MODULES = [
  "sistemas-aeronave",
  "motores",
  "alimentacao",
  "estrutura-componentes",
  "meteorologia-nuvens",
  "aviacao-civil",
  "emergencia-seguranca",
  "primeiros-socorros",
  "fatores-humanos",
  "situacoes-codigo",
  "misto", // Quiz misto (todas as questões)
] as const;

export type QuizModule = typeof MODULES[number];

// Module metadata
export const MODULE_INFO: Record<QuizModule, { name: string; description: string }> = {
  "sistemas-aeronave": {
    name: "Sistemas da Aeronave",
    description: "Ar condicionado, oxigênio, proteção contra fogo e degelo"
  },
  "motores": {
    name: "Conhecimentos Técnicos",
    description: "Conhecimentos técnicos gerais sobre aeronaves"
  },
  "alimentacao": {
    name: "Serviço de Bordo",
    description: "Procedimentos e serviços oferecidos durante o voo"
  },
  "estrutura-componentes": {
    name: "Conhecimento da Aeronave",
    description: "Estrutura básica, componentes e equipamentos de segurança"
  },
  "meteorologia-nuvens": {
    name: "Meteorologia - Nuvens",
    description: "Classificação e tipos de nuvens, formação e características"
  },
  "aviacao-civil": {
    name: "Sistema de Aviação Civil",
    description: "História, regulamentação e convenções internacionais"
  },
  "emergencia-seguranca": {
    name: "Emergência e Segurança",
    description: "Procedimentos de emergência, evacuação e combate ao fogo"
  },
  "primeiros-socorros": {
    name: "Primeiros Socorros",
    description: "Atendimento pré-hospitalar, sinais vitais e avaliação"
  },
  "fatores-humanos": {
    name: "Fatores Humanos",
    description: "CRM, comunicação, assertividade e gestão de conflitos"
  },
  "situacoes-codigo": {
    name: "Situações a Bordo",
    description: "Situações especiais a bordo e código aeronáutico brasileiro"
  },
  "misto": {
    name: "Quiz Misto",
    description: "Questões aleatórias de todos os módulos"
  }
};

// Question schema
export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  options: text("options").array().notNull(), // Array of 4 options
  correctAnswer: integer("correct_answer").notNull(), // Index 0-3
  category: text("category").notNull(), // e.g., "Meteorologia", "Navegação", "Regulamentos"
  difficulty: text("difficulty").notNull(), // "easy", "medium", "hard"
  explanation: text("explanation"), // Optional explanation for the answer
  timeLimit: integer("time_limit").default(20).notNull(), // seconds
  module: text("module").notNull().default("misto"), // Module this question belongs to
  moduleDescription: text("module_description"), // Optional module-specific description
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Quiz Session schema
export const quizSessions = pgTable("quiz_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentQuestionIndex: integer("current_question_index").default(0).notNull(),
  score: integer("score").default(0).notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  totalQuestions: integer("total_questions").notNull(),
  questionIds: text("question_ids").array().notNull(), // Array of question IDs
  answers: text("answers").array().notNull(), // Array of user answers (indices)
  isComplete: boolean("is_complete").default(false).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  module: text("module").notNull().default("misto"), // Selected module for this quiz
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  startedAt: true,
});

export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;

// Answer submission schema
export const answerSubmissionSchema = z.object({
  sessionId: z.string(),
  questionIndex: z.number(),
  selectedAnswer: z.number().min(-1).max(3).nullable(), // null or -1 = timeout/no answer
  timeSpent: z.number(), // seconds
});

export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;

// Quiz result schema (for frontend)
export const quizResultSchema = z.object({
  isCorrect: z.boolean(),
  correctAnswer: z.number(),
  pointsEarned: z.number(),
  currentScore: z.number(),
  explanation: z.string().optional(),
});

export type QuizResult = z.infer<typeof quizResultSchema>;

// Quiz start request schema
export const quizStartRequestSchema = z.object({
  module: z.enum(MODULES).optional().default("misto"),
});

export type QuizStartRequest = z.infer<typeof quizStartRequestSchema>;

export const quizStartResponseSchema = z.object({
  session: z.custom<QuizSession>(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    category: z.string(),
    difficulty: z.string(),
    timeLimit: z.number(),
  })),
});

export type QuizStartResponse = z.infer<typeof quizStartResponseSchema>;
