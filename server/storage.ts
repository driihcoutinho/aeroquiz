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
    // Carregar todas as 1.276 questões oficiais do CMS ANAC
    const aviationQuestions: InsertQuestion[] = allQuestions.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category,
      difficulty: "medium",
      explanation: "",
      timeLimit: 30,
      module: (q.module?.toLowerCase() || "misto") as QuizModule
    }));

    aviationQuestions.forEach(q => {
      const id = randomUUID();
      const question: Question = {
        ...q,
        id,
        module: q.module ?? "misto",
        moduleDescription: q.moduleDescription ?? null,
        explanation: q.explanation ?? null,
        timeLimit: q.timeLimit ?? 20,
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
