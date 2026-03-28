
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Diagnosis from './components/Diagnosis.tsx';
import Records from './components/Records.tsx';
import Settings from './components/Settings.tsx';
import AIResult from './components/AIResult.tsx';
import ConsultSession from './components/ConsultSession.tsx';
import { PatientCase, SystemSettings, StructuredDiagnosis } from './types.ts';
import { INITIAL_SETTINGS, STORAGE_KEYS } from './constants.ts';
import { analyzeMedicalCase } from './services/geminiService.ts';
import { MessageSquare, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [records, setRecords] = useState<PatientCase[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<{ diagnosis: StructuredDiagnosis, sources: any[] } | null>(null);
  const [lastDiagnosedPatient, setLastDiagnosedPatient] = useState<PatientCase | null>(null);
  const [activeSessionPatient, setActiveSessionPatient] = useState<PatientCase | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  const saveToLocalStorage = (newRecords: PatientCase[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(newRecords));
  };

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const handleAnalysis = async (patientData: Partial<PatientCase>) => {
    setIsAnalyzing(true);
    try {
      // الخدمة تتعامل الآن مع المفتاح الافتراضي داخلياً
      const result = await analyzeMedicalCase(patientData, settings);
      
      let status: 'عاجلة' | 'متابعة' | 'عادية' = 'عادية';
      if (result.diagnosis.severity === 'حرجة' || result.diagnosis.severity === 'مرتفعة') {
        status = 'عاجلة';
      } else if (result.diagnosis.severity === 'متوسطة') {
        status = 'متابعة';
      }

      const newRecord: PatientCase = {
        id: Date.now().toString(),
        name: patientData.name || 'مجهول',
        age: patientData.age || '--',
        gender: patientData.gender || 'ذكر',
        symptoms: patientData.symptoms || '',
        vitals: patientData.vitals || { bloodPressure: '', pulse: '', temperature: '', spo2: '' },
        image: patientData.image,
        diagnosis: result.diagnosis,
        chatHistory: [],
        date: new Date().toLocaleDateString('ar-EG'),
        status: status
      };
      
      saveToLocalStorage([newRecord, ...records]);
      setCurrentDiagnosis(result);
      setLastDiagnosedPatient(newRecord);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert("⚠️ حدث خطأ أثناء التحليل. يرجى التأكد من استقرار الإنترنت أو التحقق من صحة مفتاح الـ API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    if (activeSessionPatient) {
      return (
        <ConsultSession 
          patient={activeSessionPatient} 
          settings={settings}
          onClose={() => setActiveSessionPatient(null)}
          onUpdateHistory={(history) => {
             const updated = records.map(r => r.id === activeSessionPatient.id ? { ...r, chatHistory: history } : r);
             saveToLocalStorage(updated);
          }}
        />
      );
    }

    if (currentDiagnosis && lastDiagnosedPatient) {
      return (
        <AIResult 
          diagnosis={currentDiagnosis.diagnosis} 
          sources={currentDiagnosis.sources}
          patientName={lastDiagnosedPatient.name}
          patientGender={lastDiagnosedPatient.gender}
          onClose={() => {
            setCurrentDiagnosis(null);
            setActiveTab('home');
          }} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard doctorName={settings.doctorName} records={records} onNewCase={() => setActiveTab('diagnosis')} onViewAll={() => setActiveTab('records')} activeModel={settings.model} isThinking={settings.deepThinking} />;
      case 'diagnosis':
        return <Diagnosis onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />;
      case 'consult':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-2">العيادة الصوتية والمتابعة</h2>
                <p className="text-slate-400 text-sm font-medium">اختر مريضاً لبدء جلسة استشارة ذكية.</p>
              </div>
              <MessageSquare className="w-32 h-32 absolute -bottom-10 -left-10 text-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {records.map(r => (
                 <div key={r.id} onClick={() => setActiveSessionPatient(r)} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Stethoscope className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="font-black text-slate-800">{r.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{r.diagnosis?.conditionName || 'بانتظار التحليل'}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'records':
        return <Records records={records} onStartSession={(p) => setActiveSessionPatient(p)} onDeleteRecord={(id) => {
          if(confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            saveToLocalStorage(records.filter(r => r.id !== id));
          }
        }} />;
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            setSettings={updateSettings} 
            records={records}
            onImport={(imported) => saveToLocalStorage(imported)}
            onSave={() => {
              updateSettings(settings);
              alert('✅ تم حفظ الإعدادات بنجاح.');
            }} 
            onClear={() => {
              if(confirm('سيتم مسح كافة السجلات. هل أنت متأكد؟')) {
                saveToLocalStorage([]);
              }
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      settings={settings} 
      onUpdateSettings={updateSettings}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
