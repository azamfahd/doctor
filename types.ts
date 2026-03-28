declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export enum Personality {
  PROFESSIONAL = 'professional',
  FRIENDLY = 'friendly',
  ACADEMIC = 'academic',
  EMPATHETIC = 'empathetic'
}

export enum ModelType {
  FLASH_2_5 = 'gemini-2.5-flash-preview',
  PRO_2_5 = 'gemini-2.5-pro-preview',
  FLASH_3_0 = 'gemini-3-flash-preview',
  PRO_3_1 = 'gemini-3.1-pro-preview',
  FLASH_3_1_LITE = 'gemini-3.1-flash-lite-preview'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface PatientCase {
  id: string;
  name: string;
  age: string;
  gender: string;
  symptoms: string;
  vitals: {
    temp: string;
    bp: string;
    pulse: string;
    oxygen: string;
  };
  image?: string;
  diagnosis?: {
    title: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendations: string[];
    treatmentPlan: string[];
    followUp: string;
  };
  chatHistory: ChatMessage[];
  date: string;
  status: 'normal' | 'follow-up' | 'urgent';
}

export interface SystemSettings {
  centerName: string;
  doctorName: string;
  personality: Personality;
  model: ModelType;
  deepThinking: boolean;
  thinkingBudget: number;
  googleSearch: boolean;
  theme: ThemeMode;
  autoSave: boolean;
  voiceEnabled: boolean;
  voiceOutputEnabled: boolean;
  profileImage?: string;
  apiKey: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
