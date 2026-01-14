import React, { useState } from 'react';
import { STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { ActiveCallView } from './components/ActiveCallView';
import { Language } from './types';
import { Globe, LayoutGrid, Phone, PlusCircle } from 'lucide-react';
import { archiveCall, getDraftNote, clearDraftNote } from './services/db';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('vn');
  const [activeStepId, setActiveStepId] = useState<string>(STEPS[0].id);
  const [viewMode, setViewMode] = useState<'flow' | 'call'>('call');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<number>(Date.now());

  const activeStepIndex = STEPS.findIndex(s => s.id === activeStepId);
  const activeStep = STEPS[activeStepIndex];

  const handleStepClick = (id: string) => {
    setActiveStepId(id);
    setViewMode('call');
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(activeStepId));
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepId(STEPS[activeStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepId(STEPS[activeStepIndex - 1].id);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vn' : 'en');
  };

  const handleNewCall = async () => {
    const confirmed = window.confirm(
      language === 'en' 
        ? "Start a new call? Current notes and progress will be saved to history." 
        : "Bắt đầu cuộc gọi mới? Ghi chú và tiến trình hiện tại sẽ được lưu vào lịch sử."
    );

    if (confirmed) {
      // 1. Get current draft note
      const note = await getDraftNote();
      
      // 2. Archive to history
      await archiveCall({
        date: new Date().toISOString(),
        notes: note,
        completedSteps: Array.from(completedSteps),
        duration: 0 // Could track duration if needed
      });

      // 3. Clear draft and reset state
      await clearDraftNote();
      setCompletedSteps(new Set());
      setActiveStepId(STEPS[0].id);
      setSessionId(Date.now()); // Triggers reload in NotesPanel
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              BF
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
              BrainTrade Flow VN
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
             <button
                onClick={() => setViewMode('flow')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'flow' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <LayoutGrid size={16} className="mr-2" />
                {language === 'en' ? 'Map View' : 'Bản đồ'}
             </button>
             <button
                onClick={() => setViewMode('call')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'call' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Phone size={16} className="mr-2" />
                {language === 'en' ? 'Active Call' : 'Cuộc gọi'}
             </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNewCall}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <PlusCircle size={18} />
              {language === 'en' ? 'New Call' : 'Cuộc gọi mới'}
            </button>
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Globe size={18} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase">{language}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-6 flex flex-col gap-6">
        
        {/* Progress Bar (Visible at top) */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-[600px] flex justify-between gap-4">
             {STEPS.map((step, index) => (
               <div key={step.id} className="flex-1">
                 <StepCard
                    step={step}
                    index={index}
                    isActive={step.id === activeStepId}
                    isCompleted={completedSteps.has(step.id)}
                    onClick={() => handleStepClick(step.id)}
                    language={language}
                 />
               </div>
             ))}
          </div>
        </div>

        {/* Dynamic View */}
        <div className="flex-1 min-h-0">
          {viewMode === 'call' ? (
            <div className="h-full">
              <ActiveCallView
                step={activeStep}
                language={language}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={activeStepIndex === 0}
                isLast={activeStepIndex === STEPS.length - 1}
                sessionId={sessionId}
              />
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center min-h-[500px] h-full text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <LayoutGrid size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">
                  {language === 'en' ? 'Mind Map Overview' : 'Tổng quan sơ đồ tư duy'}
                </h3>
                <p className="text-gray-400 max-w-md">
                   {language === 'en' 
                     ? 'Select any step above to enter Active Call mode and see the detailed script.' 
                     : 'Chọn bất kỳ bước nào ở trên để vào chế độ Cuộc gọi và xem kịch bản chi tiết.'}
                </p>
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => setViewMode('call')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {language === 'en' ? 'Continue Script' : 'Tiếp tục kịch bản'}
                  </button>
                  <button 
                    onClick={handleNewCall}
                    className="px-6 py-2 bg-white text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {language === 'en' ? 'New Call' : 'Cuộc gọi mới'}
                  </button>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;