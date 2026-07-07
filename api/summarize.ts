import type { VercelRequest, VercelResponse } from "@vercel/node";
import { summarizeArticle } from "../server/lib/groqClient";

/**
 * Vercel serverless function for POST /api/summarize
 * Mirrors the /api/summarize route in server/app.ts (used for Railway/Render/local dev).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { title, content, url } = req.body ?? {};

  if (typeof title !== "string" || typeof url !== "string") {
    res.status(400).json({ error: "title and url are required" });
    return;
  }

  try {
    const summary = await summarizeArticle(title, content ?? "", url);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("POST /api/summarize error:", error);
    res.status(502).json({ error: error instanceof Error ? error.message : "Failed to generate summary" });
  }
}
