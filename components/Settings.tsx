
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Brain, Shield, Trash2, Save, Download as ExportIcon, 
  Upload as ImportIcon, ShieldCheck, Database, Volume2, Key, ExternalLink, 
  CheckCircle2, AlertCircle, Info, Palette, UserCog, Mic, HardDrive, Layout, 
  Eye, EyeOff, RefreshCcw, Fingerprint, Cpu, Zap, Search, Globe, Image as ImageIcon,
  Wind, Layers, Sliders, Activity, Headphones
} from 'lucide-react';
import { SystemSettings, ModelType, PatientCase, AIPersonality, ThemeMode } from '../types';

interface SettingsProps {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
  onSave: () => void;
  onClear: () => void;
  records: PatientCase[];
  onImport: (records: PatientCase[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onSave, onClear, records, onImport }) => {
  const [showKey, setShowKey] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);

  useEffect(() => {
    setIsKeyValid(!!settings.apiKey && settings.apiKey.startsWith('AIza') && settings.apiKey.length > 20);
  }, [settings.apiKey]);

  const models = [
    {
      id: ModelType.FLASH,
      name: 'Gemini 3 Flash',
      desc: 'الأداء الأسرع والأكثر كفاءة للتشخيصات العامة اليومية والمتابعات السريعة.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      caps: ['سرعة استجابة', 'ذكاء عام', 'توفير موارد']
    },
    {
      id: ModelType.PRO,
      name: 'Gemini 3 Pro Elite',
      desc: 'قوة استدلال هائلة للحالات الطبية المحيرة والتشخيصات التفريقية المعقدة.',
      icon: Brain,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      caps: ['استدلال عميق', 'تحليل ملفات', 'بحث طبي']
    },
    {
      id: ModelType.LITE,
      name: 'Flash Lite Ultra',
      desc: 'النموذج الأخف، مثالي لعمليات الفرز الأولية والدردشة البسيطة بأقل تكلفة زمنية.',
      icon: Wind,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      caps: ['سرعة لحظية', 'كفاءة طاقة', 'أداء مستقر']
    },
    {
      id: ModelType.IMAGE_PRO,
      name: 'Pro Vision Visionary',
      desc: 'متخصص في تحليل الصور الطبية المعقدة واستخراج البيانات البصرية بدقة مذهلة.',
      icon: ImageIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      caps: ['تحليل صور 4K', 'رؤية حاسوبية', 'استنتاج بصري']
    },
    {
      id: ModelType.AUDIO_NATIVE,
      name: 'Audio Native Voice',
      desc: 'تحليل صوتي أصيل يفهم النبرات الصوتية للمريض ويحلل الأعراض المسموعة.',
      icon: Headphones,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      caps: ['استماع بشري', 'تحليل نبرة', 'ردود صوتية']
    }
  ];

