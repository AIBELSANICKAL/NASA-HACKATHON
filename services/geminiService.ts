
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The text of the quiz question.",
      },
      options: {
        type: Type.OBJECT,
        properties: {
          a: { type: Type.STRING },
          b: { type: Type.STRING },
          c: { type: Type.STRING },
          d: { type: Type.STRING },
        },
        required: ["a", "b", "c", "d"],
      },
      correctAnswer: {
        type: Type.STRING,
        description: "The key of the correct option (e.g., 'a', 'b', 'c', or 'd').",
      },
    },
    required: ["question", "options", "correctAnswer"],
  },
};

export const generateNasaQuiz = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert quiz creator for the NASA Space Apps Challenge. Generate a fresh set of 20 unique multiple-choice quiz questions. 
      The quiz should be based on NASA Earth Observation, satellites, and natural hazards (floods, cyclones, earthquakes, wildfires, droughts, volcanic eruptions, climate change, etc.).
      Each question should have 4 options (a, b, c, d) and a clearly marked correct answer key.
      The questions should be a mix of: beginner-friendly (for teens), conceptual/educational (for teachers), and a few application-based (real use of NASA data).
      Avoid repeating the same set of questions on subsequent requests.
      Ensure the output is a valid JSON array of 20 questions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 1, // Higher temperature for more varied, creative questions
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);

    if (!Array.isArray(quizData) || quizData.length === 0) {
      throw new Error("API returned an invalid or empty quiz format.");
    }
    
    // Validate that the array contains valid questions
    if (!quizData.every(q => q.question && q.options && q.correctAnswer)) {
      throw new Error("Some quiz questions are malformed.");
    }

    return quizData as QuizQuestion[];

  } catch (error) {
    console.error("Error generating NASA quiz:", error);
    throw new Error("Failed to generate the quiz. The model may be unavailable or the API key is invalid. Please try again later.");
  }
};
