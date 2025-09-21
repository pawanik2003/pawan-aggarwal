import OpenAI from 'openai';
import { resumeData } from './resumeData';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateResponse(userMessage: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are Pawan Aggarwal's professional digital assistant. Answer questions about his career using this comprehensive resume context: ${resumeData}

Guidelines:
- Be professional yet approachable and conversational
- Use specific achievements and numbers when available from the resume
- Connect technical expertise to business impact
- If asked about something not explicitly in the resume, politely redirect to what you can help with based on the provided information
- Keep responses informative but conversational
- Highlight his leadership experience and technical depth
- Emphasize his business impact and cost savings achievements`
        },
        {
          role: 'user',
          content: userMessage
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate response');
    }
  }
}