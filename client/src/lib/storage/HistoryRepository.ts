import StorageService from "./StorageService";
import type { HistoryEntry, Article, Summary } from "../types";
import { nanoid } from "nanoid";

/**
 * HistoryRepository: Manages reading and summary history
 */
class HistoryRepository {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService("history");
  }

  /**
   * Add a reading history entry
   */
  addReadingEntry(article: Article): HistoryEntry {
    const entry: HistoryEntry = {
      id: nanoid(),
      type: "read",
      article,
      timestamp: new Date().toISOString(),
    };

    const history = this.getAll();
    history.push(entry);
    this.storage.set("history", history);

    return entry;
  }

  /**
   * Add a summary history entry
   */
  addSummaryEntry(article: Article, summary: Summary): HistoryEntry {
    const entry: HistoryEntry = {
      id: nanoid(),
      type: "summarized",
      article,
      summary,
      timestamp: new Date().toISOString(),
    };

    const history = this.getAll();
    history.push(entry);
    this.storage.set("history", history);

    return entry;
  }

  /**
   * Get all history entries
   */
  getAll(): HistoryEntry[] {
    return this.storage.get<HistoryEntry[]>("history") ?? [];
  }

  /**
   * Get reading history only
   */
  getReadingHistory(): HistoryEntry[] {
    const history = this.getAll();
    return history.filter((e) => e.type === "read");
  }

  /**
   * Get summary history only
   */
  getSummaryHistory(): HistoryEntry[] {
    const history = this.getAll();
    return history.filter((e) => e.type === "summarized");
  }

  /**
   * Search history by article title or description
   */
  search(query: string): HistoryEntry[] {
    const history = this.getAll();
    const lowerQuery = query.toLowerCase();
    return history.filter(
      (e) =>
        e.article.title.toLowerCase().includes(lowerQuery) ||
        e.article.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Delete a history entry
   */
  deleteEntry(entryId: string): void {
    const history = this.getAll();
    const filtered = history.filter((e) => e.id !== entryId);
    this.storage.set("history", filtered);
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.storage.remove("history");
  }

  /**
   * Get history entries by date (returns entries from the last N days)
   */
  getByDaysAgo(days: number): HistoryEntry[] {
    const history = this.getAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return history.filter((e) => new Date(e.timestamp) >= cutoffDate);
  }
}

export default HistoryRepository;
