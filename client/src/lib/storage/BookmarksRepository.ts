import StorageService from "./StorageService";
import type { Bookmark, BookmarkFolder, Article } from "../types";
import { nanoid } from "nanoid";

/**
 * BookmarksRepository: Manages bookmarks with folder organization
 */
class BookmarksRepository {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService("bookmarks");
  }

  /**
   * Add a bookmark
   */
  addBookmark(article: Article, folderId?: string): Bookmark {
    const id = nanoid();
    const bookmark: Bookmark = {
      id,
      article,
      folderId,
      createdAt: new Date().toISOString(),
    };

    const bookmarks = this.getAll();
    bookmarks.push(bookmark);
    this.storage.set("bookmarks", bookmarks);

    return bookmark;
  }

  /**
   * Remove a bookmark
   */
  removeBookmark(bookmarkId: string): void {
    const bookmarks = this.getAll();
    const filtered = bookmarks.filter((b) => b.id !== bookmarkId);
    this.storage.set("bookmarks", filtered);
  }

  /**
   * Get all bookmarks
   */
  getAll(): Bookmark[] {
    return this.storage.get<Bookmark[]>("bookmarks") ?? [];
  }

  /**
   * Get bookmarks by folder
   */
  getByFolder(folderId: string): Bookmark[] {
    const bookmarks = this.getAll();
    return bookmarks.filter((b) => b.folderId === folderId);
  }

  /**
   * Get bookmarks without folder
   */
  getUncategorized(): Bookmark[] {
    const bookmarks = this.getAll();
    return bookmarks.filter((b) => !b.folderId);
  }

  /**
   * Search bookmarks by title or description
   */
  search(query: string): Bookmark[] {
    const bookmarks = this.getAll();
    const lowerQuery = query.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.article.title.toLowerCase().includes(lowerQuery) ||
        b.article.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Check if article is bookmarked
   */
  isBookmarked(articleUrl: string): boolean {
    const bookmarks = this.getAll();
    return bookmarks.some((b) => b.article.url === articleUrl);
  }

  /**
   * Get bookmark by article URL
   */
  getByArticleUrl(articleUrl: string): Bookmark | undefined {
    const bookmarks = this.getAll();
    return bookmarks.find((b) => b.article.url === articleUrl);
  }

  /**
   * Create a folder
   */
  createFolder(name: string): BookmarkFolder {
    const id = nanoid();
    const folder: BookmarkFolder = {
      id,
      name,
      createdAt: new Date().toISOString(),
    };

    const folders = this.getFolders();
    folders.push(folder);
    this.storage.set("folders", folders);

    return folder;
  }

  /**
   * Delete a folder
   */
  deleteFolder(folderId: string): void {
    const folders = this.getFolders();
    const filtered = folders.filter((f) => f.id !== folderId);
    this.storage.set("folders", filtered);

    // Move bookmarks from this folder to uncategorized
    const bookmarks = this.getAll();
    const updated = bookmarks.map((b) =>
      b.folderId === folderId ? { ...b, folderId: undefined } : b
    );
    this.storage.set("bookmarks", updated);
  }

  /**
   * Rename a folder
   */
  renameFolder(folderId: string, newName: string): void {
    const folders = this.getFolders();
    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, name: newName } : f
    );
    this.storage.set("folders", updated);
  }

  /**
   * Get all folders
   */
  getFolders(): BookmarkFolder[] {
    return this.storage.get<BookmarkFolder[]>("folders") ?? [];
  }

  /**
   * Move bookmark to folder
   */
  moveToFolder(bookmarkId: string, folderId?: string): void {
    const bookmarks = this.getAll();
    const updated = bookmarks.map((b) =>
      b.id === bookmarkId ? { ...b, folderId } : b
    );
    this.storage.set("bookmarks", updated);
  }

  /**
   * Clear all bookmarks
   */
  clear(): void {
    this.storage.remove("bookmarks");
    this.storage.remove("folders");
  }
}

export default BookmarksRepository;
