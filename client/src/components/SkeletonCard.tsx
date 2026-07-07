import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <motion.div
      className="rounded-xl border border-border bg-background overflow-hidden"
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />

      {/* Content skeleton */}
      <div className="p-4 space-y-4">
        {/* Meta */}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Reading time */}
        <Skeleton className="h-4 w-32" />

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-10" />
        </div>
      </div>
    </motion.div>
  );
}
