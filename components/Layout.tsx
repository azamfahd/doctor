
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Settings, MessageSquareQuote, WifiOff, Menu, LogOut, ShieldCheck, Zap, Database, Activity, Cpu, Camera, User, X, AlertCircle
} from 'lucide-react';
import { SystemSettings } from '../types';

const AlHakimLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
    </defs>
    <path d="M50 10L85 27.5V72.5L50 90L15 72.5V27.5L50 10Z" stroke="url(#mainGrad)" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M25 50H35L42 20L52 80L58 45L64 55L75 50H85" stroke="url(#mainGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, settings, onUpdateSettings }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const tabs = [
    { id: 'home', icon: Home, label: 'لوحة التحكم' },
    { id: 'diagnosis', icon: Zap, label: 'الكشف الخوارزمي' },
    { id: 'consult', icon: MessageSquareQuote, label: 'الاستشارة' },
    { id: 'records', icon: Database, label: 'السجلات' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Content - Reduced width to w-64 */}
      <aside className={`fixed top-0 right-0 bottom-0 z-[110] w-[80%] sm:w-64 bg-[#0F172A] shadow-2xl transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex flex-col items-center">
            <AlHakimLogo className="w-14 h-14 mb-4" />
            <h1 className="text-xl font-black text-white">الحكيم الذكي <span className="text-cyan-400">Pro</span></h1>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} 
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-6">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 font-bold text-xs hover:text-rose-400 transition-all">
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container - Adjusted margin-right to mr-64 */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all lg:mr-64`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl px-4 lg:px-8 h-16 flex items-center justify-between shadow-sm sticky top-0 z-[90] border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 text-slate-600 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <h2 className="text-sm font-extrabold text-slate-800 line-clamp-1">د. {settings.doctorName}</h2>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{isOnline ? 'متصل' : 'أوفلاين'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden bg-slate-100 shadow-sm">
                {settings.profileImage ? (
                  <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                )}
             </div>
          </div>
        </header>

        {/* Use Public Key Warning Bar */}
        {!settings.apiKey && (
          <div className="bg-amber-500/10 border-b border-amber-200 text-amber-700 py-2 px-6 flex items-center justify-center gap-3 sticky top-[64px] z-[84] backdrop-blur-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">تنبيه: تعمل حالياً بالمفتاح الافتراضي (وصول محدود). أضف مفتاحك الخاص في الإعدادات لأداء أسرع وبحث أدق.</span>
          </div>
        )}

        {!isOnline && (
          <div className="bg-rose-600 text-white text-[10px] py-1 text-center font-bold sticky top-[64px] z-[85]">
            تنبيه: أنت تعمل الآن في وضع الأوفلاين
          </div>
        )}

        {/* Main Content Area - Increased max-width for better utilization */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-none w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
