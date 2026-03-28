import { SystemSettings, Personality, ModelType, ThemeMode } from './types';

export const INITIAL_SETTINGS: SystemSettings = {
  centerName: 'مركز الحكيم الطبي',
  doctorName: 'د. أحمد علي',
  personality: Personality.PROFESSIONAL,
  model: ModelType.FLASH_2_5,
  deepThinking: false,
  thinkingBudget: 4000,
  googleSearch: true,
  theme: ThemeMode.LIGHT,
  autoSave: true,
  voiceEnabled: true,
  voiceOutputEnabled: true,
  profileImage: '',
  apiKey: ''
};
