import { GoogleGenAI } from "@google/genai";
import { GenerateContentParams } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
// Note: In a real app, you might want to handle the missing key more gracefully in the UI
const ai = new GoogleGenAI({ apiKey });

export const streamGeneratedContent = async (
  params: GenerateContentParams,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const { template, formData, modelName } = params;

  // Construct the prompt based on form data
  let userPrompt = `Task: ${template.name}\n\n`;
  for (const [key, value] of Object.entries(formData)) {
    const fieldLabel = template.fields.find(f => f.id === key)?.label || key;
    userPrompt += `${fieldLabel}: ${value}\n`;
  }
  userPrompt += `\nPlease generate the content based on the details above.`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: template.systemInstruction,
        temperature: 0.7,
      }
    });

    let fullText = '';
    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            onChunk(fullText);
        }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
