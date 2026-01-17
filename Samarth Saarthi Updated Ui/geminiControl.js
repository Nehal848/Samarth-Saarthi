import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Flash fast aur free hai

export const getQuestions = async (skill, level) => {
  const prompt = `Generate 9 technical questions for ${skill} at ${level} level. 
                  Format: 3 Easy, 3 Medium, 3 Hard. Return as JSON.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};