import { type Question, type InsertQuestion, type QuizSession, type InsertQuizSession, type QuizModule } from "@shared/schema";
import { randomUUID } from "crypto";

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
    const aviationQuestions: InsertQuestion[] = [
      {
        question: "Qual é a altitude de transição no Brasil?",
        options: [
          "FL100 (10.000 pés)",
          "FL150 (15.000 pés)",
          "FL180 (18.000 pés)",
          "FL200 (20.000 pés)"
        ],
        correctAnswer: 2,
        category: "Regulamentos ANAC",
        difficulty: "medium",
        explanation: "No Brasil, a altitude de transição é FL180 (18.000 pés), acima da qual se usa nível de voo.",
        timeLimit: 20,
        module: "misto"
      },
      {
        question: "O que significa a sigla VMC em aviação?",
        options: [
          "Velocidade Mínima de Cruzeiro",
          "Condições Meteorológicas Visuais",
          "Velocidade Máxima de Comando",
          "Controle Mínimo Visível"
        ],
        correctAnswer: 1,
        category: "Meteorologia",
        difficulty: "easy",
        explanation: "VMC significa Visual Meteorological Conditions (Condições Meteorológicas Visuais).",
        timeLimit: 15,
        module: "misto"
      },
      {
        question: "Qual a velocidade do som ao nível do mar (Mach 1)?",
        options: [
          "661 nós",
          "761 nós",
          "861 nós",
          "961 nós"
        ],
        correctAnswer: 0,
        category: "Aerodinâmica",
        difficulty: "medium",
        explanation: "A velocidade do som ao nível do mar é aproximadamente 661 nós (1.225 km/h).",
        timeLimit: 20,
        module: "misto"
      },
      {
        question: "O que é o efeito de solo em aviação?",
        options: [
          "Aumento do arrasto na decolagem",
          "Redução da sustentação próximo ao solo",
          "Aumento da sustentação próximo ao solo",
          "Turbulência causada pelo solo aquecido"
        ],
        correctAnswer: 2,
        category: "Aerodinâmica",
        difficulty: "medium",
        explanation: "O efeito de solo aumenta a sustentação quando a aeronave está próxima ao solo, devido à redução do arrasto induzido.",
        timeLimit: 20,
        module: "misto"
      },
      {
        question: "Qual a frequência de emergência internacional?",
        options: [
          "121.5 MHz",
          "123.5 MHz",
          "125.5 MHz",
          "127.5 MHz"
        ],
        correctAnswer: 0,
        category: "Navegação",
        difficulty: "easy",
        explanation: "121.5 MHz é a frequência internacional de emergência para aviação civil.",
        timeLimit: 15,
        module: "misto"
      },
      {
        question: "O que significa a luz vermelha constante da torre de controle?",
        options: [
          "Prossiga com cautela",
          "Dê passagem a outras aeronaves",
          "Afaste-se da área do aeroporto",
          "Pare imediatamente"
        ],
        correctAnswer: 1,
        category: "Procedimentos",
        difficulty: "hard",
        explanation: "Luz vermelha constante significa: em voo - dê passagem a outras aeronaves e continue circulando; no solo - pare.",
        timeLimit: 25,
        module: "misto"
      },
      {
        question: "Qual a visibilidade mínima para voo VFR diurno abaixo de 10.000 pés?",
        options: [
          "3 km",
          "5 km",
          "8 km",
          "10 km"
        ],
        correctAnswer: 1,
        category: "Meteorologia",
        difficulty: "medium",
        explanation: "A visibilidade mínima para voo VFR diurno abaixo de 10.000 pés é de 5 km.",
        timeLimit: 20,
        module: "misto"
      },
      {
        question: "O que é o número de Mach?",
        options: [
          "A velocidade em relação ao solo",
          "A razão entre a velocidade da aeronave e a velocidade do som",
          "A altitude máxima de operação",
          "A pressão atmosférica em altitude"
        ],
        correctAnswer: 1,
        category: "Aerodinâmica",
        difficulty: "easy",
        explanation: "O número de Mach é a razão entre a velocidade da aeronave e a velocidade do som no meio em que ela está voando.",
        timeLimit: 15,
        module: "misto"
      },
      {
        question: "Qual o significado da marcação de pista 09/27?",
        options: [
          "Pista com 9.000 e 27.000 metros",
          "Rumo magnético de 90° e 270°",
          "Altitude de 9.000 e 27.000 pés",
          "Largura de 90 e 270 metros"
        ],
        correctAnswer: 1,
        category: "Navegação",
        difficulty: "medium",
        explanation: "09/27 indica que a pista pode ser usada no rumo magnético 090° (leste) ou 270° (oeste).",
        timeLimit: 20,
        module: "misto"
      },
      {
        question: "O que é hipóxia em aviação?",
        options: [
          "Excesso de oxigênio no sangue",
          "Falta de oxigênio nos tecidos do corpo",
          "Pressão excessiva nos ouvidos",
          "Desorientação espacial"
        ],
        correctAnswer: 1,
        category: "Fisiologia de Voo",
        difficulty: "easy",
        explanation: "Hipóxia é a deficiência de oxigênio nos tecidos do corpo, comum em voos em grandes altitudes sem pressurização adequada.",
        timeLimit: 15,
        module: "misto"
      }
    ];

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
