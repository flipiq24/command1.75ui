import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useGuide } from '@/context/GuideContext';

/**
 * Hook that listens for user actions and advances the guide when appropriate.
 * Supports route changes, click events, and tab changes.
 */
export function useGuideTriggers() {
  const { isGuideEnabled, currentStep, nextStep, markStepComplete } = useGuide();
  const [location] = useLocation();
  const lastLocationRef = useRef(location);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced next step to prevent rapid step changes
  const debouncedNextStep = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      nextStep();
    }, 300);
  }, [nextStep]);

  // Handle route changes
  useEffect(() => {
    if (!isGuideEnabled || !currentStep?.trigger) {
      return;
    }

    const { trigger } = currentStep;

    // Only handle route-change triggers
    if (trigger.type !== 'route-change') {
      return;
    }

    // Check if route matches the expected target
    if (trigger.targetRoute) {
      const targetRoute = trigger.targetRoute;
      const currentRoute = location;

      // Handle route matching (exact match or starts with for dynamic routes)
      const routeMatches =
        currentRoute === targetRoute ||
        (targetRoute.includes(':') && currentRoute.startsWith(targetRoute.split(':')[0]));

      // Only advance if route changed to the target
      if (routeMatches && lastLocationRef.current !== location) {
        debouncedNextStep();
      }
    }

    lastLocationRef.current = location;
  }, [isGuideEnabled, currentStep, location, debouncedNextStep]);

  // Handle click events
  useEffect(() => {
    if (!isGuideEnabled || !currentStep?.trigger) {
      return;
    }

    const { trigger } = currentStep;

    // Only handle click triggers
    if (trigger.type !== 'click' || !trigger.targetSelector) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if clicked element matches the target selector
      if (target.matches(trigger.targetSelector!) || target.closest(trigger.targetSelector!)) {
        debouncedNextStep();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isGuideEnabled, currentStep, debouncedNextStep]);

  // Handle tab clicks (for Deal Review priority tabs, etc.)
  useEffect(() => {
    if (!isGuideEnabled || !currentStep?.trigger) {
      return;
    }

    const { trigger } = currentStep;

    // Only handle tab-click triggers
    if (trigger.type !== 'tab-click' || !trigger.targetTab) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;

      // Look for tab triggers (buttons/elements with data-tab or data-priority attributes)
      const tabElement = target.closest(`[data-tab="${trigger.targetTab}"], [data-priority="${trigger.targetTab}"], [data-value="${trigger.targetTab}"]`);

      if (tabElement) {
        debouncedNextStep();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isGuideEnabled, currentStep, debouncedNextStep]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return null;
}

export default useGuideTriggers;
