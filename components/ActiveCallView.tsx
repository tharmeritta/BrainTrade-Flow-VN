import React, { useState, useEffect } from 'react';
import { Step, Language } from '../types';
import { 
  Clock, CheckSquare, Square, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { NotesPanel } from './NotesPanel';

interface ActiveCallViewProps {
  step: Step;
  language: Language;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  sessionId: number;
}

export const ActiveCallView: React.FC<ActiveCallViewProps> = ({ 
  step, 
  language, 
  onNext, 
  onPrev,
  isFirst,
  isLast,
  sessionId
}) => {
  const [checkedPoints, setCheckedPoints] = useState<Set<string>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset timer and checkboxes when step changes
  useEffect(() => {
    setElapsedTime(0);
  }, [step.id]);

  useEffect(() => {
    setCheckedPoints(new Set());
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePoint = (id: string) => {
    const next = new Set(checkedPoints);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedPoints(next);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-8 lg:pb-0">
      {/* Left Column: Script */}
      <div 
        className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 h-[600px] lg:h-[calc(100vh-12rem)] min-h-[500px]"
      >
        
        {/* Inner Script Content */}
        <div className="flex-1 flex flex-col p-6 h-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="pr-4">
                <h2 className="text-2xl font-bold text-gray-900">{step.title[language]}</h2>
                <p className="text-gray-500">{step.description?.[language]}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`
                  flex items-center px-3 py-1 rounded-lg font-mono font-bold text-lg
                  ${elapsedTime > 60 * parseInt(step.timeLimit) ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}
                `}>
                  <Clock size={18} className="mr-2" />
                  {formatTime(elapsedTime)}
                </div>
                <span className="text-xs text-gray-400 mt-1">Target: {step.timeLimit}</span>
              </div>
            </div>

            {/* Points List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {step.points.map((point) => {
                const isChecked = checkedPoints.has(point.id);
                return (
                  <div 
                    key={point.id}
                    onClick={() => togglePoint(point.id)}
                    className={`
                      p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start group
                      ${isChecked 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-100 hover:border-blue-200'
                      }
                    `}
                  >
                    <div className={`mt-1 mr-4 ${isChecked ? 'text-green-500' : 'text-gray-300 group-hover:text-blue-400'}`}>
                      {isChecked ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-lg leading-snug ${isChecked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {point.text[language]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between flex-shrink-0">
              <button 
                onClick={onPrev}
                disabled={isFirst}
                className={`
                  flex items-center px-4 py-2 rounded-lg font-medium transition-colors
                  ${isFirst 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <ArrowLeft size={20} className="mr-2" />
                {language === 'en' ? 'Previous' : 'Trước'}
              </button>

              <button 
                onClick={onNext}
                disabled={isLast}
                className={`
                  flex items-center px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all
                  ${isLast
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  }
                `}
              >
                {language === 'en' ? 'Next Step' : 'Bước tiếp theo'}
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
        </div>
      </div>

      {/* Right Section: Tools (AI & Notes) */}
      <div className="flex flex-col gap-4 lg:w-[45%] lg:flex-row lg:h-[calc(100vh-12rem)] lg:min-h-[500px]">
         {/* AI Coach */}
         <div className="h-[500px] lg:h-full lg:flex-1 min-h-[400px]">
            <AIAssistant language={language} currentStepTitle={step.title[language]} />
         </div>
         
         {/* Notes Panel */}
         <div className="h-[300px] lg:h-full lg:flex-1 min-h-[300px]">
            <NotesPanel language={language} sessionId={sessionId} />
         </div>
      </div>
    </div>
  );
};