import StorageService from "./StorageService";
import type { UserPreferences } from "../types";

/**
 * PreferencesRepository: Manages user preferences
 */
class PreferencesRepository {
  private storage: StorageService;
  private readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: "light",
    defaultCountry: "us",
    preferredCategory: "general",
    readingLayout: "comfortable",
    fontSize: "medium",
  };

  constructor() {
    this.storage = new StorageService("preferences");
  }

  /**
   * Get all preferences
   */
  getAll(): UserPreferences {
    return (
      this.storage.get<UserPreferences>("preferences") ??
      this.DEFAULT_PREFERENCES
    );
  }

  /**
   * Update preferences
   */
  update(preferences: Partial<UserPreferences>): UserPreferences {
    const current = this.getAll();
    const updated = { ...current, ...preferences };
    this.storage.set("preferences", updated);
    return updated;
  }

  /**
   * Get theme
   */
  getTheme(): "light" | "dark" {
    return this.getAll().theme;
  }

  /**
   * Set theme
   */
  setTheme(theme: "light" | "dark"): void {
    this.update({ theme });
  }

  /**
   * Get default country
   */
  getDefaultCountry(): string {
    return this.getAll().defaultCountry;
  }

  /**
   * Set default country
   */
  setDefaultCountry(country: string): void {
    this.update({ defaultCountry: country });
  }

  /**
   * Get preferred category
   */
  getPreferredCategory(): string {
    return this.getAll().preferredCategory;
  }

  /**
   * Set preferred category
   */
  setPreferredCategory(category: string): void {
    this.update({ preferredCategory: category });
  }

  /**
   * Get reading layout
   */
  getReadingLayout(): "comfortable" | "compact" {
    return this.getAll().readingLayout;
  }

  /**
   * Set reading layout
   */
  setReadingLayout(layout: "comfortable" | "compact"): void {
    this.update({ readingLayout: layout });
  }

  /**
   * Get font size
   */
  getFontSize(): "small" | "medium" | "large" {
    return this.getAll().fontSize;
  }

  /**
   * Set font size
   */
  setFontSize(size: "small" | "medium" | "large"): void {
    this.update({ fontSize: size });
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.storage.set("preferences", this.DEFAULT_PREFERENCES);
  }
}

export default PreferencesRepository;
