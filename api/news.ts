import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchArticlesByCategory } from "../server/lib/newsClient.js";

/**
 * Vercel serverless function for GET /api/news
 * Mirrors the /api/news route in server/app.ts (used for Railway/Render/local dev).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const category = typeof req.query.category === "string" ? req.query.category : "latest";
  const country = typeof req.query.country === "string" ? req.query.country : "us";
  const lang = typeof req.query.lang === "string" ? req.query.lang : "en";

  try {
    const articles = await fetchArticlesByCategory(category, country, lang);
    res.status(200).json({ articles });
  } catch (error) {
    console.error("GET /api/news error:", error);
    res.status(502).json({ error: error instanceof Error ? error.message : "Failed to fetch news" });
  }
}