  const handleThinkingBudgetChange = (val: string) => {
    setSettings({ ...settings, thinkingBudget: parseInt(val) });
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700 font-['Tajawal']">
      
      {/* Dynamic Header */}
      <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200">
            <SettingsIcon className="w-10 h-10 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">إعدادات المحرك الذكي</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">AI Core Configuration & Identity</p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
           <button onClick={onSave} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-95">
              <Save className="w-5 h-5" /> حفظ التكوين الحالي
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Selection Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Advanced Model Selection */}
          <section className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-50">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-black text-slate-800">اختيار النموذج المتخصص</h3>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((m) => {
                  const isActive = settings.model === m.id;
                  return (
                    <button 
                      key={m.id}
                      onClick={() => setSettings({...settings, model: m.id})}
                      className={`relative flex flex-col text-right p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden group ${isActive ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg'}`}
                    >
                      {isActive && (
                        <div className="absolute top-4 left-4 bg-blue-500 text-white p-1.5 rounded-full animate-in zoom-in shadow-lg">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-2xl w-fit mb-4 transition-colors ${isActive ? 'bg-white/10 text-white' : `${m.bg} ${m.color}`}`}>
                        <m.icon className="w-7 h-7" />
                      </div>
                      
                      <h4 className={`text-xl font-black mb-2 ${isActive ? 'text-white' : 'text-slate-800'}`}>{m.name}</h4>
                      <p className={`text-[11px] font-medium leading-relaxed mb-6 ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>
                      
                      <div className="mt-auto flex flex-wrap gap-2">
                         {m.caps.map((cap, i) => (
                           <span key={i} className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${isActive ? 'bg-white/10 text-blue-400' : 'bg-slate-50 text-slate-400'}`}>
                             {cap}
                           </span>
                         ))}
                      </div>
                    </button>
                  );
                })}
             </div>
          </section>

          {/* Logic & Precision Controls */}
          <section className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-50 space-y-12">
             <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <Sliders className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-black text-slate-800">منطق التفكير والدقة المعرفية</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500"><Brain className="w-6 h-6" /></div>
                        <div>
                          <p className="text-base font-black text-slate-800">وضع التفكير العميق</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Logic Processing</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSettings({...settings, deepThinking: !settings.deepThinking})} 
                        className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${settings.deepThinking ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.deepThinking ? 'right-9' : 'right-1.5'}`}></div>
                      </button>
                   </div>

                   {settings.deepThinking && (
                     <div className="space-y-5 animate-in slide-in-from-top-4 duration-500 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                           <span>ميزانية التفكير</span>
                           <span className="text-blue-600">{settings.thinkingBudget.toLocaleString()} Token</span>
                        </div>
                        <input 
                          type="range" 
                          min="4000" 
                          max="32000" 
                          step="1000"
                          value={settings.thinkingBudget}
                          onChange={(e) => handleThinkingBudgetChange(e.target.value)}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between gap-2">
                           {[8000, 16000, 24000, 32000].map(v => (
                             <button key={v} onClick={() => setSettings({...settings, thinkingBudget: v})} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border transition-all ${settings.thinkingBudget === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                               {v/1000}K
                             </button>
                           ))}
                        </div>
                     </div>
                   )}
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500"><Globe className="w-6 h-6" /></div>
                        <div>
                          <p className="text-base font-black text-slate-800">البحث في جوجل</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Grounding</p>
                        </div>
                      </div>
                      <button 
                        disabled={!settings.model.includes('pro')}
                        onClick={() => setSettings({...settings, googleSearch: !settings.googleSearch})} 
                        className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${settings.googleSearch ? 'bg-emerald-600' : 'bg-slate-200'} ${!settings.model.includes('pro') ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.googleSearch ? 'right-9' : 'right-1.5'}`}></div>
                      </button>
                   </div>
                   {!settings.model.includes('pro') && (
                     <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <p className="text-[9px] text-rose-600 font-black">ميزة البحث متاحة فقط في إصدارات Pro</p>
                     </div>
                   )}
                   <p className="text-xs text-slate-400 font-bold leading-relaxed pr-2">تفعيل هذا الخيار يسمح للذكاء الاصطناعي بالتحقق من أحدث البروتوكولات الطبية العالمية والأبحاث الحديثة عبر الإنترنت.</p>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
           
           <section className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-50 space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-800">تشفير الهوية والوصول</h3>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Gemini Security Key (اختياري)</label>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${settings.apiKey ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {settings.apiKey ? 'مفتاح مخصص نشط' : 'استخدام المفتاح الافتراضي'}
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={settings.apiKey || ''}
                      onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 pr-14 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="اتركه فارغاً لاستخدام المفتاح الافتراضي..."
                    />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">
                      {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                  className="w-full py-4.5 bg-slate-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-3 border border-blue-100"
                >
                  <ExternalLink className="w-4 h-4" /> جلب مفتاح سحابي خاص
                </button>
              </div>
           </section>

           <section className="bg-[#0F172A] p-10 rounded-[3.5rem] text-white shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[100px] -mr-16 -mt-16 opacity-30"></div>
              <div className="relative z-10 flex items-center gap-3 border-b border-white/5 pb-6">
                <UserCog className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black">الشخصية الرقمية</h3>
              </div>

              <div className="relative z-10 space-y-4">
                {Object.values(AIPersonality).map((p) => (
                  <button 
                    key={p}
                    onClick={() => setSettings({...settings, personality: p})}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${settings.personality === p ? 'bg-blue-600 border-blue-500 shadow-xl scale-[1.03]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <span className="text-sm font-black">{p}</span>
                    {settings.personality === p && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
           </section>

           <section className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-50 space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                <Palette className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-800">البيانات المهنية</h3>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mr-2">اسم الطبيب المعالج</label>
                    <input 
                      value={settings.doctorName} 
                      onChange={(e) => setSettings({...settings, doctorName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="د. أحمد..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mr-2">المركز أو المستشفى</label>
                    <input 
                      value={settings.centerName} 
                      onChange={(e) => setSettings({...settings, centerName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="مركز الشفاء..."
                    />
                 </div>
              </div>
           </section>

           <button 
            onClick={onClear} 
            className="w-full py-6 bg-rose-50 text-rose-500 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-4 border border-rose-100 shadow-sm"
           >
             <Trash2 className="w-5 h-5" /> مسح قاعدة بيانات السجلات
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
