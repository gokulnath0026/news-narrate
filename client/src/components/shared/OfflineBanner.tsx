import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-destructive/10 border-b border-destructive/20 px-4 py-3"
        >
          <div className="container flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm font-medium text-destructive">
                You're offline. Some features may be unavailable.
              </p>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 text-destructive hover:opacity-70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
