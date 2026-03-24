import { GoogleGenAI, Type } from "@google/genai";
import { StyleGuide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const schema = {
  type: Type.OBJECT,
  properties: {
    toneOfVoice: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING },
        examples: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["style", "examples"]
    },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hex: { type: Type.STRING },
          usage: { type: Type.STRING }
        },
        required: ["name", "hex", "usage"]
      }
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        headings: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            justification: { type: Type.STRING }
          },
          required: ["name", "justification"]
        },
        body: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            justification: { type: Type.STRING }
          },
          required: ["name", "justification"]
        }
      },
      required: ["headings", "body"]
    },
    layout: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING },
        buttons: { type: Type.STRING },
        cardsAndNav: { type: Type.STRING }
      },
      required: ["style", "buttons", "cardsAndNav"]
    },
    designRationale: { type: Type.STRING }
  },
  required: ["toneOfVoice", "colorPalette", "typography", "layout", "designRationale"]
};

export async function generateStyleGuide(prompt: string): Promise<StyleGuide> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é um Especialista em Design de Interface (UI) e Estrategista de Marca sênior.
Sua tarefa é gerar um "Guia de Estilo Automatizado" completo com base no seguinte tema ou tipo de projeto: "${prompt}".

Responda em PORTUGUÊS.
Siga rigorosamente esta estrutura:
- Tom de Voz: Defina o estilo e dê 3 exemplos.
- Paleta de Cores: 5 cores harmoniosas com Nome, HEX e Uso Sugerido.
- Tipografia: Combinação de Google Fonts para Títulos e Corpo com justificativas.
- Layout e Componentes: Estilo Visual, Botões (formato, sombras, hover), Cards e Navegação (espaçamento e bordas).
- Racional de Design: Explicação de como as escolhas ajudam o público-alvo.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) {
    throw new Error("Falha ao gerar o guia de estilo.");
  }

  return JSON.parse(response.text) as StyleGuide;
}
