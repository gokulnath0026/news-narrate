export const KEYBOARD_SHORTCUTS = {
  SEARCH_FOCUS: "/",
  SEARCH_MODAL: "cmd+k",
  BOOKMARK: "b",
  SUMMARIZE: "s",
  CLOSE: "escape",
} as const;

export const SHORTCUT_DESCRIPTIONS = {
  [KEYBOARD_SHORTCUTS.SEARCH_FOCUS]: "Focus search bar",
  [KEYBOARD_SHORTCUTS.SEARCH_MODAL]: "Open search modal",
  [KEYBOARD_SHORTCUTS.BOOKMARK]: "Bookmark article",
  [KEYBOARD_SHORTCUTS.SUMMARIZE]: "Summarize article",
  [KEYBOARD_SHORTCUTS.CLOSE]: "Close modal",
} as const;
