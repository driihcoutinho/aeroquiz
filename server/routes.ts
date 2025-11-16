import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { answerSubmissionSchema, quizResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/quiz/start", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      const selectedQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      const session = await storage.createQuizSession({
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        totalQuestions: selectedQuestions.length,
        questionIds: selectedQuestions.map(q => q.id),
        answers: [],
        isComplete: false,
      });

      const questionsWithoutAnswers = selectedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
      }));

      res.json({
        session,
        questions: questionsWithoutAnswers,
      });
    } catch (error) {
      console.error("Error starting quiz:", error);
      res.status(500).json({ error: "Failed to start quiz" });
    }
  });

  app.post("/api/quiz/answer", async (req, res) => {
    try {
      const validated = answerSubmissionSchema.parse(req.body);
      const { sessionId, questionIndex, selectedAnswer, timeSpent } = validated;

      const session = await storage.getQuizSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Quiz session not found" });
      }

      const questionId = session.questionIds[questionIndex];
      if (!questionId) {
        return res.status(400).json({ error: "Invalid question index" });
      }

      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const isCorrect = selectedAnswer >= 0 && selectedAnswer === question.correctAnswer;
      
      let pointsEarned = 0;
      if (isCorrect) {
        const maxPoints = 1000;
        const timeBonus = Math.max(0, Math.min(1, (question.timeLimit - timeSpent) / question.timeLimit));
        pointsEarned = Math.round(maxPoints * (0.5 + 0.5 * timeBonus));
      }

      const newAnswers = [...session.answers];
      newAnswers[questionIndex] = selectedAnswer.toString();

      const updatedSession = await storage.updateQuizSession(sessionId, {
        currentQuestionIndex: questionIndex + 1,
        score: session.score + pointsEarned,
        correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
        answers: newAnswers,
        isComplete: questionIndex + 1 >= session.totalQuestions,
        completedAt: questionIndex + 1 >= session.totalQuestions ? new Date() : session.completedAt,
      });

      const result = {
        isCorrect,
        correctAnswer: question.correctAnswer,
        pointsEarned,
        currentScore: updatedSession.score,
        explanation: question.explanation,
      };

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
