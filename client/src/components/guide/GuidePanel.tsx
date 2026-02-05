import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  ListTodo,
  Phone,
  BarChart2,
  CheckCircle,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { useGuide, GuidePhase } from '@/context/GuideContext';
import { getPhaseDisplayName } from '@/data/guideSteps';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Phase icons mapping
const phaseIcons: Record<GuidePhase, React.ReactNode> = {
  checkin: <Sun className="w-4 h-4" />,
  dealreview: <ListTodo className="w-4 h-4" />,
  outreach: <Phone className="w-4 h-4" />,
  stats: <BarChart2 className="w-4 h-4" />,
  complete: <CheckCircle className="w-4 h-4" />,
};

// Phase colors
const phaseColors: Record<GuidePhase, string> = {
  checkin: 'bg-amber-500',
  dealreview: 'bg-blue-500',
  outreach: 'bg-green-500',
  stats: 'bg-purple-500',
  complete: 'bg-emerald-500',
};

interface GuidePanelProps {
  className?: string;
}

export default function GuidePanel({ className }: GuidePanelProps) {
  const {
    isGuideEnabled,
    currentPhase,
    currentStepIndex,
    currentStep,
    totalStepsInPhase,
    overallProgress,
    toggleGuide,
    nextStep,
    prevStep,
    skipToPhase,
    resetGuide,
    completedSteps,
    allSteps,
  } = useGuide();

  // Parse markdown-like content for display
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers (bold text with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-bold text-gray-900 mt-4 mb-2">
            {line.slice(2, -2)}
          </h4>
        );
      }

      // Bold inline text
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // List items
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 text-gray-600 text-sm">
            {formattedParts.slice(1)}
          </li>
        );
      }

      // Numbered items
      const numberedMatch = line.match(/^(\d+)\.\s/);
      if (numberedMatch) {
        return (
          <li key={index} className="ml-4 text-gray-600 text-sm list-decimal">
            {formattedParts}
          </li>
        );
      }

      // Empty lines become spacing
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-600 text-sm leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  // Phase navigation pills
  const phases: GuidePhase[] = ['checkin', 'dealreview', 'outreach', 'stats', 'complete'];
  const currentPhaseIndex = phases.indexOf(currentPhase);

  if (!isGuideEnabled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed right-0 top-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-[#FF6600] to-[#FF8533] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="w-5 h-5" />
              <span className="font-bold text-lg">FlipIQ Guide</span>
            </div>
            <button
              onClick={toggleGuide}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-white/80 text-xs mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 bg-white/30" />
          </div>

          {/* Phase pills */}
          <div className="flex gap-1 mt-3">
            {phases.map((phase, index) => {
              const isActive = phase === currentPhase;
              const isCompleted = index < currentPhaseIndex;
              const phaseName = getPhaseDisplayName(phase);

              return (
                <button
                  key={phase}
                  onClick={() => skipToPhase(phase)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                    isActive
                      ? 'bg-white text-[#FF6600] shadow-sm'
                      : isCompleted
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  )}
                  title={phaseName}
                >
                  <div className="flex items-center justify-center gap-1">
                    {phaseIcons[phase]}
                    <span className="hidden lg:inline truncate">{phaseName.split(' ')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex-shrink-0 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold', phaseColors[currentPhase])}>
                {currentStepIndex + 1}
              </span>
              <div>
                <div className="text-xs text-gray-500">{getPhaseDisplayName(currentPhase)}</div>
                <div className="text-sm font-medium text-gray-900">
                  Step {currentStepIndex + 1} of {totalStepsInPhase}
                </div>
              </div>
            </div>
            <button
              onClick={resetGuide}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition"
              title="Reset guide"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {currentStep.title}
                </h3>
                <div className="space-y-1">
                  {formatContent(currentStep.content)}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Navigation footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentPhase === 'checkin' && currentStepIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentPhase === 'complete' && currentStepIndex === totalStepsInPhase - 1 ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetGuide();
                  }}
                >
                  Restart Guide
                </Button>
                <Button
                  size="sm"
                  onClick={toggleGuide}
                  className="bg-[#FF6600] hover:bg-[#e65c00] text-white"
                >
                  Finish
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={nextStep}
                className="flex items-center gap-1 bg-[#FF6600] hover:bg-[#e65c00] text-white"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
