/**
 * Custom React hooks for Narrate
 */

import { useEffect, useState, useCallback, useRef } from "react";
import type {
  Article,
  Bookmark,
  Summary,
  HistoryEntry,
  UserPreferences,
  SearchHistoryEntry,
} from "../types";
import BookmarksRepository from "../storage/BookmarksRepository";
import SummaryRepository from "../storage/SummaryRepository";
import HistoryRepository from "../storage/HistoryRepository";
import PreferencesRepository from "../storage/PreferencesRepository";
import CacheRepository from "../storage/CacheRepository";

const bookmarksRepo = new BookmarksRepository();
const summaryRepo = new SummaryRepository();
const historyRepo = new HistoryRepository();
const preferencesRepo = new PreferencesRepository();
const cacheRepo = new CacheRepository();

/**
 * useBookmarks: Manage bookmarks
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const refresh = useCallback(() => {
    setBookmarks(bookmarksRepo.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBookmark = useCallback((article: Article, folderId?: string) => {
    bookmarksRepo.addBookmark(article, folderId);
    refresh();
  }, [refresh]);

  const removeBookmark = useCallback((bookmarkId: string) => {
    bookmarksRepo.removeBookmark(bookmarkId);
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (articleUrl: string) => bookmarksRepo.isBookmarked(articleUrl),
    []
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, refresh };
}

/**
 * useSummary: Manage summaries
 */
export function useSummary() {
  const [summaries, setSummaries] = useState<Summary[]>([]);

  const refresh = useCallback(() => {
    setSummaries(summaryRepo.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSummary = useCallback((summary: Summary) => {
    summaryRepo.saveSummary(summary);
    refresh();
  }, [refresh]);

  const getSummary = useCallback(
    (articleId: string) => summaryRepo.getSummary(articleId),
    []
  );

  const hasSummary = useCallback(
    (articleId: string) => summaryRepo.hasSummary(articleId),
    []
  );

  return { summaries, saveSummary, getSummary, hasSummary, refresh };
}

/**
 * useHistory: Manage history
 */
export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setHistory(historyRepo.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addReadingEntry = useCallback((article: Article) => {
    historyRepo.addReadingEntry(article);
    refresh();
  }, [refresh]);

  const addSummaryEntry = useCallback((article: Article, summary: Summary) => {
    historyRepo.addSummaryEntry(article, summary);
    refresh();
  }, [refresh]);

  const deleteEntry = useCallback((entryId: string) => {
    historyRepo.deleteEntry(entryId);
    refresh();
  }, [refresh]);

  return { history, addReadingEntry, addSummaryEntry, deleteEntry, refresh };
}

/**
 * usePreferences: Manage user preferences
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    preferencesRepo.getAll()
  );

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      const updated = preferencesRepo.update(updates);
      setPreferences(updated);
    },
    []
  );

  const setTheme = useCallback((theme: "light" | "dark") => {
    preferencesRepo.setTheme(theme);
    setPreferences(preferencesRepo.getAll());
  }, []);

  return { preferences, updatePreferences, setTheme };
}

/**
 * useKeyboardShortcuts: Handle keyboard shortcuts
 */
export function useKeyboardShortcuts(
  handlers: Record<string, (() => void) | undefined>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCmd = e.metaKey || e.ctrlKey;

      // Cmd+K for search modal
      if (isCmd && key === "k") {
        e.preventDefault();
        handlers["search-modal"]?.();
      }

      // / for search focus
      if (key === "/" && !isCmd) {
        e.preventDefault();
        handlers["search-focus"]?.();
      }

      // B for bookmark
      if (key === "b" && !isCmd) {
        e.preventDefault();
        handlers["bookmark"]?.();
      }

      // S for summarize
      if (key === "s" && !isCmd) {
        e.preventDefault();
        handlers["summarize"]?.();
      }

      // Escape to close
      if (key === "escape") {
        handlers["close"]?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}

/**
 * useDebounce: Debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useInfiniteScroll: Infinite scroll pagination
 */
export function useInfiniteScroll(
  fetchMore: () => Promise<void>,
  hasMore: boolean
) {
  const observerTarget = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          await fetchMore();
          setIsLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchMore, hasMore, isLoading]);

  return { observerTarget, isLoading };
}

/**
 * useLocalStorage: Sync state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          typeof value === "function" ? (value as (val: T) => T)(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error("useLocalStorage error:", error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * useOnline: Detect online/offline status
 */
export function useOnline() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * usePrevious: Get previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
