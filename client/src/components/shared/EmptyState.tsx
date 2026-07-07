import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      {Icon && (
        <Icon className="w-12 h-12 text-foreground/30 mb-4" />
      )}
      <h3 className="font-serif text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-foreground/60 mb-6 max-w-sm">{description}</p>
      )}
      {children}
      {action && (
        <Button onClick={action.onClick} variant="outline" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
