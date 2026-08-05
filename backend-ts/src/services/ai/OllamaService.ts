import { env } from '../../config/env';

export interface OllamaGenerateOptions {
  systemPrompt?: string;
  temperature?: number;
  timeoutMs?: number;
}

export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = (process.env.OLLAMA_BASE_URL || env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
    this.defaultModel = process.env.OLLAMA_MODEL || env.OLLAMA_MODEL || 'llama3.2:3b';
  }

  /**
   * Check if Ollama server is reachable and active.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Send a prompt to Ollama and return the response.
   * If server is offline or times out, returns friendly fallback string.
   */
  async generateText(prompt: string, options: OllamaGenerateOptions = {}): Promise<string> {
    const model = process.env.OLLAMA_MODEL || this.defaultModel;
    const timeoutMs = options.timeoutMs || 30000;

    const systemPrompt = options.systemPrompt || `You are an expert, encouraging, and friendly AI Language Tutor for LangSphere AI.
Your sole duty is to assist users with language learning. You can:
1. Explain vocabulary, words, idioms, and phrases.
2. Explain grammar rules, verb tenses, and sentence structures.
3. Translate text between supported languages (Tamil, English, Hindi, Telugu, Malayalam, Kannada, etc.).
4. Generate example sentences and practice dialogues.
5. Explain quiz answers and clarify lesson concepts.

GUARDRAIL RULE: If the user asks about topics completely unrelated to language learning (such as writing general code, politics, financial advice, math homework, or entertainment gossip), politely refuse and redirect them back to language learning. Be concise, clear, and helpful.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.7,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return `AI Tutor is currently unavailable. Model "${model}" is not pulled in Ollama. Please run "ollama pull ${model}".`;
        }
        return "AI Tutor is currently unavailable. Please start the local Ollama server.";
      }

      const data: any = await response.json();
      if (data && typeof data.response === 'string' && data.response.trim().length > 0) {
        return data.response.trim();
      }

      return "Sorry, I could not generate a response. Please try again.";
    } catch (err: any) {
      console.warn('Ollama Service Connection Warning:', err?.message || err);
      return "AI Tutor is currently unavailable. Please start the local Ollama server.";
    }
  }
}

export const ollamaService = new OllamaService();
