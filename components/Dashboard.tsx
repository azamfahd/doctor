import React from 'react';
import { PatientCase, SystemSettings } from '../types';
import { Plus, Users, Activity, ArrowRight, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  records: PatientCase[];
  settings: SystemSettings;
  onNewCase: () => void;
  onViewAll: () => void;
  onSelectRecord: (record: PatientCase) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, settings, onNewCase, onViewAll, onSelectRecord }) => {
  const recentRecords = records.slice(0, 5);

  const stats = [
    { label: 'إجمالي السجلات', value: records.length, icon: <Users className="w-8 h-8" />, color: 'bg-blue-500' },
    { label: 'حالات اليوم', value: records.filter(r => r.date === new Date().toLocaleDateString('ar-EG')).length, icon: <Activity className="w-8 h-8" />, color: 'bg-emerald-500' },
    { label: 'دقة التحليل', value: '98.5%', icon: <Activity className="w-8 h-8" />, color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
        <div className="space-y-1 lg:space-y-2">
          <h1 className="text-2xl lg:text-6xl font-black text-slate-900 tracking-tight">مرحباً، {settings.doctorName}</h1>
          <p className="text-sm lg:text-xl text-slate-500 font-medium flex items-center gap-2 lg:gap-3">
            لديك <span className="text-blue-600 font-black text-base lg:text-2xl">{records.length}</span> سجل طبي في {settings.centerName}
            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full animate-pulse" />
          </p>
        </div>
        <button 
          onClick={onNewCase}
          className="btn-premium w-full md:w-auto px-6 lg:px-10 py-4 lg:py-6 text-base lg:text-xl group shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
        >
          <Plus className="w-5 h-5 lg:w-7 lg:h-7 group-hover:rotate-90 transition-transform duration-500" />
          بدء تشخيص جديد
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="card-premium p-5 lg:p-10 flex items-center gap-4 lg:gap-8 group border-none shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className={`${stat.color} p-4 lg:p-6 rounded-xl lg:rounded-[2rem] text-white shadow-2xl shadow-blue-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              {React.cloneElement(stat.icon as React.ReactElement<any>, { className: "w-5 h-5 lg:w-8 lg:h-8" })}
            </div>
            <div className="space-y-0.5 lg:space-y-1">
              <p className="text-slate-400 font-black text-[8px] lg:text-xs uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl lg:text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Recent Records */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-3xl font-black text-slate-900 flex items-center gap-3 lg:gap-6">
              <div className="w-2 h-6 lg:w-3 lg:h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-100" />
              أحدث السجلات الطبية
            </h2>
            <button 
              onClick={onViewAll}
              className="text-blue-600 font-black hover:text-blue-700 flex items-center gap-2 lg:gap-3 group transition-all text-sm lg:text-lg"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform rotate-180" />
            </button>
          </div>

          <div className="space-y-3 lg:space-y-6">
            {recentRecords.length > 0 ? (
              recentRecords.map((record, i) => (
                <motion.div 
                  key={record.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => onSelectRecord(record)}
                  className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 lg:gap-8">
                    <div className="w-12 h-12 lg:w-20 lg:h-20 bg-slate-50 text-blue-600 rounded-xl lg:rounded-[2rem] flex items-center justify-center font-black text-lg lg:text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {record.name[0]}
                    </div>
                    <div className="space-y-0.5 lg:space-y-1">
                      <h3 className="font-black text-slate-900 text-base lg:text-2xl group-hover:text-blue-600 transition-colors tracking-tight">{record.name}</h3>
                      <p className="text-xs lg:text-lg text-slate-400 font-bold flex items-center gap-2 lg:gap-3">
                        {record.age} سنة 
                        <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-slate-200 rounded-full" />
                        {record.gender}
                        <span className="hidden sm:inline w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        <span className="hidden sm:inline">{record.date}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 lg:gap-10">
                    <span className={`px-3 lg:px-6 py-1 lg:py-2 rounded-lg lg:rounded-2xl text-[8px] lg:text-xs font-black uppercase tracking-[0.2em] shadow-sm ${
                      record.status === 'urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                      record.status === 'follow-up' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {record.status === 'urgent' ? 'عاجل' : record.status === 'follow-up' ? 'متابعة' : 'عادي'}
                    </span>
                    <div className="w-8 h-8 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all duration-500 shadow-inner">
                      <ArrowRight className="w-4 h-4 lg:w-7 lg:h-7 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all rotate-180" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-8 lg:p-24 rounded-2xl lg:rounded-[4rem] border border-dashed border-slate-200 text-center space-y-4 lg:space-y-8 shadow-inner">
                <div className="w-16 h-16 lg:w-32 lg:h-32 bg-slate-50 rounded-xl lg:rounded-[3rem] flex items-center justify-center mx-auto animate-float shadow-sm">
                  <UserPlus className="w-8 h-8 lg:w-16 lg:h-16 text-slate-300" />
                </div>
                <div className="space-y-1 lg:space-y-3">
                  <h3 className="text-xl lg:text-3xl font-black text-slate-900">لا توجد سجلات بعد</h3>
                  <p className="text-sm lg:text-xl text-slate-500 font-medium">ابدأ بإضافة أول حالة طبية للتشخيص الذكي.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6 lg:space-y-10">
          <h2 className="text-xl lg:text-3xl font-black text-slate-900 flex items-center gap-3 lg:gap-6">
            <div className="w-2 h-6 lg:w-3 lg:h-10 bg-slate-900 rounded-full shadow-lg shadow-slate-100" />
            إحصائيات ذكية
          </h2>
          <div className="bg-slate-900 p-6 lg:p-12 rounded-2xl lg:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6 lg:space-y-10">
              <div className="space-y-1 lg:space-y-4">
                <p className="text-slate-400 font-black text-[8px] lg:text-xs uppercase tracking-[0.3em]">النموذج النشط</p>
                <h3 className="text-xl lg:text-4xl font-black tracking-tighter text-blue-400">{settings.model.split('-').slice(0, 2).join(' ').toUpperCase()}</h3>
              </div>
              <div className="h-px bg-white/10" />
              <div className="space-y-3 lg:space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-black text-[10px] lg:text-sm uppercase tracking-widest">البحث الذكي</span>
                  <span className={`px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-md lg:rounded-xl text-[7px] lg:text-[10px] font-black tracking-widest uppercase shadow-sm ${settings.googleSearch ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-rose-400/20 text-rose-400 border border-rose-400/30'}`}>
                    {settings.googleSearch ? 'مفعل' : 'معطل'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-black text-[10px] lg:text-sm uppercase tracking-widest">التفكير العميق</span>
                  <span className={`px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-md lg:rounded-xl text-[7px] lg:text-[10px] font-black tracking-widest uppercase shadow-sm ${settings.deepThinking ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-rose-400/20 text-rose-400 border border-rose-400/30'}`}>
                    {settings.deepThinking ? 'مفعل' : 'معطل'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 lg:p-10 space-y-3 lg:space-y-6 border-l-8 border-l-blue-600 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="font-black text-slate-900 text-lg lg:text-2xl tracking-tight relative z-10">نصيحة اليوم</h3>
            <p className="text-slate-500 leading-relaxed text-sm lg:text-lg font-medium relative z-10">
              استخدم ميزة "التفكير العميق" للحالات الطبية المعقدة التي تتطلب تحليلاً دقيقاً للأعراض المتداخلة للوصول لأفضل تشخيص.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
