import { env } from '../../config/env';

export interface IAIProvider {
  generateText(prompt: string): Promise<string>;
  evaluateSpeech(audioUrl: string): Promise<{ transcript: string; score: number }>;
}

export class OpenAIProvider implements IAIProvider {
  async generateText(prompt: string): Promise<string> {
    return `[OpenAI Response] Processed prompt: ${prompt.substring(0, 50)}...`;
  }
  
  async evaluateSpeech(audioUrl: string) {
    return { transcript: 'Dummy transcript from Whisper API', score: 85 };
  }
}

export class GeminiProvider implements IAIProvider {
  async generateText(prompt: string): Promise<string> {
    return `[Gemini Response] Processed prompt: ${prompt.substring(0, 50)}...`;
  }
  
  async evaluateSpeech(audioUrl: string) {
    return { transcript: 'Dummy transcript from Gemini Audio', score: 82 };
  }
}

export class AIProviderFactory {
  static getProvider(providerName: 'openai' | 'gemini' | 'claude' | 'ollama' = 'openai'): IAIProvider {
    switch (providerName) {
      case 'openai': return new OpenAIProvider();
      case 'gemini': return new GeminiProvider();
      default: return new OpenAIProvider();
    }
  }
}
