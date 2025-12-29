import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-github-canvas-subtle border border-github-border-default rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-github-border-default bg-github-canvas-default">
                <h2 className="text-lg font-semibold text-github-fg-default">
                  About GitHub Wrapped
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-github-canvas-subtle text-github-fg-muted hover:text-github-fg-default transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 text-github-fg-default">
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed">
                    GitHub Wrapped visualizes your coding journey over the past year. 
                    See your top languages, longest streaks, and coding persona in a shareable format.
                  </p>
                </div>

                {/* Unofficial Disclaimer */}
                <div className="bg-github-canvas-inset border border-github-border-muted rounded-lg p-4">
                  <p className="text-xs text-github-fg-muted">
                    <span className="font-semibold text-github-fg-default block mb-1">Unofficial Project</span>
                    This application is developed by Minagishl and is not affiliated with, endorsed, or sponsored by GitHub, Inc.
                  </p>
                </div>

                {/* PAT Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Privacy & Security
                  </h3>
                  <p className="text-xs text-github-fg-muted leading-relaxed">
                    We prioritize your privacy. Your Personal Access Token (PAT) is used solely to fetch your data directly from the GitHub API. 
                    <span className="text-github-fg-default font-medium block mt-1">
                      Your token is never stored on our servers.
                    </span>
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-github-border-default flex justify-center">
                  <a
                    href="https://github.com/minagishl/github-wrapped"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-github-fg-muted hover:text-github-accent-fg transition-colors hover:underline"
                  >
                    View Source Code
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
