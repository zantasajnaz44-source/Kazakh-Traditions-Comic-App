import { Router, type IRouter } from "express";
import { GenerateTraditionComicBody, GenerateTraditionComicResponse } from "@workspace/api-zod";
import { ai } from "@workspace/integrations-gemini-ai";
import { generateImage } from "@workspace/integrations-gemini-ai/image";
import { z } from "zod/v4";

const router: IRouter = Router();

const GeneratedComicDraftSchema = z.object({
  title: z.string().min(1),
  elderRole: z.enum(["Әже", "Ата"]),
  panels: z.array(
    z.object({
      scene: z.string().min(1),
      girlLine: z.string().min(1),
      elderLine: z.string().min(1),
    }),
  ).length(3),
  meaning: z.string().min(1),
  closingQuestion: z.string().min(1),
});

const SYSTEM_INSTRUCTION = `
Сен қазақ халқының дәстүрлерін балаларға мультфильм-комикс арқылы насихаттайтын әңгіме құрастырушысың.
Жауабың тек қазақ тілінде, жылы әрі мәдени тұрғыдан құрметті болсын.
Басты кейіпкерлер: кішкентай Айша және оның әжесі немесе атасы. Бір үлкен кісіні таңдап, үш кадрда да сол кейіпкерді сақта. Айша шынайы сұрақ қояды, үлкен кісі қарапайым әрі мейірімді жауап береді. Әңгіме монолог емес, олардың кезектескен сұрақ-жауабы болсын.
Дәл 3 кадр жаз. Әр кадрда қысқа, көзге елестейтін көрініс сипаттамасы, Айшаның репликасы және үлкен кісінің репликасы болсын.
Егер тақырып бесікке салу болса, elderRole мәні «Әже» болсын және оқиға киіз үйде өтсін. Бірінші кадрда Айшаның girlLine репликасы дәл мынадай болсын: «Әже, баланы бесікке салып, неге бауын байлаймыз?» Әженің elderLine репликасы: «Бесік сәбидің тыныш ұйықтауына көмектеседі. “Жолы жарық болсын” деп ақ тілегімізді айтамыз. Бауды жайлы, қатты қыспай байлаймыз.» Бала жайлы жатсын, жанында ересек адам болсын. Денсаулыққа қатысты дәлелсіз уәде қоспа.
Басқа дәстүрлерде де қазақы ортаны — киіз үй, шаңырақ, сырмақ пен ою-өрнекті — дәстүрге сай және табиғи қолданып, бір қазақы интерьерді үш кадр бойы сақта.
Пайдаланушы бір дәстүрді атаса, соны көрсет. Тақырып жалпы қазақ дәстүрлері болса, кең танылған бір дәстүрді мысал етіп таңда. Дәстүрді құрметтеуге, оны кейінгі ұрпаққа жеткізуге жігерлендір.
Белгісіз мәдени деректерді ойдан шығарма.

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
    const tradition = parsed.data.tradition.trim();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `Комикстің тақырыбы: ${tradition}` }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const rawContent = response.text?.trim() ?? "";
    const draft = GeneratedComicDraftSchema.safeParse(JSON.parse(rawContent));

    if (
      !draft.success ||
      draft.data.panels.some((panel) => !panel.scene || !panel.girlLine || !panel.elderLine)
    ) {
      req.log.warn("Gemini returned an invalid comic draft");
      res.status(502).json({ error: "Комиксті қазір жасау мүмкін болмады. Қайталап көріңіз." });
      return;
    }

    const besikTopic = tradition.toLocaleLowerCase().includes("бесік");
    const imagePrompt = `
Create a polished, richly colored, child-friendly hand-drawn cartoon comic illustration with expressive faces and bold clean outlines. Use a square 2-by-2 grid of equal panels, with ONLY THREE story panels: top-left is panel 1, top-right is panel 2, bottom-left is panel 3. The bottom-right square must be completely blank cream paper with no drawing. The app will display only the first three squares in story order.
The same little Kazakh girl, Aisha, and the same ${draft.data.elderRole === "Әже" ? "grandmother" : "grandfather"} appear in all three story panels and are visibly talking to each other. The background is an authentic, richly detailed Kazakh киіз үй interior throughout: visible шаңырақ, patterned сырмақ, traditional woven ornaments, cushions, and warm natural light. Keep cultural details respectful and consistent. ${besikTopic ? "The story is Бесікке салу: show a traditional wooden бесік beside the characters and a baby resting comfortably and safely in it; the grandmother supervises the baby. Do not depict tight restraint." : ""}
Panel 1: ${draft.data.panels[0].scene}
Panel 2: ${draft.data.panels[1].scene}
Panel 3: ${draft.data.panels[2].scene}
Make the three scenes read as a clear beginning, middle, and ending. Leave faces and important action unobstructed. Do not draw any words, letters, captions, speech balloons, logos, or watermarks; the exact dialogue will be displayed in speech bubbles beside each panel in the app.
`;
    const image = await generateImage(imagePrompt);
    const result = GenerateTraditionComicResponse.safeParse({
      ...draft.data,
      comicImageData: image.b64_json,
      comicImageMimeType: image.mimeType,
    });

    if (!result.success) {
      req.log.warn("Generated comic image did not match the API response contract");
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
