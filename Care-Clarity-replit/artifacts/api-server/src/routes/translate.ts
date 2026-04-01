import { Router, type IRouter } from "express";
import { TranslateTextBody, TranslateTextResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/translate", async (req, res) => {
  const parseResult = TranslateTextBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Solicitud inválida / Invalid request" });
    return;
  }

  const { text, from, to } = parseResult.data;

  if (!text.trim()) {
    res.status(400).json({ error: "El texto no puede estar vacío / Text cannot be empty" });
    return;
  }

  try {
    const langpair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      responseStatus: number;
      responseData: { translatedText: string };
    };

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory returned status: ${data.responseStatus}`);
    }

    const result = TranslateTextResponse.parse({
      translatedText: data.responseData.translatedText,
    });

    res.json(result);
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Error de traducción. Intente de nuevo. / Translation error. Please try again." });
  }
});

export default router;
