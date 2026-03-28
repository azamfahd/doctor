
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Bot, Sparkles, Phone, Video, Info, ArrowRight, Brain, 
  Mic, MicOff, Volume2, VolumeX, Activity, HeartPulse, Loader2,
  Thermometer, Droplets, ShieldAlert, Pill, FileText, ChevronLeft,
  Settings, Maximize2, Zap, Download, RefreshCw, BarChart3, TrendingUp,
  X, LayoutPanelLeft, UserCircle, MessageCircle, AlertCircle, Square
} from 'lucide-react';
import { PatientCase, ChatMessage, SystemSettings } from '../types';
import { startFollowUpChat, generateSpeech } from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

interface ConsultSessionProps {
  patient: PatientCase;
  settings: SystemSettings;
  onClose: () => void;
  onUpdateHistory: (messages: ChatMessage[]) => void;
}

const ConsultSession: React.FC<ConsultSessionProps> = ({ patient, settings, onClose, onUpdateHistory }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(patient.chatHistory || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 1024);
  const [streamingText, setStreamingText] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeAudioSource = useRef<AudioBufferSourceNode | null>(null);
  const activeAudioContext = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0);
  const [chatInstance, setChatInstance] = useState<any>(null);

  useEffect(() => {
    const chat = startFollowUpChat(patient, settings);
    setChatInstance(chat);
    return () => {
      stopLiveSession();
      stopAISpeaking();
    };
  }, [patient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, streamingText, isLoading]);

  const stopAISpeaking = () => {
    if (activeAudioSource.current) {
      try {
        activeAudioSource.current.stop();
      } catch (e) {}
      activeAudioSource.current = null;
    }
    if (activeAudioContext.current) {
      activeAudioContext.current.close();
      activeAudioContext.current = null;
    }
    setIsSpeaking(false);
  };

  const stopLiveSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsLiveActive(false);
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const playAIResponse = async (text: string) => {
    if (!settings.voiceOutputEnabled) return;
    stopAISpeaking(); // Stop any current audio before starting new
    try {
      setIsSpeaking(true);
      const base64Audio = await generateSpeech(text);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      activeAudioContext.current = ctx;
      
      const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsSpeaking(false);
        activeAudioSource.current = null;
      };
      
      activeAudioSource.current = source;
      source.start();
    } catch (e) {
      console.error("Audio Error:", e);
      setIsSpeaking(false);
    }
  };

  const startLiveSession = async () => {
    if (isLiveActive) { stopLiveSession(); return; }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            const audioData = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `أنت الآن "طبيب الاستشارة الذكي" للمريض ${patient.name}. التشخيص المفتوح: ${patient.diagnosis?.conditionName}. المؤشرات الحيوية: حرارة ${patient.vitals.temperature} وضغط ${patient.vitals.bloodPressure}. كن دقيقاً، مهنياً، ومطمئناً.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { alert("فشل الاتصال الصوتي المباشر"); }
  };

  const handleSend = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || !chatInstance || isLoading) return;
    
    const userMessage: ChatMessage = { 
      role: 'user', 
      text: textToSend, 
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const result = await chatInstance.sendMessageStream({ message: textToSend });
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setStreamingText(fullText);
      }
      
      const botMessage: ChatMessage = { 
        role: 'model', 
        text: fullText, 
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
      };
      
      const newHistory = [...messages, userMessage, botMessage];
      setMessages(newHistory);
      setStreamingText('');
      onUpdateHistory(newHistory);
      playAIResponse(fullText);
    } catch (e) {
      console.error(e);
      setStreamingText('حدث خطأ في معالجة البيانات السريرية.');
    } finally {
      setIsLoading(false);
    }
  };

  const QuickAction = ({ icon: Icon, label, msg }: { icon: any, label: string, msg: string }) => (
    <button 
      onClick={() => handleSend(msg)} 
      className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-300 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap shrink-0 group"
    >
      <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" /> {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] bg-[#0A0F1E] lg:rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 animate-in fade-in duration-500 relative">
      
      {/* Sidebar Overlay for Mobile */}
      {showSidebar && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] lg:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar - Patient Data Engine */}
      <aside className={`fixed inset-y-0 right-0 z-[160] w-[85%] sm:w-96 bg-[#0F172A] border-l border-white/5 flex flex-col transition-transform duration-500 lg:relative lg:translate-x-0 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Active Patient Card */}
          <div className="p-6 lg:p-8 bg-gradient-to-br from-blue-600/20 via-blue-900/10 to-transparent border-b border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">ملف الحالة النشطة</span>
              </div>
              <button onClick={() => setShowSidebar(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-5 mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-800">
                  {patient.image ? (
                     <img src={patient.image} className="w-full h-full object-cover" alt={patient.name} />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900"><UserCircle className="w-10 h-10 lg:w-12 lg:h-12" /></div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg lg:text-xl font-black text-white tracking-tight">{patient.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{patient.age} سنة</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{patient.gender}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
                 <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                 <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">التشخيص الحالي</p>
                 </div>
                 <p className="text-sm font-black text-white leading-tight">{patient.diagnosis?.conditionName}</p>
              </div>

              <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/10 flex items-start gap-3">
                 <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                 <div>
                    <p className="text-[9px] text-rose-400 font-black uppercase tracking-widest mb-1">تنبيهات حرجة</p>
                    <p className="text-[10px] text-slate-300 font-bold leading-relaxed">{patient.diagnosis?.urgentWarnings?.[0] || 'لا توجد تنبيهات عاجلة'}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Vitals Monitor */}
          <div className="p-6 lg:p-8 space-y-8">
            <section>
              <h5 className="text-[10px] font-black text-slate-500 uppercase mb-5 tracking-[0.2em] flex items-center justify-between">
                <span>المؤشرات السريرية</span>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                </div>
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'الحرارة', val: `${patient.vitals.temperature}°C`, icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { label: 'الضغط', val: patient.vitals.bloodPressure, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                  { label: 'النبض', val: patient.vitals.pulse, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'الأكسجين', val: `${patient.vitals.spo2}%`, icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10' }
                ].map((v, i) => (
                  <div key={i} className={`p-4 rounded-2xl border border-white/5 ${v.bg} group cursor-default transition-all hover:border-white/20`}>
                     <v.icon className={`w-5 h-5 ${v.color} mb-2 transition-transform group-hover:scale-110`} />
                     <p className="text-lg font-black text-white">{v.val}</p>
                     <p className="text-[9px] text-slate-500 font-bold uppercase">{v.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 bg-black/40 border-t border-white/5">
           <button onClick={() => window.print()} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-3 group">
             <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> تصدير السجل السريري الموحد
           </button>
        </div>
      </aside>

      {/* Main Consultation Core */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#0A0F1E] to-[#0D1224] relative overflow-hidden">
        
        {/* Dynamic Header */}
        <header className="p-4 lg:p-7 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-black/40 z-50">
          <div className="flex items-center gap-3 lg:gap-8">
            <button onClick={() => { stopAISpeaking(); onClose(); }} className="p-2.5 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-all text-slate-400 border border-white/5 group">
              <ChevronLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 lg:gap-5">
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                 <div className="relative w-10 h-10 lg:w-16 lg:h-16 bg-slate-900 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
                    <Bot className="w-6 h-6 lg:w-9 lg:h-9 text-blue-400 group-hover:scale-110 transition-transform" />
                    {isSpeaking && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500 animate-pulse"></div>
                    )}
                 </div>
               </div>
               <div className="max-w-[120px] sm:max-w-none">
                  <h3 className="font-black text-xs lg:text-lg text-white truncate">
                    المستشار الرقمي
                  </h3>
                  <div className="flex items-center gap-1 lg:gap-2 mt-0.5 lg:mt-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase truncate">المريض: {patient.name.split(' ')[0]}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-5">
             {isSpeaking && (
               <button 
                onClick={stopAISpeaking}
                className="p-2.5 lg:p-4 bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl lg:rounded-2xl hover:bg-rose-500/30 transition-all flex items-center gap-2"
                title="إيقاف صوت المستشار"
               >
                 <Square className="w-4 h-4 fill-current" />
                 <span className="hidden lg:inline text-[10px] font-black">إيقاف</span>
               </button>
             )}
             <button onClick={() => setShowSidebar(!showSidebar)} className={`p-2.5 lg:p-4 rounded-xl lg:rounded-2xl transition-all border ${showSidebar ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <LayoutPanelLeft className="w-5 h-5 lg:w-6 lg:h-6" />
             </button>
             <button onClick={startLiveSession} className={`p-2.5 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl transition-all flex items-center gap-3 font-black text-[10px] lg:text-xs group relative overflow-hidden ${isLiveActive ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {isLiveActive ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5 group-hover:scale-110" />}
                <span className="hidden sm:inline">{isLiveActive ? 'إغلاق الجلسة' : 'عيادة مباشرة'}</span>
             </button>
          </div>
        </header>

        {/* Message Canvas */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-8 lg:space-y-14 no-scrollbar z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
               <div className="relative">
                  <div className="absolute -inset-10 lg:-inset-16 bg-blue-600/10 rounded-full blur-[80px] animate-pulse"></div>
                  <div className="relative w-20 h-20 lg:w-32 lg:h-32 bg-white/5 border border-white/10 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center shadow-2xl">
                    <MessageCircle className="w-10 h-10 lg:w-14 lg:h-14 text-blue-500" />
                  </div>
               </div>
               <div className="max-w-md px-6">
                  <h4 className="text-xl lg:text-3xl font-black text-white mb-4">بدء الاستشارة</h4>
                  <p className="text-xs lg:text-base font-bold text-slate-500 leading-relaxed">
                    مرحباً، أنا المستشار الرقمي المخصص للمريض <span className="text-blue-400 font-black">{patient.name}</span>. تم تحميل كافة البيانات السريرية. كيف نبدأ؟
                  </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-6">
                  <QuickAction icon={AlertCircle} label="علامات الخطر" msg={`بناءً على تشخيص (${patient.diagnosis?.conditionName})، ما هي علامات الخطر التي يجب مراقبتها؟`} />
                  <QuickAction icon={Pill} label="مراجعة العلاج" msg={`هل خطة العلاج المتبعة للمريض (${patient.name}) تتطلب أي تعديلات؟`} />
               </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-6 duration-500`}>
              <div className={`flex gap-3 lg:gap-6 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border transition-all ${msg.role === 'user' ? 'bg-[#1E293B] text-slate-400 border-white/5' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-400/20'}`}>
                  {msg.role === 'user' ? <UserCircle className="w-5 h-5 lg:w-8 lg:h-8" /> : <Bot className="w-5 h-5 lg:w-8 lg:h-8" />}
                </div>
                <div className={`relative p-4 lg:p-10 rounded-2xl lg:rounded-[3rem] shadow-2xl border group ${msg.role === 'user' ? 'bg-[#1E293B] text-slate-200 rounded-tr-none border-white/5' : 'bg-gradient-to-tr from-blue-900/40 to-blue-800/40 backdrop-blur-xl text-white rounded-tl-none border-blue-500/20'}`}>
                  {msg.role === 'model' && isSpeaking && i === messages.length - 1 && (
                    <div className="absolute top-3 right-6 flex gap-1 items-end h-4">
                      {[1,2,3,4].map(j => <div key={j} className="w-1 bg-blue-400 rounded-full animate-bounce" style={{height: `${j*20+20}%`, animationDelay: `${j*0.1}s`}}></div>)}
                    </div>
                  )}
                  
                  <p className="text-[11px] lg:text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  <div className={`flex items-center gap-3 mt-4 lg:mt-8 opacity-25 ${msg.role === 'model' ? 'justify-end' : ''}`}>
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">{msg.timestamp}</span>
                    <div className="h-[1px] w-6 lg:w-10 bg-current"></div>
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest">{msg.role === 'user' ? 'Staff' : 'AI-Core'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {streamingText && (
            <div className="flex justify-end animate-in fade-in duration-300">
               <div className="flex gap-4 lg:gap-6 max-w-[95%] sm:max-w-[85%] flex-row-reverse">
                  <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xl border border-blue-400/20"><Bot className="w-6 h-6 lg:w-8 lg:h-8 animate-pulse" /></div>
                  <div className="p-5 lg:p-10 rounded-[2rem] lg:rounded-[3rem] rounded-tl-none bg-blue-900/40 backdrop-blur-xl text-white shadow-2xl border border-blue-500/20">
                    <p className="text-xs lg:text-base font-bold leading-relaxed whitespace-pre-wrap">{streamingText}</p>
                    <div className="flex gap-1.5 mt-6">
                       <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {isLoading && !streamingText && (
            <div className="flex justify-end">
               <div className="bg-blue-600/10 p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] flex items-center gap-4 border border-blue-500/20 backdrop-blur-xl">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 lg:w-8 lg:h-8 text-blue-400 animate-spin" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] lg:text-[12px] font-black text-blue-400 uppercase tracking-widest">تحليل المعطيات</p>
                    <p className="text-[7px] lg:text-[9px] text-slate-500 font-bold uppercase mt-1">Processing History...</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="p-4 lg:p-10 bg-black/50 backdrop-blur-3xl border-t border-white/5 z-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-2 lg:mb-3">
               <QuickAction icon={ShieldAlert} label="تقييم الخطورة" msg={`أجرِ تقييماً لدرجة الخطورة الحالية لـ (${patient.name}).`} />
               <QuickAction icon={FileText} label="ملخص الجلسة" msg="لخص هذه الجلسة في نقاط فنية." />
               <QuickAction icon={Settings} label="توصيات الخطة" msg={`هل هناك فحوصات مخبرية إضافية تنصح بها لـ (${patient.name})؟`} />
            </div>

            <div className="relative flex items-center gap-2 lg:gap-5 group/input">
              <button className="p-3.5 lg:p-6 bg-[#1E293B] hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded-xl lg:rounded-3xl border border-white/5 transition-all shadow-2xl">
                <Mic className="w-5 h-5 lg:w-7 lg:h-7" />
              </button>

              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder={isLiveActive ? "المستشار يستمع..." : `اسأل عن حالة ${patient.name.split(' ')[0]}...`} 
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl lg:rounded-3xl px-5 lg:px-12 py-3.5 lg:py-6 outline-none font-bold text-xs lg:text-lg text-white shadow-2xl focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-600" 
                />
              </div>

              <button 
                onClick={() => handleSend()} 
                disabled={isLoading || !input.trim()} 
                className={`p-3.5 lg:p-6 rounded-xl lg:rounded-3xl transition-all shadow-2xl ${isLoading || !input.trim() ? 'bg-white/5 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'}`}
              >
                <Send className="w-5 h-5 lg:w-7 lg:h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultSession;
