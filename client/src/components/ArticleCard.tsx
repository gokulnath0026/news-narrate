import { motion } from "framer-motion";
import { Bookmark, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Caption, Muted } from "@/components/shared/Typography";
import { calculateReadingTime, formatDate, extractDomain } from "@/lib/utils/index";
import type { Article } from "@/lib/types/index";

interface ArticleCardProps {
  article: Article;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onSummarize?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export function ArticleCard({
  article,
  isBookmarked = false,
  onBookmark,
  onSummarize,
  onShare,
  onClick,
}: ArticleCardProps) {
  const readingTime = calculateReadingTime(article.content || article.description);
  const domain = extractDomain(article.url);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer rounded-xl border border-border bg-background hover:bg-muted/50 overflow-hidden transition-colors"
      onClick={onClick}
    >
      {/* Image */}
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <motion.img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Muted className="text-xs">{domain}</Muted>
            <span className="text-foreground/30">•</span>
            <Muted className="text-xs">{formatDate(article.publishedAt)}</Muted>
          </div>
          {article.category && (
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold line-clamp-2 mb-2 group-hover:text-foreground/80 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <Caption className="line-clamp-2 mb-4 text-foreground/60">
          {article.description}
        </Caption>

        {/* Reading time */}
        <div className="flex items-center gap-2 mb-4 text-xs text-foreground/50">
          <span>{readingTime} min read</span>
          {article.author && (
            <>
              <span>•</span>
              <span className="line-clamp-1">{article.author}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 justify-start"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
          >
            <Bookmark
              className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 justify-start"
            onClick={(e) => {
              e.stopPropagation();
              onSummarize?.();
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Summarize
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
