import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { PatientCase, SystemSettings, ChatMessage } from '../types';
import { startFollowUpChat, generateSpeech } from '../services/geminiService';
import { Send, Volume2, VolumeX, Mic, MicOff, ArrowRight, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConsultSessionProps {
  record: PatientCase;
  settings: SystemSettings;
  onBack: () => void;
  onUpdateRecord: (updatedRecord: PatientCase) => void;
}

const ConsultSession: React.FC<ConsultSessionProps> = ({ record, settings, onBack, onUpdateRecord }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(record.chatHistory || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(settings.voiceOutputEnabled);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = startFollowUpChat(record, settings);
    setChatInstance(chat);
  }, [record, settings]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance || isTyping) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatInstance.sendMessageStream({ message: input });
      let fullResponse = '';
      
      const aiMessage: ChatMessage = {
        role: 'model',
        content: '',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      for await (const chunk of result) {
        fullResponse += chunk.text;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: fullResponse }];
        });
      }

      const finalRecord = {
        ...record,
        chatHistory: [...newMessages, { ...aiMessage, content: fullResponse }]
      };
      onUpdateRecord(finalRecord);

      if (isVoiceEnabled) {
        const audioData = await generateSpeech(fullResponse, settings);
        if (audioData) {
          const audio = new Audio(`data:audio/wav;base64,${audioData}`);
          audio.play();
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  /*
  const startLiveSession = async () => {
    if (!window.aistudio) return;
    setIsLiveSession(true);
    // Logic for Live API session would go here
  };
  */

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-160px)] max-w-6xl mx-auto bg-white rounded-2xl lg:rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Header */}
      <div className="p-4 lg:p-10 border-b flex items-center justify-between bg-white/90 backdrop-blur-xl z-10 shadow-sm">
        <div className="flex items-center gap-3 lg:gap-8">
          <button 
            onClick={onBack}
            className="w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl lg:rounded-2xl transition-all active:scale-90 shadow-inner"
          >
            <ArrowRight className="w-5 h-5 lg:w-7 lg:h-7 rotate-180" />
          </button>
          <div className="space-y-0.5 lg:space-y-1">
            <h2 className="text-lg lg:text-3xl font-black text-slate-900 tracking-tight leading-none">استشارة الحكيم الذكية</h2>
            <p className="text-slate-400 font-bold flex items-center gap-2 lg:gap-3 text-[10px] lg:text-sm">
              <span className="relative flex h-2 w-2 lg:h-3 lg:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 lg:h-3 lg:w-3 bg-emerald-500"></span>
              </span>
              متابعة حالة المريض: <span className="text-blue-600 truncate max-w-[80px] lg:max-w-none">{record.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <button 
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-2xl transition-all active:scale-90 shadow-sm border ${isVoiceEnabled ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5 lg:w-7 lg:h-7" /> : <VolumeX className="w-5 h-5 lg:w-7 lg:h-7" />}
          </button>
          <button 
            onClick={() => setIsLiveSession(!isLiveSession)}
            className={`h-10 lg:h-14 px-4 lg:px-8 rounded-xl lg:rounded-2xl font-black flex items-center gap-2 lg:gap-4 transition-all active:scale-95 shadow-xl ${isLiveSession ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
          >
            {isLiveSession ? <MicOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Mic className="w-5 h-5 lg:w-6 lg:h-6" />}
            <span className="hidden sm:inline text-sm lg:text-lg">{isLiveSession ? 'إنهاء' : 'صوتية'}</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 lg:space-y-10 bg-slate-50/40 scrollbar-premium">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 lg:space-y-8 opacity-60">
            <div className="w-24 h-24 lg:w-40 lg:h-40 bg-white rounded-2xl lg:rounded-[3rem] flex items-center justify-center shadow-2xl border border-slate-100 animate-float">
              <Bot className="w-12 h-12 lg:w-20 lg:h-20 text-blue-600" />
            </div>
            <div className="space-y-2 lg:space-y-3 px-4">
              <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">ابدأ الاستشارة الطبية</h3>
              <p className="max-w-md text-slate-500 font-medium text-sm lg:text-lg leading-relaxed">
                اطرح أي استفسار حول التشخيص، خطة العلاج، أو تداخلات الأدوية وسيقوم الحكيم بتحليل الحالة فوراً.
              </p>
            </div>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-3 lg:gap-6 max-w-[90%] lg:max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-blue-600 border border-slate-100 shadow-sm'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 lg:w-7 lg:h-7" /> : <Bot className="w-5 h-5 lg:w-7 lg:h-7" />}
                </div>
                <div className={`p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] shadow-2xl text-sm lg:text-xl leading-relaxed font-medium transition-all duration-500 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div className="flex justify-end">
            <div className="flex gap-3 lg:gap-5 items-center text-blue-600 bg-white/80 backdrop-blur-md px-4 lg:px-8 py-2 lg:py-4 rounded-full border border-blue-100 shadow-xl">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-600 rounded-full animate-bounce" />
              </div>
              <span className="text-[10px] lg:text-sm font-black uppercase tracking-[0.2em]">الحكيم يحلل البيانات...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-10 bg-white border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="relative flex items-center gap-3 lg:gap-6 max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك الطبي هنا..."
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl lg:rounded-[2.5rem] px-6 lg:px-10 py-4 lg:py-6 text-sm lg:text-xl font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600/20 focus:bg-white transition-all shadow-inner outline-none"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">اضغط Enter للإرسال</span>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center rounded-xl lg:rounded-[2rem] transition-all shadow-2xl active:scale-90 ${input.trim() && !isTyping ? 'bg-blue-600 text-white shadow-blue-200 hover:-translate-y-2 lg:hover:rotate-[-10deg]' : 'bg-slate-100 text-slate-400 shadow-none'}`}
          >
            <Send className="w-5 h-5 lg:w-8 lg:h-8 rotate-180" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 lg:gap-6 mt-4 lg:mt-8">
          <p className="text-[8px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 lg:gap-2">
            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-400 rounded-full" />
            تشفير طبي متقدم
          </p>
          <p className="text-[8px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 lg:gap-2">
            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-400 rounded-full" />
            محرك {settings.model.split('-')[1].toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsultSession;
