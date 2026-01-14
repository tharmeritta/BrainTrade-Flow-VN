import React, { useState, useRef, useEffect } from 'react';
import { Language, Message } from '../types';
import { generateCoachResponse } from '../services/geminiService';
import { Sparkles, Send, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  language: Language;
  currentStepTitle: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ language, currentStepTitle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: language === 'en' 
        ? "I'm your sales coach. Ask me about objections or what to say next!" 
        : "Tôi là trợ lý bán hàng của bạn. Hãy hỏi tôi về cách xử lý từ chối hoặc câu thoại tiếp theo!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset welcome message on language change
  useEffect(() => {
     setMessages(prev => {
        // Keep history but add a system note or just let it be. 
        // Actually simpler to just not reset, but maybe translate the last message if it was the welcome one?
        // Let's just keep history as is, users might toggle lang mid-chat.
        return prev;
     });
  }, [language]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await generateCoachResponse(currentStepTitle, userMsg.text, language);

    const botMsg: Message = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-indigo-100 bg-white/50 flex items-center justify-between">
        <div className="flex items-center text-indigo-700 font-bold">
          <Sparkles size={18} className="mr-2" />
          <span>AI Coach</span>
        </div>
        <span className="text-xs text-indigo-400 bg-indigo-50 px-2 py-1 rounded">
          Gemini
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-3 text-sm shadow-sm
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }
            `}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'model' ? <Bot size={12}/> : <User size={12}/>}
                 <span>{msg.role === 'model' ? 'Coach' : 'You'}</span>
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-3 border border-gray-100 rounded-bl-none flex items-center space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-indigo-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'en' ? "Ask for help..." : "Hỏi trợ giúp..."}
            className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
