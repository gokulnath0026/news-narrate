import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Bookmark,
  History,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { usePreferences } from "@/lib/hooks";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { preferences, setTheme } = usePreferences();

  const handleNavClick = (href: string) => {
    navigate(href);
    onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background z-40 md:sticky md:top-0 md:z-0 overflow-y-auto"
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        exit={{ x: -256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-serif font-bold">
              N
            </div>
            <span className="font-serif font-bold">Narrate</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground/60 hover:bg-muted"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="border-t border-border pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(preferences.theme === "light" ? "dark" : "light")}
              className="w-full justify-start gap-3"
            >
              {preferences.theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
