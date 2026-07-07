import StorageService from "./StorageService";
import type { Summary } from "../types";

/**
 * SummaryRepository: Manages AI-generated summaries
 */
class SummaryRepository {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService("summaries");
  }

  /**
   * Save a summary
   */
  saveSummary(summary: Summary): void {
    this.storage.set(`summary:${summary.articleId}`, summary);
  }

  /**
   * Get summary by article ID
   */
  getSummary(articleId: string): Summary | undefined {
    return this.storage.get<Summary>(`summary:${articleId}`);
  }

  /**
   * Get all summaries
   */
  getAll(): Summary[] {
    const summaries: Summary[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith("summaries:summary:")) {
        const summary = this.storage.get<Summary>(
          key.replace("summaries:", "")
        );
        if (summary) {
          summaries.push(summary);
        }
      }
    }
    return summaries;
  }

  /**
   * Delete a summary
   */
  deleteSummary(articleId: string): void {
    this.storage.remove(`summary:${articleId}`);
  }

  /**
   * Check if summary exists
   */
  hasSummary(articleId: string): boolean {
    return this.getSummary(articleId) !== undefined;
  }

  /**
   * Clear all summaries
   */
  clear(): void {
    const summaries = this.getAll();
    summaries.forEach((s) => this.deleteSummary(s.articleId));
  }
}

export default SummaryRepository;
