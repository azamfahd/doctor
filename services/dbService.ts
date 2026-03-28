import { supabase } from './supabaseClient';
import { PatientCase, SystemSettings } from '../types';

export const dbService = {
  // السجلات الطبية
  async getRecords(): Promise<PatientCase[]> {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
      return [];
    }

    return data.map(record => ({
      ...record,
      chatHistory: record.chat_history || []
    }));
  },

  async saveRecord(record: PatientCase): Promise<boolean> {
    const { error } = await supabase
      .from('records')
      .upsert({
        id: record.id,
        name: record.name,
        age: record.age,
        gender: record.gender,
        symptoms: record.symptoms,
        vitals: record.vitals,
        image: record.image,
        diagnosis: record.diagnosis,
        chat_history: record.chatHistory,
        date: record.date,
        status: record.status
      });

    if (error) {
      console.error('Error saving record:', error);
      return false;
    }
    return true;
  },

  async deleteRecord(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting record:', error);
      return false;
    }
    return true;
  },

  // الإعدادات
  async getSettings(): Promise<SystemSettings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching settings:', error);
      }
      return null;
    }

    return {
      centerName: data.center_name,
      doctorName: data.doctor_name,
      personality: data.personality,
      model: data.model,
      deepThinking: data.deep_thinking,
      thinkingBudget: data.thinking_budget,
      googleSearch: data.google_search,
      theme: data.theme,
      autoSave: data.auto_save,
      voiceEnabled: data.voice_enabled,
      voiceOutputEnabled: data.voice_output_enabled,
      profileImage: data.profile_image,
      apiKey: data.api_key
    };
  },

  async saveSettings(settings: SystemSettings): Promise<boolean> {
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 1, // نستخدم دائماً معرف واحد للإعدادات
        center_name: settings.centerName,
        doctor_name: settings.doctorName,
        personality: settings.personality,
        model: settings.model,
        deep_thinking: settings.deepThinking,
        thinking_budget: settings.thinkingBudget,
        google_search: settings.googleSearch,
        theme: settings.theme,
        auto_save: settings.autoSave,
        voice_enabled: settings.voiceEnabled,
        voice_output_enabled: settings.voiceOutputEnabled,
        profile_image: settings.profileImage,
        api_key: settings.apiKey,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }
    return true;
  }
};
