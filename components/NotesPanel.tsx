import React, { useState, useEffect, useCallback } from 'react';
import { PenLine, Save } from 'lucide-react';
import { Language } from '../types';
import { getDraftNote, saveDraftNote } from '../services/db';

interface NotesPanelProps {
  language: Language;
  sessionId: number; // Used to force reload when a new call starts
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ language, sessionId }) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load note when component mounts or session changes
  useEffect(() => {
    const loadNote = async () => {
      const savedNote = await getDraftNote();
      setNote(savedNote);
    };
    loadNote();
  }, [sessionId]);

  // Debounce save function
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (note) {
        setIsSaving(true);
        await saveDraftNote(note);
        // Small delay to show the saving indicator
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [note]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-100 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-amber-100 bg-white/50 flex items-center justify-between">
        <div className="flex items-center text-amber-700 font-bold">
          <PenLine size={18} className="mr-2" />
          <span>{language === 'en' ? 'My Notes' : 'Ghi chú'}</span>
        </div>
        <div className="flex items-center space-x-2">
          {isSaving && (
             <span className="text-xs text-amber-500 animate-pulse flex items-center">
               <Save size={12} className="mr-1" />
               {language === 'en' ? 'Saving...' : 'Đang lưu...'}
             </span>
          )}
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
            Local
          </span>
        </div>
      </div>

      <div className="flex-1 p-0">
        <textarea
          value={note}
          onChange={handleChange}
          placeholder={language === 'en' 
            ? "Type your notes here... They are saved automatically." 
            : "Nhập ghi chú tại đây... Nội dung sẽ tự động lưu."}
          className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-gray-700 leading-relaxed font-medium placeholder-amber-300/50"
          style={{
             backgroundImage: 'linear-gradient(transparent, transparent 31px, #fcecdb 31px)',
             backgroundSize: '100% 32px',
             lineHeight: '32px'
          }}
        />
      </div>
    </div>
  );
};
