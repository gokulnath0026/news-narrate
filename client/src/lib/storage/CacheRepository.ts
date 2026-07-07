import StorageService from "./StorageService";
import type { CacheEntry, Article } from "../types";

/**
 * CacheRepository: Manages API response caching with TTL
 * Auto-evicts oldest entries when approaching 4MB limit
 */
class CacheRepository {
  private storage: StorageService;
  private readonly MAX_SIZE = 4 * 1024 * 1024; // 4MB
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.storage = new StorageService("cache");
  }

  /**
   * Get cached articles by category
   */
  getArticles(
    category: string,
    page: number = 1
  ): Article[] | undefined {
    const key = `articles:${category}:${page}`;
    const entry = this.storage.get<CacheEntry<Article[]>>(key);

    if (!entry) return undefined;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.storage.remove(key);
      return undefined;
    }

    return entry.data;
  }

  /**
   * Set cached articles
   */
  setArticles(
    category: string,
    page: number,
    articles: Article[],
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = `articles:${category}:${page}`;
    const entry: CacheEntry<Article[]> = {
      data: articles,
      timestamp: Date.now(),
      ttl,
    };

    // Check if we need to evict old entries
    if (this.storage.getSize() > this.MAX_SIZE * 0.8) {
      this.evictOldest();
    }

    this.storage.set(key, entry);
  }

  /**
   * Get cached search results
   */
  getSearchResults(query: string): Article[] | undefined {
    const key = `search:${query}`;
    const entry = this.storage.get<CacheEntry<Article[]>>(key);

    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.storage.remove(key);
      return undefined;
    }

    return entry.data;
  }

  /**
   * Set cached search results
   */
  setSearchResults(
    query: string,
    articles: Article[],
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = `search:${query}`;
    const entry: CacheEntry<Article[]> = {
      data: articles,
      timestamp: Date.now(),
      ttl,
    };

    if (this.storage.getSize() > this.MAX_SIZE * 0.8) {
      this.evictOldest();
    }

    this.storage.set(key, entry);
  }

  /**
   * Get single article
   */
  getArticle(articleId: string): Article | undefined {
    const key = `article:${articleId}`;
    const entry = this.storage.get<CacheEntry<Article>>(key);

    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.storage.remove(key);
      return undefined;
    }

    return entry.data;
  }

  /**
   * Set single article
   */
  setArticle(
    articleId: string,
    article: Article,
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = `article:${articleId}`;
    const entry: CacheEntry<Article> = {
      data: article,
      timestamp: Date.now(),
      ttl,
    };

    if (this.storage.getSize() > this.MAX_SIZE * 0.8) {
      this.evictOldest();
    }

    this.storage.set(key, entry);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Evict oldest cache entries (LRU)
   */
  private evictOldest(): void {
    // Simple implementation: get all keys and sort by timestamp
    const entries: Array<{ key: string; timestamp: number }> = [];

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith("cache:")) {
        const storageKey = key.replace("cache:", "");
        const entry = this.storage.get<CacheEntry<any>>(storageKey);
        if (entry) {
          entries.push({ key: storageKey, timestamp: entry.timestamp });
        }
      }
    }

    // Sort by timestamp (oldest first) and remove 25% of oldest entries
    entries.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = Math.ceil(entries.length * 0.25);

    for (let i = 0; i < toRemove; i++) {
      this.storage.remove(entries[i].key);
    }
  }
}

export default CacheRepository;
