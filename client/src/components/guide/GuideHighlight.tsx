import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuide } from '@/context/GuideContext';

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function GuideHighlight() {
  const { isGuideEnabled, currentStep } = useGuide();
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateHighlight = useCallback(() => {
    if (!currentStep?.highlightSelector) {
      setHighlightRect(null);
      setIsVisible(false);
      return;
    }

    const element = document.querySelector(currentStep.highlightSelector);
    if (element) {
      const rect = element.getBoundingClientRect();

      // Add some padding around the element
      const padding = 4;
      setHighlightRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
      setIsVisible(true);
    } else {
      setHighlightRect(null);
      setIsVisible(false);
    }
  }, [currentStep?.highlightSelector]);

  // Update highlight position when step changes or on scroll/resize
  useEffect(() => {
    if (!isGuideEnabled) {
      setHighlightRect(null);
      setIsVisible(false);
      return;
    }

    // Initial update
    updateHighlight();

    // Debounced update on scroll/resize
    let timeoutId: NodeJS.Timeout;
    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHighlight, 100);
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    // Also set up a MutationObserver to handle dynamic content
    const observer = new MutationObserver(() => {
      handleUpdate();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
    };
  }, [isGuideEnabled, currentStep, updateHighlight]);

  if (!isGuideEnabled || !highlightRect || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Overlay with cutout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(
            ellipse at ${highlightRect.left + highlightRect.width / 2}px ${highlightRect.top + highlightRect.height / 2}px,
            transparent ${Math.max(highlightRect.width, highlightRect.height) / 2}px,
            rgba(0, 0, 0, 0.15) ${Math.max(highlightRect.width, highlightRect.height) / 2 + 100}px
          )`,
        }}
      />

      {/* Highlight border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed pointer-events-none z-31"
        style={{
          top: highlightRect.top,
          left: highlightRect.left,
          width: highlightRect.width,
          height: highlightRect.height,
        }}
      >
        {/* Pulsing border */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 2px #FF6600, 0 0 0 4px rgba(255, 102, 0, 0.3)',
              '0 0 0 3px #FF6600, 0 0 0 8px rgba(255, 102, 0, 0.2)',
              '0 0 0 2px #FF6600, 0 0 0 4px rgba(255, 102, 0, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-lg"
        />
      </motion.div>

      {/* Arrow pointing to element (appears on the left side of the highlight) */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed pointer-events-none z-31"
        style={{
          top: highlightRect.top + highlightRect.height / 2 - 12,
          left: highlightRect.left - 32,
        }}
      >
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex items-center"
        >
          <div className="w-6 h-6 bg-[#FF6600] rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
