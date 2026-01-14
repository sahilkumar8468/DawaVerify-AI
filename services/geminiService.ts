
import { GoogleGenAI, Type } from "@google/genai";
import { MedScan, WasteAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const verifyMedicine = async (base64Image: string, city: string): Promise<MedScan> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `You are a pharmaceutical expert in Pakistan. Analyze this medicine packaging. 
          1. Identify the Medicine Name and Manufacturer.
          2. Check if the packaging looks consistent with authorized products in Pakistan.
          3. Provide a very simple 2-line summary in English.
          4. Provide a very simple 2-line summary in URDU (using Urdu script) for a common person to understand usage/warnings.
          5. State the typical DRAP-regulated MRP (Maximum Retail Price) for this item in PKR.
          Return the result in JSON format.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medName: { type: Type.STRING },
          manufacturer: { type: Type.STRING },
          officialPrice: { type: Type.STRING },
          isSuspectedFake: { type: Type.BOOLEAN },
          urduInstructions: { type: Type.STRING },
          englishSummary: { type: Type.STRING },
        },
        required: ["medName", "manufacturer", "officialPrice", "isSuspectedFake", "urduInstructions", "englishSummary"],
      },
    },
  });

  // Correctly access .text property from response
  const data = JSON.parse(response.text || '{}');
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    location: city
  };
};

export const getInspectorSummary = async (scans: MedScan[]): Promise<string> => {
  const summary = scans.map(s => `${s.medName} in ${s.location} (${s.isSuspectedFake ? 'Fake Suspect' : 'Valid'})`).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Acting as a Drug Health Inspector in Pakistan, analyze these recent field reports: ${summary}. 
    Provide a strategic 3-point action plan for the Health Ministry to address any emerging clusters of counterfeit drugs or price violations. 
    Mention specific concerns for cities mentioned.`,
  });
  // Correctly access .text property from response
  return response.text || "Generating insights...";
};

/**
 * Added to fix missing export error in views/WasteScanner.tsx.
 * Uses gemini-3-flash-preview for basic image classification task.
 */
export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Identify the waste item in this image and provide category, recyclability status, and instructions in JSON format.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          category: { type: Type.STRING },
          recyclable: { type: Type.BOOLEAN },
          instructions: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ["item", "category", "recyclable", "instructions", "confidence"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};

/**
 * Added to fix missing export error in views/AdminDashboard.tsx.
 * Uses gemini-3-pro-preview for complex reasoning/strategy task.
 */
export const getAdminInsights = async (allWasteData: WasteAnalysis[]): Promise<string> => {
  const summary = allWasteData.map(d => `${d.item} (${d.category})`).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these waste detection statistics: ${summary}. 
    As an urban policy advisor, provide a short, high-impact recommendation for improving local recycling infrastructure.`,
  });
  return response.text || "No insights available currently.";
};
