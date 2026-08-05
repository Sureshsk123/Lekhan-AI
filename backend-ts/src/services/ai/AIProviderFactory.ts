import { ollamaService } from './OllamaService';

export interface IAIProvider {
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
}

export class OllamaProvider implements IAIProvider {
  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return await ollamaService.generateText(prompt, { systemPrompt });
  }
}

export class AIProviderFactory {
  static getProvider(providerName: string = 'ollama'): IAIProvider {
    return new OllamaProvider();
  }
}
