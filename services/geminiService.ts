
import { GoogleGenAI, Type } from "@google/genai";
import { Medicine, DoseRoute, SafetyStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const medicineSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    brandNames: { type: Type.ARRAY, items: { type: Type.STRING } },
    class: { type: Type.STRING },
    indications: { type: Type.ARRAY, items: { type: Type.STRING } },
    adultDose: {
      type: Type.OBJECT,
      properties: {
        standard: { type: Type.STRING },
        maximum: { type: Type.STRING },
        frequency: { type: Type.STRING },
        route: { type: Type.ARRAY, items: { type: Type.STRING } },
        notes: { type: Type.STRING }
      },
      required: ['standard', 'maximum', 'frequency', 'route']
    },
    pediatricDose: {
      type: Type.OBJECT,
      properties: {
        standard: { type: Type.STRING },
        maximum: { type: Type.STRING },
        frequency: { type: Type.STRING },
        route: { type: Type.ARRAY, items: { type: Type.STRING } },
        weightBased: { type: Type.STRING },
        ageRestrictions: { type: Type.STRING }
      },
      required: ['standard', 'maximum', 'frequency', 'route']
    },
    safetyFlags: {
      type: Type.OBJECT,
      properties: {
        adults: { type: Type.STRING },
        pediatrics: { type: Type.STRING },
        pregnancy: { type: Type.STRING },
        elderly: { type: Type.STRING }
      },
      required: ['adults', 'pediatrics', 'pregnancy', 'elderly']
    },
    contraindications: { type: Type.ARRAY, items: { type: Type.STRING } },
    precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
    sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
    emergencyUse: { type: Type.BOOLEAN },
    source: { type: Type.STRING }
  },
  required: ['id', 'name', 'brandNames', 'class', 'indications', 'adultDose', 'pediatricDose', 'safetyFlags', 'contraindications', 'precautions', 'sideEffects', 'emergencyUse', 'source']
};

export const searchMedicineWithAI = async (query: string): Promise<Medicine | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the medicine: "${query}". Provide a detailed, medically accurate pharmacopeia entry matching the following schema. Use internationally accepted guidelines (WHO, BNF, FDA). If it's a brand name, find the generic equivalent. Return exactly one medicine entry.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: medicineSchema,
      },
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr) as any;
    
    // Cleanup and map to strict types
    return {
      ...data,
      isVerified: false, // AI results should be flagged as unverified
      adultDose: {
        ...data.adultDose,
        route: data.adultDose.route.map((r: string) => r as DoseRoute)
      },
      pediatricDose: {
        ...data.pediatricDose,
        route: data.pediatricDose.route.map((r: string) => r as DoseRoute)
      }
    };
  } catch (error) {
    console.error("AI Drug Search failed:", error);
    return null;
  }
};
