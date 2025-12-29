
import { GoogleGenAI, Type } from "@google/genai";
import { Mentor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function findBestMentor(query: string, mentors: Mentor[]): Promise<string> {
  const mentorContext = mentors.map(m => `ID: ${m.id}, Имя: ${m.name}, Индустрия: ${m.industry}, Описание: ${m.description}, Ценности: ${m.values.join(', ')}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `У нас есть список наставников для платформы ШАГ:\n${mentorContext}\n\nПользователь говорит: "${query}"\n\nНайди одного наиболее подходящего наставника и объясни почему одним коротким предложением. Верни только JSON в формате: {"id": "ID наставника", "reason": "почему подходит"}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["id", "reason"]
      }
    }
  });

  return response.text;
}
