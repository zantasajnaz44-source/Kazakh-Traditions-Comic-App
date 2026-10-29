import { Router, type IRouter } from "express";
import { GenerateTraditionComicBody, GenerateTraditionComicResponse } from "@workspace/api-zod";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const SYSTEM_INSTRUCTION = `
Сен — қазақ халқының салт-дәстүрлерін балалар мен ересектерге жеңіл әрі қызықты түрде түсіндіретін көмекшісің.
Әрқашан тек қазақ тілінде жауап бер. Жауапты мейірімді, түсінікті және мәдени тұрғыдан құрметпен жаз.
Пайдаланушы сұраған дәстүр туралы қысқа комикс сценарийін құр:
- Қысқаша амандасып, дәстүрдің атауын таныстыр.
- Дәл 3 кадр жаз. Әр кадрда «Суретте» және «Диалог» болсын.
- Соңында дәстүрдің мағынасы мен тәрбиелік мәнін 2–3 сөйлеммен түсіндір.
- Соңғы жолда оқырманға бір қысқа сұрақ қой.
Белгісіз деректерді ойдан шығарма; сенімді болмасаң, мұны қысқаша және ашық айт.
`;

router.post("/gemini/comic", async (req, res): Promise<void> => {
  const parsed = GenerateTraditionComicBody.safeParse(req.body);
  if (!parsed.success || parsed.data.tradition.trim().length < 2) {
    res.status(400).json({ error: "Дәстүрдің атауын кемінде екі таңбамен жазыңыз." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: parsed.data.tradition.trim() }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 8192,
      },
    });

    const result = GenerateTraditionComicResponse.safeParse({
      content: response.text?.trim() ?? "",
    });

    if (!result.success || !result.data.content) {
      req.log.warn("Gemini returned an empty comic response");
      res.status(502).json({ error: "Комиксті қазір жасау мүмкін болмады. Қайталап көріңіз." });
      return;
    }

    res.json(result.data);
  } catch (error) {
    req.log.error({ err: error }, "Gemini comic generation failed");
    res.status(502).json({ error: "Комиксті қазір жасау мүмкін болмады. Қайталап көріңіз." });
  }
});

export default router;
