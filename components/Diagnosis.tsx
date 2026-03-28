
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Activity, Thermometer, Droplets, HeartPulse, Trash, 
  ImagePlus, Microscope, FileSearch
} from 'lucide-react';
import { PatientCase, VitalSigns } from '../types';

interface DiagnosisProps {
  onAnalyze: (data: Partial<PatientCase>) => void;
  isAnalyzing: boolean;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ onAnalyze, isAnalyzing }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [symptoms, setSymptoms] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: '',
    pulse: '',
    temperature: '',
    spo2: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = ["بدء المسح...", "تحليل المؤشرات...", "معالجة الصور...", "توليد التقرير..."];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => setAnalysisStep(prev => (prev + 1) % steps.length), 3000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleSubmit = () => {
    if (!name || !symptoms) {
      alert("يرجى إكمال البيانات الأساسية.");
      return;
    }
    onAnalyze({ name, age, gender, symptoms, vitals, image: image || undefined });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative animate-in slide-in-from-bottom-6 duration-500">
      {isAnalyzing && (
        <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-black text-white mb-2">جاري الكشف والتحليل</h2>
          <p className="text-blue-400 font-bold text-sm animate-pulse-soft">{steps[analysisStep]}</p>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 lg:p-10 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
           <div className="p-3 bg-blue-600 text-white rounded-2xl"><FileSearch className="w-5 h-5" /></div>
           <div>
              <h2 className="text-lg lg:text-xl font-black text-slate-800">وحدة التشخيص</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Diagnostic Engine v3</p>
           </div>
        </div>

        <div className="p-6 lg:p-10 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-2 uppercase">الاسم</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-100 rounded-xl px-4 py-3.5 outline-none font-bold text-sm transition-all" placeholder="اسم المريض" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-2 uppercase">العمر</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-100 rounded-xl px-4 py-3.5 outline-none font-bold text-sm transition-all" placeholder="العمر" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 pr-2 uppercase">الجنس</label>
              <div className="flex gap-2">
                <button onClick={() => setGender('ذكر')} className={`flex-1 py-3.5 rounded-xl font-black text-xs transition-all ${gender === 'ذكر' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>ذكر</button>
                <button onClick={() => setGender('أنثى')} className={`flex-1 py-3.5 rounded-xl font-black text-xs transition-all ${gender === 'أنثى' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>أنثى</button>
              </div>
            </div>
          </div>

          {/* Symptoms Area */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 pr-2 uppercase">وصف الأعراض أو التقارير</label>
            <textarea 
              value={symptoms} 
              onChange={e => setSymptoms(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-100 rounded-2xl p-5 h-36 outline-none font-bold text-sm text-slate-700 resize-none leading-relaxed" 
              placeholder="اكتب هنا الأعراض بالتفصيل..."
            />
          </div>

          {/* Vitals Grid - Always 2 cols on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'الحرارة', icon: Thermometer, key: 'temperature', unit: '°C' },
              { label: 'الضغط', icon: HeartPulse, key: 'bloodPressure', unit: 'mmHg' },
              { label: 'النبض', icon: Activity, key: 'pulse', unit: 'BPM' },
              { label: 'الأكسجين', icon: Droplets, key: 'spo2', unit: '%' }
            ].map((v) => (
              <div key={v.key} className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <v.icon className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase">{v.label}</span>
                 </div>
                 <input 
                   value={(vitals as any)[v.key]} 
                   onChange={e => setVitals({...vitals, [v.key]: e.target.value})}
                   className="bg-transparent border-none outline-none font-black text-slate-800 text-base w-full" 
                   placeholder="--" 
                 />
              </div>
            ))}
          </div>

          {/* Image Uploader */}
          <div 
            className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-blue-50 transition-all cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <div className="relative">
                <img src={image} className="h-32 rounded-xl shadow-md" alt="doc" />
                <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg"><Trash className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-black text-slate-600">أرفق صور الأشعة أو التقارير</p>
              </>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Submit Action */}
          <button 
            disabled={isAnalyzing || !name}
            onClick={handleSubmit}
            className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black text-base shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            تحليل الحالة الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
