import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

const MedicalDisclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('medical_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('medical_disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-6 lg:p-10">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-amber-50 rounded-2xl lg:rounded-3xl flex items-center justify-center text-amber-500 mb-4 lg:mb-6">
                <ShieldAlert className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
              
              <h2 className="text-xl lg:text-2xl font-black text-slate-800 mb-3 lg:mb-4 tracking-tight">إخلاء مسؤولية طبي هام</h2>
              
              <div className="space-y-3 lg:space-y-4 text-slate-600 leading-relaxed font-medium text-xs lg:text-sm">
                <p>
                  نظام <strong>"الحكيم الذكي Pro"</strong> هو أداة استشارية مدعومة بالذكاء الاصطناعي تهدف لمساعدة الكادر الطبي والمرضى في فهم الحالات الصحية.
                </p>
                
                <div className="flex gap-2 lg:gap-3 p-3 lg:p-4 bg-rose-50 rounded-xl lg:rounded-2xl border border-rose-100 text-rose-700">
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                  <p className="text-[10px] lg:text-xs font-bold">
                    هذا التطبيق لا يغني عن التشخيص الطبي المباشر من قبل طبيب مختص. لا تتخذ أي قرارات علاجية أو تتناول أدوية بناءً على هذا التحليل فقط.
                  </p>
                </div>
                
                <p>
                  باستخدامك لهذا التطبيق، فإنك تقر بأنك تتفهم طبيعته الاستشارية وتتحمل كامل المسؤولية عن كيفية استخدام المعلومات المقدمة.
                </p>
              </div>

              <button
                onClick={handleAccept}
                className="w-full mt-6 lg:mt-8 bg-[#0F172A] text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-sm lg:text-base shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 lg:gap-3 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />
                أوافق وأتفهم ذلك
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedicalDisclaimer;
