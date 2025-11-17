import { type Question, type InsertQuestion, type QuizSession, type InsertQuizSession, type QuizModule } from "@shared/schema";
import { randomUUID } from "crypto";
import { allQuestions } from "@shared/data/questions";

export interface IStorage {
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByModule(module: QuizModule): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  getQuizSession(id: string): Promise<QuizSession | undefined>;
  updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession>;
}

export class MemStorage implements IStorage {
  private questions: Map<string, Question>;
  private quizSessions: Map<string, QuizSession>;

  constructor() {
    this.questions = new Map();
    this.quizSessions = new Map();
    this.seedQuestions();
  }

  private seedQuestions() {
    // Carregar todas as 1.270 questões oficiais do CMS ANAC com metadados corretos
    // Usamos IDs estáveis baseados em módulo + número para evitar duplicação
    allQuestions.forEach(q => {
      // ID estável: "ess-1", "rpa-2", etc.
      const module = (q.module?.toLowerCase() || "misto");
      const id = `${module}-${q.id}`;
      
      const question: Question = {
        id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        category: q.category,
        difficulty: "medium",  // Dados oficiais não têm dificuldade
        explanation: null,  // Dados oficiais não têm explicação
        timeLimit: 30,  // Tempo padrão de 30 segundos
        module: module as QuizModule,
        moduleDescription: null,
      };
      
      this.questions.set(id, question);
    });
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByModule(module: QuizModule): Promise<Question[]> {
    const allQuestions = Array.from(this.questions.values());
    
    if (module === "misto") {
      return allQuestions;
    }
    
    return allQuestions.filter(q => q.module === module);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      module: insertQuestion.module ?? "misto",
      moduleDescription: insertQuestion.moduleDescription ?? null,
      explanation: insertQuestion.explanation ?? null,
      timeLimit: insertQuestion.timeLimit ?? 20,
    };
    this.questions.set(id, question);
    return question;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = randomUUID();
    const session: QuizSession = {
      ...insertSession,
      id,
      startedAt: new Date(),
      completedAt: null,
      module: insertSession.module ?? "misto",
      currentQuestionIndex: insertSession.currentQuestionIndex ?? 0,
      score: insertSession.score ?? 0,
      correctAnswers: insertSession.correctAnswers ?? 0,
      isComplete: insertSession.isComplete ?? false,
    };
    this.quizSessions.set(id, session);
    return session;
  }

  async getQuizSession(id: string): Promise<QuizSession | undefined> {
    return this.quizSessions.get(id);
  }

  async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession> {
    const session = this.quizSessions.get(id);
    if (!session) {
      throw new Error("Quiz session not found");
    }
    const updatedSession = { ...session, ...updates };
    this.quizSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
