
import React, { useState, useRef } from 'react';
import { 
  Sparkles, AlertTriangle, ChevronLeft, CheckCircle2, 
  Stethoscope, AlertCircle, Pill, ShieldCheck, 
  Activity, Zap, BarChart3, Microscope, Target, Volume2, Printer, Square,
  Apple, Dumbbell, LifeBuoy, HeartPulse, Info, Clock, AlertOctagon
} from 'lucide-react';
import { StructuredDiagnosis } from '../types';
import { generateSpeech } from '../services/geminiService';

interface AIResultProps {
  diagnosis: StructuredDiagnosis;
  sources?: any[];
  patientName: string;
  patientGender: string;
  onClose: () => void;
}

const AIResult: React.FC<AIResultProps> = ({ diagnosis, patientName, onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const severityColors: any = {
    'حرجة': 'bg-rose-600',
    'مرتفعة': 'bg-orange-600',
    'متوسطة': 'bg-blue-600',
    'منخفضة': 'bg-emerald-600'
  };

  const handleListen = async () => {
    if (isSpeaking) {
      if (audioSourceRef.current) audioSourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }
    try {
      setIsSpeaking(true);
      const speechText = `تقرير المريض ${patientName}. التشخيص المقترح هو ${diagnosis.conditionName}. ملخص السريري: ${diagnosis.summary}. يرجى مراجعة الخطة العلاجية والتوصيات الغذائية المذكورة في التقرير.`;
      const base64Audio = await generateSpeech(speechText);
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      audioSourceRef.current = source;
      source.start();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const SectionCard = ({ title, icon: Icon, items, colorClass, bgColor }: any) => (
    <div className={`rounded-[2rem] p-6 lg:p-8 border shadow-sm transition-all hover:shadow-md ${bgColor} ${colorClass}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-black text-sm uppercase tracking-wider">{title}</h4>
      </div>
      <ul className="space-y-3">
        {items && items.length > 0 ? items.map((item: string, i: number) => (
          <li key={i} className="flex gap-3 text-xs lg:text-sm font-bold leading-relaxed opacity-90">
             <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mt-2 opacity-40"></div>
             <span>{item}</span>
          </li>
        )) : <li className="text-xs opacity-50 italic">لا توجد توصيات محددة</li>}
      </ul>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen lg:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500 font-['Tajawal']">
      {/* Dynamic Header */}
      <div className={`${severityColors[diagnosis.severity] || 'bg-blue-600'} p-8 lg:p-14 text-white relative overflow-hidden`}>
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.5" />
            <path d="M0 50 C 50 100 80 0 100 50" stroke="white" fill="transparent" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
             <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><ChevronLeft className="w-6 h-6 rotate-180" /></button>
             <div className="flex gap-2">
                <button onClick={handleListen} className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center gap-3 text-xs font-black transition-all">
                  {isSpeaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? 'إيقاف' : 'استماع للتقرير'}
                </button>
                <button onClick={() => window.print()} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><Printer className="w-6 h-6" /></button>
             </div>
          </div>
          <div className="max-w-4xl mx-auto text-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/5">
                <ShieldCheck className="w-3.5 h-3.5" /> بروتوكول التشخيص الذكي
             </div>
             <h2 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">{diagnosis.conditionName}</h2>
             <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-6 text-xs lg:text-sm font-bold">
               <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">دقة التحليل: {diagnosis.confidenceScore}%</span>
               <span className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></span>
               <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">المريض: {patientName}</span>
               <span className="w-1 h-1 bg-white/40 rounded-full hidden sm:block"></span>
               <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg uppercase tracking-wider">مستوى الخطورة: {diagnosis.severity}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-10 pb-24 space-y-8 relative z-20">
        
        {/* Clinical Summary & Differential */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                  <Zap className="w-6 h-6" />
                  <h3 className="font-black text-lg uppercase tracking-widest">الملخص السريري الشامل</h3>
                </div>
                <p className="text-sm lg:text-lg text-slate-700 leading-relaxed font-medium">
                  {diagnosis.summary}
                </p>
              </div>
              
              {diagnosis.urgentWarnings && diagnosis.urgentWarnings.length > 0 && (
                <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4">
                  <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                  <div>
                    <h5 className="text-xs font-black text-rose-700 uppercase mb-1">تحذيرات عاجلة (يرجى الانتباه)</h5>
                    <ul className="text-xs text-rose-600 font-bold space-y-1">
                      {diagnosis.urgentWarnings.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                  </div>
                </div>
              )}
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6 text-amber-600">
                <BarChart3 className="w-6 h-6" />
                <h3 className="font-black text-sm lg:text-base uppercase tracking-widest">الاحتمالات البديلة</h3>
              </div>
              <div className="space-y-4">
                {diagnosis.differentialDiagnosis.map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-slate-800 text-xs lg:text-sm">{item.condition}</p>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{item.probability}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{item.reasoning}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Integrated Medical Plan Grid */}
        <h3 className="text-center text-xl font-black text-slate-800 pt-8 flex items-center justify-center gap-4">
          <div className="h-[2px] w-12 bg-slate-200"></div>
          خطة الرعاية الطبية المتكاملة
          <div className="h-[2px] w-12 bg-slate-200"></div>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SectionCard 
            title="المسار العلاجي" 
            icon={Pill} 
            items={diagnosis.treatmentPlan} 
            colorClass="text-blue-800 border-blue-100" 
            bgColor="bg-blue-50/50" 
          />
          <SectionCard 
            title="التغذية العلاجية" 
            icon={Apple} 
            items={diagnosis.dietaryAdvice} 
            colorClass="text-emerald-800 border-emerald-100" 
            bgColor="bg-emerald-50/50" 
          />
          <SectionCard 
            title="التأهيل البدني" 
            icon={Dumbbell} 
            items={diagnosis.physicalTherapy} 
            colorClass="text-orange-800 border-orange-100" 
            bgColor="bg-orange-50/50" 
          />
          <SectionCard 
            title="نمط الحياة" 
            icon={LifeBuoy} 
            items={diagnosis.lifestyleChanges} 
            colorClass="text-indigo-800 border-indigo-100" 
            bgColor="bg-indigo-50/50" 
          />
        </div>

        {/* Diagnostics & Prevention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
           <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6 text-slate-700">
                <Microscope className="w-5 h-5" />
                <h4 className="font-black text-xs lg:text-sm uppercase tracking-widest">فحوصات وتحاليل مقترحة</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {diagnosis.suggestedTests?.map((test, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {test}
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6 text-slate-700">
                <HeartPulse className="w-5 h-5" />
                <h4 className="font-black text-xs lg:text-sm uppercase tracking-widest">نصائح الوقاية العامة</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {diagnosis.preventionTips?.map((tip, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-600">
                      <Target className="w-4 h-4 text-blue-500 shrink-0" />
                      {tip}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-12">
           <button 
             onClick={onClose} 
             className="flex-1 bg-slate-900 hover:bg-black text-white py-6 rounded-3xl font-black text-lg shadow-2xl transition-all active:scale-[0.98]"
           >
             حفظ وإغلاق التقرير
           </button>
           <button 
             onClick={() => window.print()} 
             className="px-12 bg-white border-2 border-slate-100 py-6 rounded-3xl font-black text-slate-600 text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
           >
             <Printer className="w-6 h-6" /> طباعة التقرير
           </button>
        </div>
        
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] py-8">
          إخلاء مسؤولية: هذا التحليل استرشادي مدعوم بالذكاء الاصطناعي ويجب مراجعة طبيب متخصص.
        </p>
      </div>
    </div>
  );
};

export default AIResult;
