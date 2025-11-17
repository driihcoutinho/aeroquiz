import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Module types - CMS ANAC oficial (1281 questões reais)
export const MODULES = [
  "ess",    // GRUPO 1 - Emergência, Segurança e Sobrevivência (399 questões)
  "rpa",    // GRUPO 2 - Regulamentação da Profissão de Aeronauta (332 questões)
  "pss",    // GRUPO 3 - Primeiros Socorros (300 questões)
  "cga",    // GRUPO 4 - Conhecimentos Gerais de Aeronaves (250 questões)
  "misto",  // Quiz misto (todas as questões)
] as const;

export type QuizModule = typeof MODULES[number];

// Module metadata - CMS ANAC oficial
export const MODULE_INFO: Record<QuizModule, { name: string; description: string; questionCount: number }> = {
  "ess": {
    name: "GRUPO 1 - ESS",
    description: "Emergência, Segurança e Sobrevivência",
    questionCount: 391  // 391 questões processadas de 399 oficiais (99,1% sucesso)
  },
  "rpa": {
    name: "GRUPO 2 - RPA",
    description: "Regulamentação da Profissão de Aeronauta",
    questionCount: 329  // 329 questões processadas de 332 oficiais (99,1% sucesso)
  },
  "pss": {
    name: "GRUPO 3 - PSS",
    description: "Primeiros Socorros e Saúde",
    questionCount: 300  // 300 questões processadas (100% sucesso) ✅
  },
  "cga": {
    name: "GRUPO 4 - CGA",
    description: "Conhecimentos Gerais de Aeronaves",
    questionCount: 250  // 250 questões processadas (100% sucesso) ✅
  },
  "misto": {
    name: "Quiz Misto",
    description: "Questões aleatórias de todos os grupos CMS ANAC",
    questionCount: 1270 // 1.270 questões validadas e limpas (99,1% de 1.281 oficiais)
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
