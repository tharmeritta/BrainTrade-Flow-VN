import React from 'react';
import { Step, Language } from '../types';
import { Clock, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';

interface StepCardProps {
  step: Step;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  language: Language;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, isActive, isCompleted, onClick, language, index }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-blue-50 border-blue-500 shadow-lg scale-105 z-10' 
          : isCompleted 
            ? 'bg-green-50 border-green-400 opacity-90' 
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      {/* Connector Line (Desktop) */}
      {index < 3 && (
        <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-0 text-gray-300">
          <ChevronRight size={24} />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <span className={`
          text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
          ${isActive ? 'bg-blue-100 text-blue-700' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}
        `}>
          Step {index + 1}
        </span>
        <div className="flex items-center text-xs font-medium text-gray-500">
          <Clock size={12} className="mr-1" />
          {step.timeLimit}
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
        {step.title[language]}
      </h3>

      {/* Description Preview */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {step.description?.[language]}
      </p>

      {/* Action Indicator */}
      <div className="mt-auto flex items-center justify-end">
        {isActive ? (
          <PlayCircle className="text-blue-600 animate-pulse" size={20} />
        ) : isCompleted ? (
          <CheckCircle2 className="text-green-500" size={20} />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        )}
      </div>
    </div>
  );
};
