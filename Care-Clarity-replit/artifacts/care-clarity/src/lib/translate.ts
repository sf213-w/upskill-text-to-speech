import { translateText as apiTranslate } from "@workspace/api-client-react";

/**
 * Robust translation utility that tries the backend API first,
 * and falls back to a direct MyMemory fetch if the backend is unavailable
 * (e.g. missing implementation in MVP).
 */
export async function translate(text: string, from: 'es'|'en', to: 'es'|'en'): Promise<string> {
  if (!text.trim()) return "";
  
  try {
    // Attempt backend API (which has the Orval generated client)
    const res = await apiTranslate({ text, from, to });
    if (res && res.translatedText) {
      return res.translatedText;
    }
  } catch (err) {
    console.warn("Backend translation failed, falling back to direct MyMemory API", err);
  }

  // Direct Fallback to MyMemory API (Free, Keyless)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (fallbackErr) {
    console.error("Direct translation fallback also failed", fallbackErr);
  }

  return "Translation unavailable / Traducción no disponible";
}
