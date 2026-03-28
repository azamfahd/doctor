import { GoogleGenAI, Modality, Type, Chat } from "@google/genai";
import { PatientCase, SystemSettings } from "../types";

const getAI = (apiKey?: string) => {
  const key = apiKey || process.env.GEMINI_API_KEY || "AIzaSyD-DEFAULT_KEY";
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeMedicalCase = async (patient: PatientCase, settings: SystemSettings) => {
  const ai = getAI(settings.apiKey);
  
  const prompt = `
    بصفتك طبيب خبير (شخصية: ${settings.personality})، قم بتحليل الحالة التالية:
    المريض: ${patient.name}، العمر: ${patient.age}، الجنس: ${patient.gender}
    الأعراض: ${patient.symptoms}
    المؤشرات الحيوية: حرارة ${patient.vitals.temp}، ضغط ${patient.vitals.bp}، نبض ${patient.vitals.pulse}، أكسجين ${patient.vitals.oxygen}
    
    المطلوب: تقديم تشخيص دقيق، خطة علاج، وتوصيات.
  `;

  const response = await ai.models.generateContent({
    model: settings.model,
    contents: {
      parts: [
        { text: prompt },
        ...(patient.image ? [{ inlineData: { data: patient.image.split(',')[1], mimeType: "image/jpeg" } }] : [])
      ]
    },
    config: {
      systemInstruction: "أنت طبيب خبير تقدم تشخيصات طبية دقيقة باللغة العربية. كن مهنياً ودقيقاً.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
          description: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatmentPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          followUp: { type: Type.STRING }
        },
        required: ["title", "severity", "description", "recommendations", "treatmentPlan", "followUp"]
      },
      tools: settings.googleSearch ? [{ googleSearch: {} }] : [],
      thinkingConfig: settings.deepThinking ? { includeThoughts: true } : undefined
    }
  });

  return JSON.parse(response.text);
};

export const startFollowUpChat = (patient: PatientCase, settings: SystemSettings): Chat => {
  const ai = getAI(settings.apiKey);
  return ai.chats.create({
    model: settings.model,
    config: {
      systemInstruction: `أنت طبيب خبير تتابع حالة مريض (شخصية: ${settings.personality}). 
      التشخيص الحالي: ${patient.diagnosis?.title}. 
      كن مساعداً وودوداً وأجب على استفسارات المريض بدقة.`
    }
  });
};

export const generateSpeech = async (text: string, settings: SystemSettings) => {
  if (!settings.voiceOutputEnabled) return null;
  
  const ai = getAI(settings.apiKey);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
