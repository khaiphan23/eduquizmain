import { Question, EssayGrade } from '../types';

const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '')) as string;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function generateQuizAI(topic: string, numQuestions: number, difficulty: string, language: string): Promise<Question[]> {
  const lang = language === 'en' ? 'English' : 'Vietnamese';
  const prompt = `Generate ${numQuestions} quiz questions about "${topic}" at ${difficulty} difficulty level. Respond in ${lang}.
Return ONLY a valid JSON array (no markdown, no explanation) with this structure:
[{"id":"q1","type":"multiple-choice","text":"question","options":["A","B","C","D"],"correctAnswerIndex":0,"explanation":"why"}]
Mix question types: mostly multiple-choice, some true-false (options: ["True","False"] or ["Đúng","Sai"]).`;

  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse AI response');
  }
}

export async function getAIExplanation(question: string, userAnswer: string, correctAnswer: string): Promise<string> {
  const prompt = `Quiz question: "${question}"
User answered: "${userAnswer}"
Correct answer: "${correctAnswer}"
Explain briefly (2-3 sentences) why the correct answer is right and the user's answer is wrong. Be encouraging and educational.`;
  return callGemini(prompt);
}

export async function gradeEssayAI(question: string, answer: string, sampleAnswer?: string): Promise<EssayGrade> {
  const prompt = `Grade this essay answer on a scale of 0-100.
Question: "${question}"
${sampleAnswer ? `Sample answer: "${sampleAnswer}"` : ''}
Student answer: "${answer}"
Return ONLY valid JSON: {"score": number, "feedback": "2-3 sentence feedback"}`;
  const text = await callGemini(prompt);
  const clean = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    return { score: 50, feedback: 'Unable to grade automatically. Please review manually.' };
  }
}
