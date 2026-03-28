import React, { useState, useRef } from 'react';
import { PatientCase, SystemSettings } from '../types';
import { Camera, Send, Loader2, User, Calendar, Activity, Thermometer, Droplets, Heart, Wind, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagnosisProps {
  settings: SystemSettings;
  onAnalyze: (patient: PatientCase) => void;
  isAnalyzing: boolean;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ onAnalyze, isAnalyzing }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'ذكر',
    symptoms: '',
    temp: '',
    bp: '',
    pulse: '',
    oxygen: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient: PatientCase = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      symptoms: formData.symptoms,
      vitals: {
        temp: formData.temp,
        bp: formData.bp,
        pulse: formData.pulse,
        oxygen: formData.oxygen
      },
      image: image || undefined,
      chatHistory: [],
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'normal'
    };
    onAnalyze(patient);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-24">
      <div className="card-premium overflow-hidden p-0 border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/80 backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7 p-5 lg:p-16 space-y-6 lg:space-y-12">
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-2xl lg:text-5xl font-black text-slate-900 tracking-tight">تشخيص حالة جديدة</h2>
              <p className="text-slate-500 text-base lg:text-xl font-medium leading-relaxed">أدخل بيانات المريض بدقة للحصول على أفضل النتائج الطبية المدعومة بالذكاء الاصطناعي</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-10">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
                <div className="md:col-span-2 space-y-2 lg:space-y-4">
                  <label className="text-[10px] lg:text-xs font-black text-slate-400 flex items-center gap-2 lg:gap-3 uppercase tracking-[0.2em]">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <User className="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    اسم المريض الكامل
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل الاسم الرباعي للمريض"
                    className="input-premium py-3.5 lg:py-5 text-base lg:text-lg"
                  />
                </div>
                <div className="space-y-2 lg:space-y-4">
                  <label className="text-[10px] lg:text-xs font-black text-slate-400 flex items-center gap-2 lg:gap-3 uppercase tracking-[0.2em]">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    العمر
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="00"
                    className="input-premium py-3.5 lg:py-5 text-base lg:text-lg text-center"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2 lg:space-y-4">
                <label className="text-[10px] lg:text-xs font-black text-slate-400 flex items-center gap-2 lg:gap-3 uppercase tracking-[0.2em]">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4" />
                  </div>
                  الجنس
                </label>
                <div className="grid grid-cols-2 gap-3 lg:gap-6">
                  {['ذكر', 'أنثى'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-3.5 lg:py-5 rounded-2xl lg:rounded-3xl font-black text-base lg:text-lg transition-all border-2 ${
                        formData.gender === g 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200 scale-[1.02]' 
                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2 lg:space-y-4">
                <label className="text-[10px] lg:text-xs font-black text-slate-400 flex items-center gap-2 lg:gap-3 uppercase tracking-[0.2em]">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4" />
                  </div>
                  الأعراض والشكوى الرئيسية
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="اشرح الأعراض التي يعاني منها المريض بالتفصيل، متى بدأت؟ وما هي شدتها؟"
                  className="input-premium min-h-[120px] lg:min-h-[180px] resize-none py-4 lg:py-6 text-base lg:text-lg leading-relaxed"
                />
              </div>

              {/* Vitals */}
              <div className="space-y-3 lg:space-y-6">
                <label className="text-[10px] lg:text-xs font-black text-slate-400 flex items-center gap-2 lg:gap-3 uppercase tracking-[0.2em]">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Activity className="w-3 h-3 lg:w-4 lg:h-4" />
                  </div>
                  العلامات الحيوية (اختياري)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
                  {[
                    { id: 'temp', label: 'الحرارة', icon: <Thermometer className="w-3 h-3 lg:w-4 lg:h-4" />, placeholder: '37' },
                    { id: 'bp', label: 'الضغط', icon: <Droplets className="w-3 h-3 lg:w-4 lg:h-4" />, placeholder: '120/80' },
                    { id: 'pulse', label: 'النبض', icon: <Heart className="w-3 h-3 lg:w-4 lg:h-4" />, placeholder: '75' },
                    { id: 'oxygen', label: 'الأكسجين', icon: <Wind className="w-3 h-3 lg:w-4 lg:h-4" />, placeholder: '98%' }
                  ].map((vital) => (
                    <div key={vital.id} className="space-y-1.5 lg:space-y-3">
                      <div className="flex items-center gap-2 px-1 lg:px-2">
                        <span className="text-blue-600">{vital.icon}</span>
                        <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{vital.label}</span>
                      </div>
                      <input
                        type="text"
                        value={formData[vital.id as keyof typeof formData] as string}
                        onChange={(e) => setFormData({ ...formData, [vital.id]: e.target.value })}
                        placeholder={vital.placeholder}
                        className="input-premium py-2.5 lg:py-4 text-sm lg:text-base text-center font-black"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn-premium w-full py-5 lg:py-8 text-lg lg:text-2xl group shadow-[0_25px_60px_rgba(37,99,235,0.3)]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 lg:w-8 lg:h-8 animate-spin" />
                    جاري تحليل الحالة...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 lg:w-8 lg:h-8 rotate-180 group-hover:-translate-x-3 transition-transform duration-500" />
                    إرسال للتحليل الذكي
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Image Side */}
          <div className="lg:col-span-5 bg-slate-50/80 p-5 lg:p-16 flex flex-col items-center justify-center space-y-6 lg:space-y-12 border-r border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl" />
            
            <div className="text-center space-y-2 lg:space-y-4 relative z-10">
              <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">المرفقات الطبية</h3>
              <p className="text-slate-500 text-sm lg:text-lg font-medium leading-relaxed">يمكنك رفع صور الأشعة، التحاليل المخبرية، أو التقارير الطبية للتحليل</p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-square max-w-[240px] lg:max-w-sm rounded-3xl lg:rounded-[4rem] border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-6 lg:p-8 cursor-pointer relative overflow-hidden group shadow-2xl ${image ? 'border-blue-500 bg-white scale-[1.02]' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 hover:scale-[1.02]'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              
              {image ? (
                <>
                  <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded-2xl lg:rounded-[3rem]" />
                  <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-md">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setImage(null); }}
                      className="w-14 h-14 lg:w-20 lg:h-20 bg-rose-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center justify-center"
                    >
                      <X className="w-6 h-6 lg:w-10 lg:h-10" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 lg:space-y-8">
                  <div className="w-16 h-16 lg:w-32 lg:h-32 bg-blue-50 text-blue-600 rounded-2xl lg:rounded-[3rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl shadow-blue-100/50">
                    <Camera className="w-8 h-8 lg:w-16 lg:h-16" />
                  </div>
                  <div className="space-y-1 lg:space-y-3">
                    <p className="font-black text-slate-900 text-lg lg:text-2xl tracking-tight">اضغط للرفع أو السحب</p>
                    <p className="text-[8px] lg:text-sm text-slate-400 font-black uppercase tracking-[0.2em]">PNG, JPG حتى 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-effect p-5 lg:p-10 rounded-2xl lg:rounded-[3rem] w-full max-w-[240px] lg:max-w-sm border border-blue-100/50 shadow-xl relative z-10">
              <div className="flex gap-3 lg:gap-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-blue-200">
                  <Activity className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                </div>
                <p className="text-xs lg:text-base text-blue-900 leading-relaxed font-bold">
                  يتم تحليل الصور باستخدام تقنية <span className="text-blue-600 font-black">Vision</span> المتقدمة للتعرف على العلامات السريرية في التقارير والأشعة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Progress Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center"
          >
            <div className="text-center space-y-4 lg:space-y-8">
              <div className="relative">
                <div className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-blue-100 rounded-full mx-auto" />
                <div className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute inset-0 mx-auto" />
                <Activity className="w-8 h-8 lg:w-12 lg:h-12 text-blue-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl lg:text-3xl font-black text-gray-900">جاري معالجة البيانات...</h2>
                <p className="text-sm lg:text-lg text-gray-500">يقوم الحكيم بتحليل الأعراض ومقارنتها بالقواعد الطبية</p>
              </div>
              <div className="flex gap-2 justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diagnosis;
