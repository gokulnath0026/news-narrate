import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headline, Body, Caption } from "@/components/shared/Typography";
import { StreamingText } from "./StreamingText";
import type { Summary } from "@/lib/types/index";

interface SummaryPanelProps {
  summary?: Summary;
  isLoading?: boolean;
  isStreaming?: boolean;
  onClose?: () => void;
  onSummarize?: () => void;
}

const sentimentColors = {
  positive: "bg-green-100 text-green-900",
  neutral: "bg-gray-100 text-gray-900",
  negative: "bg-red-100 text-red-900",
};

const biasColors = {
  high: "bg-red-100 text-red-900",
  medium: "bg-yellow-100 text-yellow-900",
  low: "bg-green-100 text-green-900",
};

export function SummaryPanel({
  summary,
  isLoading = false,
  isStreaming = false,
  onClose,
  onSummarize,
}: SummaryPanelProps) {
  return (
    <AnimatePresence>
      {(summary || isLoading) && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-screen w-full md:w-96 bg-background border-l border-border overflow-y-auto z-40"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Headline className="text-lg">Summary</Headline>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isLoading && !summary ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-foreground/60" />
                <Caption className="text-foreground/60">
                  Generating summary...
                </Caption>
              </div>
            ) : summary ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* One sentence */}
                {summary.oneSentence && (
                  <div>
                    <Caption className="font-semibold mb-2 text-foreground/70">
                      Summary
                    </Caption>
                    <Body className="text-foreground/80">
                      {summary.oneSentence}
                    </Body>
                  </div>
                )}

                {/* TLDR */}
                {summary.tldr && (
                  <div>
                    <Caption className="font-semibold mb-2 text-foreground/70">
                      TLDR
                    </Caption>
                    <Body className="text-foreground/80 text-sm">
                      {summary.tldr}
                    </Body>
                  </div>
                )}

                {/* Bullet points */}
                {summary.bulletPoints && summary.bulletPoints.length > 0 && (
                  <div>
                    <Caption className="font-semibold mb-2 text-foreground/70">
                      Key Points
                    </Caption>
                    <ul className="space-y-2">
                      {summary.bulletPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-foreground/70 flex gap-2"
                        >
                          <span className="text-foreground/40">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {summary.sentiment && (
                    <Badge
                      className={`${sentimentColors[summary.sentiment]}`}
                    >
                      {summary.sentiment.charAt(0).toUpperCase() +
                        summary.sentiment.slice(1)}
                    </Badge>
                  )}
                  {summary.bias && (
                    <Badge className={`${biasColors[summary.bias]}`}>
                      Bias: {summary.bias}
                    </Badge>
                  )}
                  {summary.factCheckConfidence && (
                    <Badge variant="outline">
                      Confidence: {summary.factCheckConfidence}%
                    </Badge>
                  )}
                </div>

                {/* Keywords */}
                {summary.keywords && summary.keywords.length > 0 && (
                  <div>
                    <Caption className="font-semibold mb-2 text-foreground/70">
                      Keywords
                    </Caption>
                    <div className="flex flex-wrap gap-2">
                      {summary.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Names & Companies */}
                {summary.importantNames && summary.importantNames.length > 0 && (
                  <div>
                    <Caption className="font-semibold mb-2 text-foreground/70">
                      Important People
                    </Caption>
                    <p className="text-sm text-foreground/70">
                      {summary.importantNames.join(", ")}
                    </p>
                  </div>
                )}

                {summary.importantCompanies &&
                  summary.importantCompanies.length > 0 && (
                    <div>
                      <Caption className="font-semibold mb-2 text-foreground/70">
                        Companies
                      </Caption>
                      <p className="text-sm text-foreground/70">
                        {summary.importantCompanies.join(", ")}
                      </p>
                    </div>
                  )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Caption className="text-foreground/60 mb-4">
                  No summary yet. Click the button below to generate one.
                </Caption>
                <Button onClick={onSummarize} className="w-full">
                  Generate Summary
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
