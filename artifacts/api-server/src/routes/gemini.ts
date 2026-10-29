import { Router, type IRouter } from "express";
import { GenerateTraditionComicBody, GenerateTraditionComicResponse } from "@workspace/api-zod";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

const SYSTEM_INSTRUCTION = `
Сен — қазақ халқының салт-дәстүрлерін балаларға қызықты комикс арқылы насихаттайтын әңгіме құрастырушысың.
Жауабың тек қазақ тілінде, жылы әрі мәдени тұрғыдан құрметті болсын.
Оқиғаның басты кейіпкерлері өзгермейді: кішкентай Айша және оның әжесі немесе атасы. Бір үлкен кісіні таңдап, барлық кадрда сол кейіпкерді сақта. Айша дәстүр туралы шынайы қызығушылықпен сұрақ қояды, ал үлкен кісі қысқа, мейірімді жауап береді.
Дәл 3 кадр құрастыр. Әр кадрда көріністі сипатта, содан кейін Айшаның және үлкен кісінің жеке-жеке табиғи репликаларын жаз. Баяндаушының монологымен алмастырма: оқиға сұрақ-жауап түрінде өрбісін.
Егер пайдаланушы нақты бір дәстүрді атаса, соны түсіндір. Егер тақырып жалпы қазақ дәстүрлері немесе оларды ұрпаққа жеткізу туралы болса, кең танылған бір дәстүрді мысал етіп таңдап, оны дәріптеудің маңызын оқиғаға табиғи түрде енгіз.
Соңында дәстүрдің мағынасы мен тәрбиелік мәнін 2–3 түсінікті сөйлеммен қорытындыла. Қорытынды дәстүрді құрметпен танып, кейінгі ұрпаққа жеткізуге жігерлендірсін. Одан кейін оқырманға бір қысқа сұрақ қой.
Белгісіз деректерді ойдан шығарма; сенімді болмасаң, мұны қысқаша әрі ашық айт.

Тек мына құрылымға сай жарамды JSON қайтар; Markdown және қосымша мәтін қоспа:
{
  "title": "дәстүр немесе оқиға атауы",
  "elderRole": "Әже",
  "panels": [
    { "scene": "көріністің қысқаша сипаттамасы", "girlLine": "Айша сұрағы", "elderLine": "әженің не атаның жауабы" },
    { "scene": "...", "girlLine": "...", "elderLine": "..." },
    { "scene": "...", "girlLine": "...", "elderLine": "..." }
  ],
  "meaning": "дәстүрдің мағынасы мен ұрпаққа жеткізудің мәні туралы 2–3 сөйлем",
  "closingQuestion": "оқырманға қысқа сұрақ"
}
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
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const rawContent = response.text?.trim() ?? "";
    const result = GenerateTraditionComicResponse.safeParse(JSON.parse(rawContent));

    if (
      !result.success ||
      !result.data.title ||
      !result.data.meaning ||
      !result.data.closingQuestion ||
      result.data.panels.length !== 3 ||
      result.data.panels.some(
        (panel) => !panel.scene || !panel.girlLine || !panel.elderLine,
      )
    ) {
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
