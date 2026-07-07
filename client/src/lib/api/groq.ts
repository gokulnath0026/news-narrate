/**
 * Groq client for AI summarization
 * Uses OpenAI-compatible API with streaming support
 */

import type { Summary } from "../types";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}

export class GroqClient {
  private apiKey: string;
  private baseURL: string = "https://api.groq.com/openai/v1";
  private model: string = "mixtral-8x7b-32768"; // Fast and capable

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate a summary with streaming
   */
  async *summarizeStream(
    title: string,
    content: string,
    url: string
  ): AsyncGenerator<Partial<Summary>, void, unknown> {
    const prompt = this.buildSummaryPrompt(title, content);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert news summarizer. Provide comprehensive, accurate summaries in valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body from Groq");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const chunk = JSON.parse(data) as GroqStreamChunk;
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                // Try to parse JSON chunks as they stream in
                const partial = this.parseStreamChunk(content);
                if (partial) {
                  yield partial;
                }
              }
            } catch (e) {
              // Ignore parsing errors for partial JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Groq summarization error:", error);
      throw error;
    }
  }

  /**
   * Generate a complete summary (non-streaming)
   */
  async summarize(
    title: string,
    content: string,
    url: string
  ): Promise<Summary> {
    const prompt = this.buildSummaryPrompt(title, content);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert news summarizer. Provide comprehensive, accurate summaries in valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content in Groq response");
      }

      const summary = JSON.parse(content) as Summary;
      summary.articleId = this.generateArticleId(url);
      summary.title = title;
      summary.url = url;
      summary.generatedAt = new Date().toISOString();

      return summary;
    } catch (error) {
      console.error("Groq summarization error:", error);
      throw error;
    }
  }

  /**
   * Build the summary prompt
   */
  private buildSummaryPrompt(title: string, content: string): string {
    return `Analyze the following news article and provide a comprehensive summary in JSON format.

Article Title: ${title}

Article Content:
${content}

Provide the summary as a JSON object with these exact fields:
{
  "oneSentence": "A single sentence summary",
  "tldr": "A brief TLDR (2-3 sentences)",
  "bulletPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "executiveSummary": "A detailed executive summary (3-4 paragraphs)",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "sentiment": "positive|neutral|negative",
  "bias": "high|medium|low",
  "importantNames": ["name1", "name2", "name3"],
  "importantCompanies": ["company1", "company2"],
  "timeline": ["event 1", "event 2"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "factCheckConfidence": 85,
  "actionItems": ["action 1", "action 2"]
}

Ensure all fields are present and the JSON is valid.`;
  }

  /**
   * Parse streaming chunk and extract partial summary
   */
  private parseStreamChunk(chunk: string): Partial<Summary> | null {
    try {
      // Try to extract JSON object from chunk
      const jsonMatch = chunk.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const partial = JSON.parse(jsonMatch[0]) as Partial<Summary>;
      return partial;
    } catch {
      return null;
    }
  }

  /**
   * Generate article ID from URL
   */
  private generateArticleId(url: string): string {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, "").substring(0, 20);
  }
}

/**
 * Create and export a singleton instance
 */
export function createGroqClient(apiKey: string): GroqClient {
  return new GroqClient(apiKey);
}
