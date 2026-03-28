import React, { useState } from 'react';
import { SystemSettings, ModelType, ThemeMode } from '../types';
import { 
  Cpu, 
  Brain, 
  Globe, 
  Moon, 
  Sun, 
  Monitor, 
  Save, 
  Trash2, 
  User, 
  Building,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  Key,
  ExternalLink
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  settings: SystemSettings;
  onSave: (settings: SystemSettings) => void;
  onClearRecords: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onClearRecords }) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const models = [
    { id: ModelType.FLASH_2_5, name: 'Gemini 2.5 Flash', desc: 'الأسرع والأكثر كفاءة للمهام اليومية', icon: <Cpu className="w-5 h-5" />, color: 'bg-blue-500', features: ['سرعة عالية', 'تحليل صور', 'دعم لغات'] },
    { id: ModelType.PRO_2_5, name: 'Gemini 2.5 Pro', desc: 'الأكثر ذكاءً للحالات المعقدة', icon: <Brain className="w-5 h-5" />, color: 'bg-purple-500', features: ['تفكير عميق', 'دقة فائقة', 'سياق ضخم'] },
    { id: ModelType.FLASH_3_0, name: 'Gemini 3.0 Flash', desc: 'الجيل القادم من السرعة والذكاء', icon: <Cpu className="w-5 h-5" />, color: 'bg-green-500', features: ['أداء متوازن', 'استجابة فورية', 'بحث متقدم'] },
    { id: ModelType.PRO_3_1, name: 'Gemini 3.1 Pro', desc: 'قمة الذكاء الاصطناعي الطبي', icon: <Brain className="w-5 h-5" />, color: 'bg-red-500', features: ['تحليل تخصصي', 'استنتاج منطقي', 'أعلى دقة'] }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 max-w-md w-full text-center space-y-6 lg:space-y-8 shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-rose-50 text-rose-500 rounded-2xl lg:rounded-[2rem] flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Trash2 className="w-8 h-8 lg:w-12 lg:h-12" />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">حذف جميع السجلات؟</h3>
                <p className="text-sm lg:text-lg text-slate-500 font-medium">هذا الإجراء سيقوم بحذف كافة بيانات المرضى نهائياً من قاعدة البيانات ولا يمكن استعادتها.</p>
              </div>
              <div className="flex gap-3 lg:gap-4">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 lg:py-4 bg-slate-100 text-slate-600 rounded-xl lg:rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 text-sm lg:text-base"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => {
                    onClearRecords();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-3 lg:py-4 bg-rose-600 text-white rounded-xl lg:rounded-2xl font-black hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all active:scale-95 text-sm lg:text-base"
                >
                  تأكيد الحذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8">
        <div className="space-y-1 lg:space-y-2">
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">إعدادات النظام</h2>
          <p className="text-sm lg:text-lg text-slate-500 font-medium">تخصيص تجربة الحكيم برو لتناسب احتياجاتك المهنية</p>
        </div>
        <button 
          onClick={handleSave}
          className={`btn-premium w-full md:w-auto px-8 lg:px-10 py-4 lg:py-5 text-lg lg:text-xl group ${isSaved ? 'bg-emerald-600 shadow-emerald-200' : ''}`}
        >
          {isSaved ? <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" /> : <Save className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform" />}
          {isSaved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: AI Engine */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-10">
          {/* Model Selection */}
          <section className="card-premium space-y-6 lg:space-y-8">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Cpu className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">محرك الذكاء الاصطناعي</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setLocalSettings({ ...localSettings, model: model.id })}
                  className={`p-6 lg:p-8 rounded-2xl lg:rounded-[2.5rem] border-2 transition-all text-right relative group flex flex-col h-full ${localSettings.model === model.id ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-50' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50/50'}`}
                >
                  <div className="flex items-center gap-4 lg:gap-5 mb-4 lg:mb-6">
                    <div className={`${model.color} w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                      {model.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-base lg:text-lg">{model.name}</h4>
                      <p className="text-xs lg:text-sm text-slate-400 font-bold">{model.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {model.features.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {f}
                      </span>
                    ))}
                  </div>
                  {localSettings.model === model.id && (
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Advanced AI Features */}
          <section className="card-premium space-y-6 lg:space-y-8">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">ميزات الذكاء المتقدمة</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[
                { 
                  id: 'deepThinking', 
                  label: 'التفكير العميق (Deep Thinking)', 
                  desc: 'تحليل منطقي مكثف للحالات الصعبة', 
                  icon: <Brain className="w-5 h-5 lg:w-6 lg:h-6" />, 
                  color: 'bg-indigo-50 text-indigo-600',
                  activeColor: 'bg-indigo-600'
                },
                { 
                  id: 'googleSearch', 
                  label: 'البحث في جوجل (Google Search)', 
                  desc: 'الوصول لأحدث الأبحاث الطبية العالمية', 
                  icon: <Globe className="w-5 h-5 lg:w-6 lg:h-6" />, 
                  color: 'bg-emerald-50 text-emerald-600',
                  activeColor: 'bg-emerald-600'
                }
              ].map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-6 lg:p-8 bg-slate-50/50 rounded-2xl lg:rounded-[2.5rem] border border-slate-100/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="flex gap-4 lg:gap-5">
                    <div className={`${feature.color} w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm lg:text-base">{feature.label}</h4>
                      <p className="text-xs text-slate-400 font-bold">{feature.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setLocalSettings({ ...localSettings, [feature.id]: !localSettings[feature.id as keyof SystemSettings] })}
                    className={`w-12 lg:w-16 h-6 lg:h-8 rounded-full transition-all relative shadow-inner ${ localSettings[feature.id as keyof SystemSettings] ? feature.activeColor : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 lg:top-1 w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full transition-all shadow-md ${ localSettings[feature.id as keyof SystemSettings] ? 'left-0.5 lg:left-1' : 'left-6.5 lg:left-9'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: General & Profile */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-10">
          {/* Profile Settings */}
          <section className="card-premium space-y-6 lg:space-y-8">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">الملف الشخصي</h3>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[10px] lg:text-sm font-black text-slate-700 uppercase tracking-widest">اسم الطبيب</label>
                <div className="relative">
                  <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                  <input 
                    type="text" 
                    value={localSettings.doctorName}
                    onChange={(e) => setLocalSettings({ ...localSettings, doctorName: e.target.value })}
                    className="input-premium pr-12 lg:pr-14 h-12 lg:h-14 text-sm lg:text-base"
                  />
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[10px] lg:text-sm font-black text-slate-700 uppercase tracking-widest">اسم المركز الطبي</label>
                <div className="relative">
                  <Building className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                  <input 
                    type="text" 
                    value={localSettings.centerName}
                    onChange={(e) => setLocalSettings({ ...localSettings, centerName: e.target.value })}
                    className="input-premium pr-12 lg:pr-14 h-12 lg:h-14 text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Theme & Voice */}
          <section className="card-premium space-y-6 lg:space-y-8">
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">المظهر والصوت</h3>
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              {[
                { id: ThemeMode.LIGHT, icon: <Sun className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'فاتح' },
                { id: ThemeMode.DARK, icon: <Moon className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'داكن' },
                { id: ThemeMode.SYSTEM, icon: <Monitor className="w-5 h-5 lg:w-6 lg:h-6" />, label: 'تلقائي' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLocalSettings({ ...localSettings, theme: t.id })}
                  className={`p-3 lg:p-5 rounded-xl lg:rounded-[1.5rem] border-2 flex flex-col items-center gap-2 lg:gap-3 transition-all active:scale-90 ${localSettings.theme === t.id ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' : 'border-slate-50 text-slate-400 hover:bg-slate-50'}`}
                >
                  {t.icon}
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between p-4 lg:p-6 bg-slate-50/50 rounded-2xl lg:rounded-[2rem] border border-slate-100/50 group">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all ${localSettings.voiceOutputEnabled ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400'}`}>
                  {localSettings.voiceOutputEnabled ? <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" />}
                </div>
                <span className="font-black text-slate-900 text-sm lg:text-base">الصوت التفاعلي</span>
              </div>
              <button 
                onClick={() => setLocalSettings({ ...localSettings, voiceOutputEnabled: !localSettings.voiceOutputEnabled })}
                className={`w-12 lg:w-16 h-6 lg:h-8 rounded-full transition-all relative shadow-inner ${localSettings.voiceOutputEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-0.5 lg:top-1 w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full transition-all shadow-md ${localSettings.voiceOutputEnabled ? 'left-0.5 lg:left-1' : 'left-6.5 lg:left-9'}`} />
              </button>
            </div>
          </section>

          {/* API Key Section (Optional) */}
          <section className="card-premium space-y-6 lg:space-y-8">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                <Key className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">مفتاح API (اختياري)</h3>
            </div>
            <p className="text-xs lg:text-sm text-slate-500 font-bold leading-relaxed">
              يمكنك اختيار مفتاح API الخاص بك للوصول إلى ميزات متقدمة أو موديلات Gemini المدفوعة. هذا الإعداد اختياري تماماً.
            </p>
            <div className="space-y-3 lg:space-y-4">
              <button 
                onClick={async () => {
                  if (window.aistudio) {
                    await window.aistudio.openSelectKey();
                  }
                }}
                className="w-full py-3 lg:py-4 bg-amber-50 text-amber-700 rounded-xl lg:rounded-2xl font-black border-2 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-3 shadow-sm text-sm lg:text-base"
              >
                <Key className="w-4 h-4 lg:w-5 lg:h-5" />
                تغيير أو اختيار مفتاح API
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
              >
                <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                كيفية الحصول على مفتاح API
              </a>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-rose-50 p-6 lg:p-10 rounded-2xl lg:rounded-[3rem] border border-rose-100 space-y-4 lg:space-y-6 shadow-xl shadow-rose-100/50">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-rose-900 tracking-tight">منطقة الخطر</h3>
            </div>
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-4 lg:py-5 bg-white text-rose-600 rounded-xl lg:rounded-2xl font-black border-2 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-3 shadow-sm text-sm lg:text-base"
            >
              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
              حذف كافة السجلات الطبية
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
