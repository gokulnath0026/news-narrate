import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * Typewriter effect for text
 */
export function Typewriter({
  text,
  delay = 0,
  speed = 50,
  className,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const type = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(type, speed);
      } else {
        onComplete?.();
      }
    };

    timeout = setTimeout(type, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
}

interface BlinkingCursorProps {
  className?: string;
}

/**
 * Blinking cursor for typewriter effect
 */
export function BlinkingCursor({ className }: BlinkingCursorProps) {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={cn("inline-block w-0.5 h-6 bg-foreground ml-1", className)}
    />
  );
}

interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

/**
 * Text reveal animation (fade in word by word)
 */
export function TextReveal({ text, delay = 0, className }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.05,
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

/**
 * Count-up animation for numbers
 */
export function CountUp({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  className,
}: CountUpProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let animationFrameId: number;

    const startTime = Date.now() + delay * 1000;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      if (elapsed < 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const current = from + (to - from) * progress;
        setCount(Math.floor(current));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout);
    };
  }, [from, to, duration, delay]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}

interface GradualFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Gradual fade-in animation
 */
export function GradualFade({
  children,
  delay = 0,
  duration = 0.5,
  className,
}: GradualFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
