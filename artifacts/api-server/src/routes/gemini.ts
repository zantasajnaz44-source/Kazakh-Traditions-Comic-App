import { Router, type IRouter } from "express";
import {
  AnswerTraditionQuestionBody,
  AnswerTraditionQuestionResponse,
  GenerateTraditionComicBody,
} from "@workspace/api-zod";
import { answerTraditionQuestion, buildTraditionComic } from "../services/tradition-ai";

const router: IRouter = Router();

router.post("/gemini/comic", async (req, res): Promise<void> => {
  const parsed = GenerateTraditionComicBody.safeParse(req.body);
  if (!parsed.success || parsed.data.tradition.trim().length < 2) {
    res.status(400).json({ error: "Дәстүрдің атауын кемінде екі таңбамен жазыңыз." });
    return;
  }
  try {
    const startedAt = Date.now();
    const comic = await buildTraditionComic(parsed.data.tradition.trim());
    req.log.info({ durationMs: Date.now() - startedAt }, "Comic text and artwork generated in parallel");
    res.json(comic);
  } catch (error) {
    req.log.error({ err: error }, "Gemini comic generation failed");
    res.status(502).json({ error: "Комиксті қазір жасау мүмкін болмады. Қайталап көріңіз." });
  }
});

router.post("/gemini/answer", async (req, res): Promise<void> => {
  const parsed = AnswerTraditionQuestionBody.safeParse(req.body);
  if (!parsed.success || parsed.data.question.trim().length < 2) {
    res.status(400).json({ error: "Сұрағыңызды кемінде екі таңбамен жазыңыз." });
    return;
  }
  try {
    const result = await answerTraditionQuestion({
      ...parsed.data,
      question: parsed.data.question.trim(),
    });
    res.json(AnswerTraditionQuestionResponse.parse(result));
  } catch (error) {
    req.log.error({ err: error }, "Gemini tradition answer failed");
    res.status(502).json({ error: "ИИ қазір жауап бере алмады. Қайталап көріңіз." });
  }
});

export default router;
