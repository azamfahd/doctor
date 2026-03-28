
import React from 'react';
import { Plus, Clock, Database, ShieldCheck, Activity, Search } from 'lucide-react';
import { PatientCase } from '../types';

interface DashboardProps {
  doctorName: string;
  records: PatientCase[];
  onNewCase: () => void;
  onViewAll: () => void;
  activeModel: string;
  isThinking: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ doctorName, records, onNewCase, onViewAll, activeModel, isThinking }) => {
  const recentRecords = records.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Hero - Responsive Height & Padding */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-[#0F172A] p-8 lg:p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=800" alt="bg" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 block">نظام الحكيم المطور</span>
            <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">مرحباً دكتور {doctorName.split(' ')[0]}</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mb-6 leading-relaxed">الذكاء الاصطناعي جاهز لتحليل الحالات المعقدة وتوفير الوقت والجهد في التشخيص السريري.</p>
            <button 
              onClick={onNewCase}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" />
              بدء كشف جديد
            </button>
          </div>
          <div className="hidden md:flex w-24 h-24 bg-white/5 rounded-3xl items-center justify-center border border-white/10">
            <ShieldCheck className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Stats Grid - 2 cols on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
            <Database className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-2xl font-black text-slate-800">{records.length}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">إجمالي الحالات</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
            <Search className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-2xl font-black text-slate-800">99%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">دقة التحليل</span>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-[#0F172A] p-6 rounded-3xl border-b-4 border-blue-500 text-white flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">المحرك الحالي</p>
              <p className="text-sm font-black truncate">{activeModel.includes('pro') ? 'Gemini Pro Elite' : 'Flash Analytics'}</p>
            </div>
            <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> آخر السجلات
          </h3>
          <button onClick={onViewAll} className="text-xs font-black text-blue-600">عرض الكل</button>
        </div>
        <div className="p-4 space-y-3">
          {recentRecords.length > 0 ? (
            recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.status === 'عاجلة' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="max-w-[150px] sm:max-w-none">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{record.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{record.diagnosis?.conditionName} • {record.date}</p>
                  </div>
                </div>
                <span className={`text-[8px] px-2 py-1 rounded-md font-black ${record.status === 'عاجلة' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {record.status}
                </span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">لا توجد سجلات</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
