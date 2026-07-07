import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

export function StreamingText({
  text,
  isStreaming = false,
  className = "",
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [text, isStreaming]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayedText}
      {isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-1 h-5 bg-foreground ml-1"
        />
      )}
    </motion.div>
  );
}
