import React, { useState } from 'react';
import { PatientCase } from '../types';
import { Search, Eye, MessageSquare, Trash2, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecordsProps {
  records: PatientCase[];
  onSelect: (record: PatientCase) => void;
  onDelete: (id: string) => void;
  onConsult: (record: PatientCase) => void;
}

const Records: React.FC<RecordsProps> = ({ records, onSelect, onDelete, onConsult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'normal' | 'follow-up' | 'urgent'>('all');

  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || record.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {recordToDelete && (
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
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">هل أنت متأكد؟</h3>
                <p className="text-sm lg:text-lg text-slate-500 font-medium">سيتم حذف هذا السجل الطبي نهائياً من قاعدة البيانات ولا يمكن استعادته.</p>
              </div>
              <div className="flex gap-3 lg:gap-4">
                <button 
                  onClick={() => setRecordToDelete(null)}
                  className="flex-1 py-3 lg:py-4 bg-slate-100 text-slate-600 rounded-xl lg:rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 text-sm lg:text-base"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => {
                    onDelete(recordToDelete);
                    setRecordToDelete(null);
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

      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 lg:gap-8">
        <div className="space-y-1 lg:space-y-2">
          <h2 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">سجلات المرضى</h2>
          <p className="text-sm lg:text-lg text-slate-500 font-medium">إدارة ومراجعة كافة الحالات الطبية المسجلة في المركز</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4 w-full xl:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 lg:w-6 lg:h-6" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الأعراض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pr-12 lg:pr-14 text-sm lg:text-base h-12 lg:h-14"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'normal' | 'follow-up' | 'urgent')}
            className="input-premium md:w-48 font-black appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.5em_1.5em] text-sm lg:text-base h-12 lg:h-14"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
          >
            <option value="all">كل الحالات</option>
            <option value="normal">عادي</option>
            <option value="follow-up">متابعة</option>
            <option value="urgent">عاجل</option>
          </select>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
        {filteredRecords.map((record, i) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="card-premium group p-0 overflow-hidden flex flex-col h-full hover:-translate-y-2 lg:hover:-translate-y-3 transition-all duration-700 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]"
          >
            <div className="p-6 lg:p-10 space-y-6 lg:space-y-10 flex-grow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 bg-slate-50 text-blue-600 rounded-2xl lg:rounded-[2rem] flex items-center justify-center font-black text-xl lg:text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-700 ease-out">
                    {record.name[0]}
                  </div>
                  <div className="space-y-0.5 lg:space-y-1">
                    <h3 className="text-lg lg:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">{record.name}</h3>
                    <div className="flex items-center gap-1.5 lg:gap-2 text-slate-400 text-[10px] lg:text-sm font-bold">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                      {record.date}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 lg:gap-3">
                  <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                    record.status === 'urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                    record.status === 'follow-up' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {record.status === 'urgent' ? 'عاجل' : record.status === 'follow-up' ? 'متابعة' : 'عادي'}
                  </span>
                  <span className="text-[8px] lg:text-[10px] font-black text-slate-300 uppercase tracking-widest">#{record.id.slice(-6)}</span>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-2 gap-3 lg:gap-5">
                  <div className="bg-slate-50/50 p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-inner transition-all duration-500">
                    <p className="text-slate-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-1 lg:mb-2">العمر</p>
                    <p className="font-black text-slate-900 text-sm lg:text-lg">{record.age} سنة</p>
                  </div>
                  <div className="bg-slate-50/50 p-3 lg:p-5 rounded-2xl lg:rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-inner transition-all duration-500">
                    <p className="text-slate-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-1 lg:mb-2">الجنس</p>
                    <p className="font-black text-slate-900 text-sm lg:text-lg">{record.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50/50 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-100/50 group-hover:bg-white group-hover:shadow-inner transition-all duration-500">
                  <p className="text-slate-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mb-2 lg:mb-3">الأعراض والشكوى</p>
                  <p className="text-slate-700 line-clamp-3 font-medium leading-relaxed text-xs lg:text-base">{record.symptoms}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-5 pt-2 lg:pt-4">
                <button 
                  onClick={() => onSelect(record)}
                  className="flex items-center justify-center gap-2 lg:gap-3 py-3 lg:py-5 bg-slate-100 text-slate-600 rounded-xl lg:rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 group/btn text-xs lg:text-base"
                >
                  <Eye className="w-4 h-4 lg:w-6 lg:h-6 group-hover/btn:scale-110 transition-transform" />
                  التفاصيل
                </button>
                <button 
                  onClick={() => onConsult(record)}
                  className="flex items-center justify-center gap-2 lg:gap-3 py-3 lg:py-5 bg-blue-600 text-white rounded-xl lg:rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 group/btn text-xs lg:text-base"
                >
                  <MessageSquare className="w-4 h-4 lg:w-6 lg:h-6 group-hover/btn:scale-110 transition-transform" />
                  استشارة
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setRecordToDelete(record.id)}
              className="w-full py-3 lg:py-5 bg-rose-50 text-rose-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-rose-600 hover:text-white flex items-center justify-center gap-2 lg:gap-4 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
              حذف السجل نهائياً
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 lg:py-24 bg-white rounded-3xl lg:rounded-[4rem] border-4 border-dashed border-slate-100 space-y-6 lg:space-y-8">
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner animate-float">
            <FileText className="w-12 h-12 lg:w-16 lg:h-16 text-slate-200" />
          </div>
          <div className="space-y-1 lg:space-y-2 px-4">
            <h3 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tight">لا توجد نتائج بحث</h3>
            <p className="text-sm lg:text-lg text-slate-500 font-medium">جرب البحث بكلمات أخرى أو تغيير الفلتر للحصول على نتائج.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
