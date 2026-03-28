import React, { useState, useEffect } from 'react';
import { PatientCase, SystemSettings } from './types';
import { INITIAL_SETTINGS } from './constants';
import { dbService } from './services/dbService';
import { analyzeMedicalCase, generateSpeech } from './services/geminiService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Diagnosis from './components/Diagnosis';
import Records from './components/Records';
import Settings from './components/Settings';
import AIResult from './components/AIResult';
import ConsultSession from './components/ConsultSession';

import { Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import MedicalDisclaimer from './components/MedicalDisclaimer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [records, setRecords] = useState<PatientCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PatientCase | null>(null);
  const [isDefaultKey, setIsDefaultKey] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Set a timeout to ensure loading screen doesn't stay forever
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      try {
        // Fetch settings and records with a timeout
        const fetchWithTimeout = async <T,>(promise: Promise<T>, timeout: number): Promise<T | null> => {
          return Promise.race([
            promise,
            new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout))
          ]);
        };

        const [savedSettings, savedRecords] = await Promise.all([
          fetchWithTimeout(dbService.getSettings(), 2500),
          fetchWithTimeout(dbService.getRecords(), 2500)
        ]);
        
        if (savedSettings) setSettings(savedSettings);
        if (savedRecords) setRecords(savedRecords);
        
        // Check if using default key
        if (!savedSettings?.apiKey && !process.env.GEMINI_API_KEY) {
          setIsDefaultKey(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleAnalyze = async (patient: PatientCase) => {
    setIsAnalyzing(true);
    try {
      const diagnosis = await analyzeMedicalCase(patient, settings);
      const updatedRecord = { ...patient, diagnosis };
      
      await dbService.saveRecord(updatedRecord);
      setRecords(prev => [updatedRecord, ...prev]);
      setCurrentRecord(updatedRecord);
      setActiveTab('result');
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateRecord = async (updatedRecord: PatientCase) => {
    await dbService.saveRecord(updatedRecord);
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setCurrentRecord(updatedRecord);
  };

  const handleDeleteRecord = async (id: string) => {
    const success = await dbService.deleteRecord(id);
    if (success) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveSettings = async (newSettings: SystemSettings) => {
    const success = await dbService.saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
      setIsDefaultKey(!newSettings.apiKey && !process.env.GEMINI_API_KEY);
    }
  };

  const handleSpeak = async (text: string) => {
    const audioData = await generateSpeech(text, settings);
    if (audioData) {
      const audio = new Audio(`data:audio/wav;base64,${audioData}`);
      audio.play();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 font-sans" dir="rtl">
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative z-10"
          >
            <Stethoscope className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-blue-400 rounded-[2.5rem] -z-0 blur-2xl"
          />
        </div>
        <div className="mt-12 text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">جاري التحميل...</h2>
          <p className="text-slate-400 font-bold text-lg tracking-tight">نجهز لك تجربة طبية ذكية وفاخرة</p>
        </div>
        <div className="mt-12 w-64 h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600 to-transparent w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <MedicalDisclaimer />
      <Layout 
        activeTab={activeTab === 'result' || activeTab === 'consult' ? 'diagnosis' : activeTab} 
        setActiveTab={setActiveTab} 
        settings={settings}
        isDefaultKey={isDefaultKey}
      >
        {activeTab === 'dashboard' && (
          <Dashboard 
            records={records} 
            settings={settings} 
            onNewCase={() => setActiveTab('diagnosis')} 
            onViewAll={() => setActiveTab('records')}
            onSelectRecord={(r) => { setCurrentRecord(r); setActiveTab('result'); }}
          />
        )}
        {activeTab === 'diagnosis' && (
          <Diagnosis 
            settings={settings} 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing} 
          />
        )}
        {activeTab === 'records' && (
          <Records 
            records={records} 
            onSelect={(r) => { setCurrentRecord(r); setActiveTab('result'); }}
            onDelete={handleDeleteRecord}
            onConsult={(r) => { setCurrentRecord(r); setActiveTab('consult'); }}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            onSave={handleSaveSettings}
            onClearRecords={async () => {
              // Clear all records from Supabase
              const deletePromises = records.map(record => dbService.deleteRecord(record.id));
              await Promise.all(deletePromises);
              setRecords([]);
            }}
          />
        )}
        {activeTab === 'result' && currentRecord && (
          <AIResult 
            record={currentRecord} 
            onBack={() => setActiveTab('dashboard')} 
            onConsult={() => setActiveTab('consult')}
            onSpeak={handleSpeak}
          />
        )}
        {activeTab === 'consult' && currentRecord && (
          <ConsultSession 
            record={currentRecord} 
            settings={settings} 
            onBack={() => setActiveTab('result')}
            onUpdateRecord={handleUpdateRecord}
          />
        )}
      </Layout>
    </>
  );
};

export default App;
