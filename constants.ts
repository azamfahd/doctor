
import { SystemSettings, AIPersonality, ModelType, ThemeMode } from './types.ts';

export const INITIAL_SETTINGS: SystemSettings = {
  centerName: 'الحكيم الذكي Pro',
  doctorName: 'أحمد محمد',
  personality: AIPersonality.SIMPLE,
  model: ModelType.FLASH,
  deepThinking: true,
  thinkingBudget: 16384, // القيمة الافتراضية
  googleSearch: true,
  theme: ThemeMode.LIGHT,
  autoSave: true,
  voiceEnabled: true,
  voiceOutputEnabled: true,
  profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250&h=250'
};

export const STORAGE_KEYS = {
  SETTINGS: 'smart_sage_settings',
  RECORDS: 'smart_sage_records'
};
