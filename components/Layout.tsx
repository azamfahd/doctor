import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { 
  LayoutDashboard, 
  Stethoscope, 
  ClipboardList, 
  Settings as SettingsIcon, 
  Menu, 
  Bell, 
  Search,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SystemSettings;
  isDefaultKey: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, settings, isDefaultKey }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-6 h-6" /> },
    { id: 'diagnosis', label: 'تشخيص جديد', icon: <Stethoscope className="w-6 h-6" /> },
    { id: 'records', label: 'سجلات المرضى', icon: <ClipboardList className="w-6 h-6" /> },
    { id: 'settings', label: 'الإعدادات', icon: <SettingsIcon className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-72 lg:w-80 glass-effect border-l border-slate-100/50 shadow-[0_0_100px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-[0.23,1,0.32,1] lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6 lg:p-10">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-6 mb-10 lg:mb-16 group cursor-pointer">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl lg:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <Stethoscope className="w-6 h-6 lg:w-9 lg:h-9 text-white" />
            </div>
            <div className="space-y-0.5 lg:space-y-1">
              <h1 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter">الحكيم Pro</h1>
              <p className="text-[8px] lg:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] lg:tracking-[0.4em] opacity-80">Smart Medical Sage</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 lg:space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 lg:gap-6 px-6 lg:px-8 py-3 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black text-base lg:text-xl transition-all duration-500 relative group overflow-hidden
                  ${activeTab === item.id 
                    ? 'text-white shadow-2xl shadow-blue-200 -translate-x-2 lg:-translate-x-3' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className={`transition-all duration-500 relative z-10 ${activeTab === item.id ? 'scale-110 rotate-6' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5 lg:w-6 lg:h-6" })}
                </span>
                <span className="relative z-10 tracking-tight">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-2xl lg:rounded-[2rem] -z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Profile Card */}
          <div className="mt-auto pt-6 lg:pt-10 border-t border-slate-100/50">
            <div className="bg-slate-50/80 p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] flex items-center gap-4 lg:gap-6 border border-slate-100/50 shadow-inner group hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-xl lg:rounded-[1.5rem] flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-500">
                {settings.profileImage ? (
                  <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl lg:text-2xl">
                    {settings.doctorName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 lg:space-y-1">
                <p className="text-base lg:text-lg font-black text-slate-900 truncate tracking-tight">{settings.doctorName}</p>
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{settings.centerName}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        {/* Header */}
        <header className="h-20 lg:h-28 glass-effect border-b border-slate-100/50 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:gap-10">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-6 px-8 py-4 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 w-[300px] lg:w-[450px] focus-within:bg-white focus-within:ring-8 focus-within:ring-blue-500/5 focus-within:border-blue-500/30 transition-all duration-500 shadow-inner group">
              <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="ابحث..." 
                className="bg-transparent border-none focus:ring-0 text-base lg:text-lg w-full placeholder:text-slate-400 font-black tracking-tight"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            {isDefaultKey && (
              <div className="hidden sm:flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-3 bg-amber-50/50 text-amber-700 rounded-xl lg:rounded-2xl border border-amber-100/50 text-[10px] lg:text-xs font-black uppercase tracking-widest animate-pulse-soft">
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden lg:inline">مفتاح API افتراضي</span>
                <span className="lg:hidden">API افتراضي</span>
              </div>
            )}
            <div className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-xs font-black tracking-widest uppercase shadow-sm ${isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
              <span className="hidden sm:inline">{isOnline ? 'متصل' : 'أوفلاين'}</span>
            </div>
            <button className="w-10 h-10 lg:w-14 lg:h-14 bg-slate-50 text-slate-600 rounded-xl lg:rounded-2xl relative hover:bg-slate-900 hover:text-white transition-all duration-500 group shadow-sm flex items-center justify-center">
              <Bell className="w-5 h-5 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 left-3 lg:top-4 lg:left-4 w-2 h-2 lg:w-3 lg:h-3 bg-rose-500 border-2 border-white rounded-full shadow-sm"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-slate-50/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
