
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, ExternalLink, Activity, Sparkles, ChevronLeft } from 'lucide-react';

interface ApiKeyGuardProps {
  onKeySelected: () => void;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ onKeySelected }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) onKeySelected();
      }
      setChecking(false);
    };
    checkKey();
  }, [onKeySelected]);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Proceed immediately as per race condition guidelines
      onKeySelected();
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0F172A] flex items-center justify-center p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
        <div className="p-12 md:p-16 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">مرحباً بك في الحكيم الذكي <span className="text-blue-400">Pro</span></h1>
          <p className="text-slate-400 text-sm md:text-base font-medium mb-10 max-w-md leading-relaxed">
            للوصول إلى أدوات التشخيص الخوارزمي المتقدمة، يرجى تفعيل مفتاح الوصول السريري الخاص بك. هذا يضمن لك خصوصية تامة وأداءً فائقاً.
          </p>

          <div className="w-full space-y-4">
            <button 
              onClick={handleSelectKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-600/20 group"
            >
              <Key className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              تفعيل مفتاح الوصول الآن
            </button>
            
            <div className="flex flex-col gap-3">
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                وثيقة الفوترة للمشاريع المدفوعة <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="h-[1px] w-12 bg-white/10 mx-auto"></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Clinical Precision Engine v5.0</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border-t border-white/5 p-8 grid grid-cols-3 gap-4">
           <div className="flex flex-col items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400/50" />
              <span className="text-[9px] font-black text-slate-500 uppercase">دقة تشخيصية</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400/50" />
              <span className="text-[9px] font-black text-slate-500 uppercase">ذكاء توليدي</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400/50" />
              <span className="text-[9px] font-black text-slate-500 uppercase">تشفير طبي</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGuard;
