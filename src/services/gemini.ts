import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function fetchFinancialAdvice(userFinancialData?: any): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      As a financial advisor, provide personalized advice based on the following financial situation:
      ${userFinancialData ? JSON.stringify(userFinancialData) : 'General financial guidance needed'}
      
      Please provide:
      1. Budget recommendations
      2. Saving strategies
      3. Investment suggestions (if applicable)
      4. Debt management tips (if applicable)
      5. Emergency fund guidance
      
      Keep the advice practical and actionable. Limit response to 300 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get financial advice');
  }
}