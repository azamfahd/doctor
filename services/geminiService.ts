
import { GoogleGenAI, GenerateContentResponse, Type, Chat, Modality } from "@google/genai";
import { SystemSettings, PatientCase, StructuredDiagnosis } from '../types.ts';

const DEFAULT_API_KEY = "AIzaSyBvw8htMZG_o-ou3v6GQM5kgrGMVFopPdk";

const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

const getAI = (settings?: SystemSettings) => {
  // الأولوية لمفتاح المستخدم، ثم مفتاح البيئة، ثم المفتاح الافتراضي
  let apiKey = settings?.apiKey || (window as any).process?.env?.API_KEY || DEFAULT_API_KEY;
  
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMedicalCase = async (
  patientData: Partial<PatientCase>,
  settings: SystemSettings
): Promise<{ diagnosis: StructuredDiagnosis, sources: any[] }> => {
  try {
    const ai = getAI(settings);
    
    const systemInstruction = `
      أنت "الحكيم الذكي Pro" - استشاري طب رقمي متقدم.
      مهمتك: تحليل الحالة السريرية بأسلوب ${settings.personality}.
      يجب أن يتضمن الرد نصائح مفصلة في:
      1. المسار العلاجي 2. التغذية العلاجية 3. التأهيل البدني 4. جودة الحياة.
      يجب أن يكون الرد بتنسيق JSON حصرياً.
    `;

    const prompt = `
      تحليل حالة مريض سريرية:
      - الاسم: ${patientData.name}
      - العمر: ${patientData.age}
      - الجنس: ${patientData.gender}
      - الأعراض المذكورة: ${patientData.symptoms}
      - المؤشرات الحيوية: الضغط (${patientData.vitals?.bloodPressure}), النبض (${patientData.vitals?.pulse}), الحرارة (${patientData.vitals?.temperature}), الأكسجين (${patientData.vitals?.spo2})
    `;

    const parts: any[] = [{ text: prompt }];
    if (patientData.image) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: patientData.image.split(',')[1]
        }
      });
    }

    const config: any = {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conditionName: { type: Type.STRING },
          summary: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["منخفضة", "متوسطة", "مرتفعة", "حرجة"] },
          confidenceScore: { type: Type.NUMBER },
          differentialDiagnosis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              }
            }
          },
          treatmentPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          dietaryAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
          physicalTherapy: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestyleChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } },
          urgentWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          generalInfo: { type: Type.STRING }
        },
        required: ["conditionName", "summary", "severity", "confidenceScore", "treatmentPlan", "dietaryAdvice", "physicalTherapy", "lifestyleChanges"]
      }
    };

    if (settings.googleSearch && (settings.model.includes('pro') || settings.model.includes('image-preview'))) {
      config.tools = [{ googleSearch: {} }];
    }

    if (settings.deepThinking && (settings.model.includes('gemini-3') || settings.model.includes('gemini-2.5'))) {
      config.thinkingConfig = { thinkingBudget: settings.thinkingBudget };
    }

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: { parts },
      config
    });

    const cleanedText = cleanJsonResponse(response.text || '{}');
    return { 
      diagnosis: JSON.parse(cleanedText), 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (e: any) {
    console.error("Gemini Error:", e);
    throw e;
  }
};

export const startFollowUpChat = (patient: PatientCase, settings: SystemSettings): Chat => {
  const ai = getAI(settings);
  return ai.chats.create({
    model: settings.model,
    config: {
      systemInstruction: `أنت الطبيب المرافق لـ ${patient.name}. تشخيصه هو ${patient.diagnosis?.conditionName}. الشخصية المعتمدة: ${settings.personality}.`,
    }
  });
};

export const generateSpeech = async (text: string, settings?: SystemSettings): Promise<string> => {
  try {
    const ai = getAI(settings);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (e) {
    return "";
  }
};
