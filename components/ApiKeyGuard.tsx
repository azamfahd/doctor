import React, { useEffect, useState } from 'react';
import { Key, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface ApiKeyGuardProps {
  onKeySelected: () => void;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback for local dev
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      onKeySelected();
    }
  };

  if (hasKey === null) return null;
  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-blue-600 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">مرحباً بك في الحكيم Pro</h2>
            <p className="text-blue-100">تحتاج إلى اختيار مفتاح API للبدء</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">أمان وخصوصية تامة</h3>
                <p className="text-sm text-gray-500">يتم استخدام مفتاحك الشخصي فقط لتشغيل ميزات الذكاء الاصطناعي المتقدمة.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">دعم موديلات Gemini 3</h3>
                <p className="text-sm text-gray-500">يتيح لك المفتاح الوصول إلى أحدث تقنيات Google الطبية.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleOpenKeySelector}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              اختيار مفتاح API الآن
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center text-sm text-gray-400 hover:text-blue-600 transition-colors"
            >
              تعرف على كيفية الحصول على مفتاح API
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiKeyGuard;
