import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants/categories";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "border border-border hover:bg-muted"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{category.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
