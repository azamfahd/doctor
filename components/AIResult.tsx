import React from 'react';
import { PatientCase } from '../types';
import { Volume2, Printer, ArrowRight, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AIResultProps {
  record: PatientCase;
  onBack: () => void;
  onConsult: () => void;
  onSpeak: (text: string) => void;
}

const AIResult: React.FC<AIResultProps> = ({ record, onBack, onConsult, onSpeak }) => {
  const { diagnosis } = record;

  if (!diagnosis) return null;

  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const severityIcons = {
    low: <CheckCircle className="w-5 h-5" />,
    medium: <Info className="w-5 h-5" />,
    high: <AlertCircle className="w-5 h-5" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-5xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000"
    >
      {/* Header Card */}
      <div className="card-premium p-6 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8 border-none shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="flex items-center gap-4 lg:gap-8 relative z-10">
          <button 
            onClick={onBack}
            className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl lg:rounded-2xl transition-all active:scale-90 shadow-inner"
          >
            <ArrowRight className="w-6 h-6 lg:w-7 lg:h-7 rotate-180" />
          </button>
          <div className="space-y-1 lg:space-y-2">
            <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">تقرير التشخيص الذكي</h2>
            <p className="text-sm lg:text-lg text-slate-500 font-medium flex items-center gap-2 lg:gap-3">
              المريض: <span className="text-blue-600 font-black">{record.name}</span>
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              التاريخ: <span className="text-slate-900 font-black">{record.date}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 lg:gap-4 relative z-10">
          <button 
            onClick={() => onSpeak(diagnosis.description)}
            className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-50 text-blue-600 rounded-xl lg:rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-sm flex items-center justify-center group/btn"
            title="استماع للتقرير"
          >
            <Volume2 className="w-6 h-6 lg:w-7 lg:h-7 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => window.print()}
            className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-50 text-slate-600 rounded-xl lg:rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm flex items-center justify-center group/btn"
            title="طباعة التقرير"
          >
            <Printer className="w-6 h-6 lg:w-7 lg:h-7 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Diagnosis Content */}
      <div className="card-premium p-0 overflow-hidden border-none shadow-2xl">
        {/* Severity Banner */}
        <div className={`p-6 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 ${severityColors[diagnosis.severity]} border-b border-white/20`}>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/30 backdrop-blur-md rounded-xl lg:rounded-2xl flex items-center justify-center shadow-inner">
              {severityIcons[diagnosis.severity]}
            </div>
            <div className="space-y-0.5 lg:space-y-1">
              <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] opacity-70">التشخيص المقترح</p>
              <h3 className="text-xl lg:text-3xl font-black tracking-tight">{diagnosis.title}</h3>
            </div>
          </div>
          <div className="px-6 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-xs lg:text-sm font-black uppercase tracking-widest shadow-sm text-center">
            مستوى الخطورة: {diagnosis.severity === 'low' ? 'منخفض' : diagnosis.severity === 'medium' ? 'متوسط' : 'عالي'}
          </div>
        </div>
        
        <div className="p-6 lg:p-12 space-y-8 lg:space-y-12">
          {/* Clinical Description */}
          <section className="space-y-4 lg:space-y-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-50 text-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
                <Info className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">الوصف السريري</h3>
            </div>
            <div className="p-6 lg:p-10 bg-slate-50/50 rounded-2xl lg:rounded-[2.5rem] border border-slate-100/50 relative group">
              <div className="absolute top-6 left-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Info className="w-12 h-12 lg:w-20 lg:h-20 text-blue-600" />
              </div>
              <p className="text-slate-700 leading-relaxed text-lg lg:text-2xl font-medium relative z-10">
                {diagnosis.description}
              </p>
            </div>
          </section>

          {/* Treatment & Recommendations Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            <section className="space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-50 text-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">خطة العلاج المقترحة</h3>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {diagnosis.treatmentPlan.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-4 lg:gap-5 p-4 lg:p-6 bg-emerald-50/30 rounded-2xl lg:rounded-3xl border border-emerald-100/50 hover:bg-emerald-50 transition-all duration-500"
                  >
                    <span className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-600 text-white rounded-lg lg:rounded-xl flex items-center justify-center text-base lg:text-lg font-black flex-shrink-0 shadow-lg shadow-emerald-100">
                      {i + 1}
                    </span>
                    <p className="text-emerald-900 font-bold text-base lg:text-lg leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-amber-50 text-amber-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">توصيات هامة</h3>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {diagnosis.recommendations.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-4 lg:gap-5 p-4 lg:p-6 bg-amber-50/30 rounded-2xl lg:rounded-3xl border border-amber-100/50 hover:bg-amber-50 transition-all duration-500"
                  >
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-amber-400 rounded-full mt-2 lg:mt-3 flex-shrink-0 shadow-sm" />
                    <p className="text-amber-900 font-bold text-base lg:text-lg leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Follow-up Section */}
          <section className="pt-8 lg:pt-10 border-t border-slate-100">
            <div className="bg-slate-900 p-8 lg:p-10 rounded-2xl lg:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full -ml-32 -mb-32 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-3 lg:space-y-4">
                <h3 className="text-lg lg:text-xl font-black uppercase tracking-[0.2em] text-blue-400">تعليمات المتابعة</h3>
                <p className="text-xl lg:text-2xl font-medium leading-relaxed text-slate-100">{diagnosis.followUp}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col items-center gap-4 lg:gap-6 pt-6">
        <button 
          onClick={onConsult}
          className="btn-premium w-full sm:w-auto px-8 lg:px-12 py-5 lg:py-6 text-lg lg:text-2xl group shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
        >
          بدء استشارة تفاعلية حول الحالة
          <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 rotate-180 group-hover:-translate-x-2 transition-transform" />
        </button>
        <p className="text-slate-400 font-black text-[10px] lg:text-xs uppercase tracking-[0.3em]">مدعوم بتقنيات الحكيم برو للذكاء الاصطناعي</p>
      </div>
    </motion.div>
  );
};

export default AIResult;
