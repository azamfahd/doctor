
import React, { useState } from 'react';
import { 
  Search, Download, FileText, ChevronRight, MessageSquare, Trash2, X, 
  Thermometer, Activity, Calendar, User, Eye, Printer, ChevronLeft,
  AlertCircle, ShieldAlert, CheckCircle2, Info, Clock, HeartPulse, 
  Zap, ArrowUpRight, TrendingUp, Pill, Microscope, Droplets, RefreshCw,
  Apple, Dumbbell, LifeBuoy
} from 'lucide-react';
import { PatientCase } from '../types';

interface RecordsProps {
  records: PatientCase[];
  onStartSession?: (patient: PatientCase) => void;
  onDeleteRecord?: (id: string) => void;
}

const Records: React.FC<RecordsProps> = ({ records, onStartSession, onDeleteRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('الكل');
  const [selectedRecord, setSelectedRecord] = useState<PatientCase | null>(null);

  const filteredRecords = records.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = r.name.toLowerCase().includes(searchLower);
    const diagnosisMatch = r.diagnosis?.conditionName?.toLowerCase().includes(searchLower) || 
                          r.diagnosis?.summary?.toLowerCase().includes(searchLower);
    const statusMatch = filter === 'الكل' || r.status === filter;
    return (nameMatch || diagnosisMatch) && statusMatch;
  });

  const getStatusConfig = (record: PatientCase) => {
    const severity = record.diagnosis?.severity;
    if (severity === 'حرجة' || record.status === 'عاجلة') {
      return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', accent: 'bg-rose-600', icon: ShieldAlert, label: 'حالة حرجة' };
    }
    if (severity === 'مرتفعة') {
      return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', accent: 'bg-orange-600', icon: AlertCircle, label: 'خطورة مرتفعة' };
    }
    if (severity === 'متوسطة' || record.status === 'متابعة') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-600', icon: Clock, label: 'متابعة مستمرة' };
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-500', icon: CheckCircle2, label: 'حالة مستقرة' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-['Tajawal']">
      {/* Detail Modal Overlay */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedRecord(null)}></div>
           <div className="relative bg-[#F8FAFC] w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center gap-5">
                   <button onClick={() => setSelectedRecord(null)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all">
                      <X className="w-6 h-6" />
                   </button>
                   <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedRecord.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">سجل طبي رقم: {selectedRecord.id.slice(-8)}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusConfig(selectedRecord).bg} ${getStatusConfig(selectedRecord).text} border ${getStatusConfig(selectedRecord).border}`}>
                      {getStatusConfig(selectedRecord).label}
                   </div>
                   <button onClick={() => window.print()} className="p-3 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                      <Printer className="w-6 h-6" />
                   </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 no-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                       <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Zap className="w-6 h-6" /></div>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التشخيص والملخص</h4>
                          </div>
                          <h5 className="text-3xl font-black text-slate-900 mb-4">{selectedRecord.diagnosis?.conditionName}</h5>
                          <p className="text-base text-slate-600 leading-relaxed font-medium">{selectedRecord.diagnosis?.summary}</p>
                       </section>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50">
                             <h4 className="flex items-center gap-3 text-blue-900 font-black text-xs uppercase mb-6"><Pill className="w-5 h-5" /> المسار العلاجي</h4>
                             <ul className="space-y-3">
                                {selectedRecord.diagnosis?.treatmentPlan?.map((item, i) => (
                                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-700 leading-relaxed">• {item}</li>
                                ))}
                             </ul>
                          </div>
                          <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100/50">
                             <h4 className="flex items-center gap-3 text-emerald-900 font-black text-xs uppercase mb-6"><Apple className="w-5 h-5" /> التغذية العلاجية</h4>
                             <ul className="space-y-3">
                                {selectedRecord.diagnosis?.dietaryAdvice?.map((item, i) => (
                                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-700 leading-relaxed">• {item}</li>
                                ))}
                             </ul>
                          </div>
                          <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100/50">
                             <h4 className="flex items-center gap-3 text-orange-900 font-black text-xs uppercase mb-6"><Dumbbell className="w-5 h-5" /> التأهيل البدني</h4>
                             <ul className="space-y-3">
                                {selectedRecord.diagnosis?.physicalTherapy?.map((item, i) => (
                                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-700 leading-relaxed">• {item}</li>
                                ))}
                             </ul>
                          </div>
                          <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50">
                             <h4 className="flex items-center gap-3 text-indigo-900 font-black text-xs uppercase mb-6"><LifeBuoy className="w-5 h-5" /> جودة الحياة</h4>
                             <ul className="space-y-3">
                                {selectedRecord.diagnosis?.lifestyleChanges?.map((item, i) => (
                                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-700 leading-relaxed">• {item}</li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                       <section className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-8">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">المؤشرات الحيوية للجلسة</h4>
                          <div className="grid grid-cols-2 gap-4">
                             {[
                               { label: 'الحرارة', val: `${selectedRecord.vitals.temperature}°C`, icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
                               { label: 'الضغط', val: selectedRecord.vitals.bloodPressure, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
                               { label: 'النبض', val: selectedRecord.vitals.pulse, icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                               { label: 'الأكسجين', val: `${selectedRecord.vitals.spo2}%`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' }
                             ].map((v, i) => (
                               <div key={i} className={`${v.bg} p-4 rounded-2xl flex flex-col items-center text-center border border-white`}>
                                  <v.icon className={`w-5 h-5 ${v.color} mb-2`} />
                                  <span className="text-base font-black text-slate-800">{v.val}</span>
                                  <span className="text-[8px] text-slate-400 font-black uppercase mt-1">{v.label}</span>
                               </div>
                             ))}
                          </div>
                       </section>

                       <section className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-xl">
                          <div className="flex items-center gap-2 mb-6">
                             <User className="w-5 h-5 text-blue-400" />
                             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">تفاصيل المريض</h4>
                          </div>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-xs font-bold text-slate-400">العمر</span>
                                <span className="text-xs font-black">{selectedRecord.age} سنة</span>
                             </div>
                             <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-xs font-bold text-slate-400">الجنس</span>
                                <span className="text-xs font-black">{selectedRecord.gender}</span>
                             </div>
                             <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-xs font-bold text-slate-400">تاريخ الفحص</span>
                                <span className="text-xs font-black">{selectedRecord.date}</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => { onStartSession?.(selectedRecord); setSelectedRecord(null); }}
                            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                          >
                             <MessageSquare className="w-4 h-4" /> فتح الاستشارة الذكية
                          </button>
                       </section>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Main List UI - Simplified for space */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في الأرشيف الطبي..."
            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-50 rounded-2xl py-4 pr-14 pl-6 outline-none transition-all font-bold text-slate-700 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['الكل', 'عاجلة', 'متابعة', 'عادية'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all border-2 ${
                filter === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {filteredRecords.map((record) => {
          const cfg = getStatusConfig(record);
          return (
            <div 
              key={record.id} 
              onClick={() => setSelectedRecord(record)}
              className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 ${cfg.bg} rounded-[1.5rem] flex items-center justify-center border ${cfg.border} transition-transform group-hover:scale-105`}>
                   {React.createElement(cfg.icon, { className: `w-8 h-8 ${cfg.text}` })}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">{record.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.text}`}>
                       {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-4">
                    <span>{record.diagnosis?.conditionName}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span>{record.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Eye className="w-5 h-5" /></button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteRecord?.(record.id); }}
                      className="p-3 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"
                    ><Trash2 className="w-5 h-5" /></button>
                 </div>
                 <ChevronLeft className={`w-6 h-6 ${cfg.text} group-hover:-translate-x-2 transition-transform`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Records;
