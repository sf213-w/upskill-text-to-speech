import { Router, type IRouter } from "express";
import { TranslateBody, TranslateResponse } from "@workspace/api-zod";
import { z } from "zod/v4";

const router: IRouter = Router();

router.post("/translate", async (req, res) => {
  const parseResult = TranslateBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { text, from, to } = parseResult.data;

  if (!text || text.trim().length === 0) {
    res.status(400).json({ error: "Text cannot be empty" });
    return;
  }

  try {
    const langpair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

    const response = await fetch(url);
    if (!response.ok) {
      req.log.warn({ status: response.status }, "MyMemory API returned non-OK status");
      res.status(502).json({ error: "Translation service unavailable" });
      return;
    }

    const data = await response.json() as {
      responseStatus: number;
      responseData: { translatedText: string };
    };

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      req.log.warn({ responseStatus: data.responseStatus }, "MyMemory API returned error status");
      res.status(502).json({ error: "Translation failed" });
      return;
    }

    const result = TranslateResponse.parse({
      translatedText: data.responseData.translatedText,
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Translation request failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
