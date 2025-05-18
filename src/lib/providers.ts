export type Provider = 'openai' | 'together' | 'openrouter';

export function getUrlForProvider(provider: Provider): string {
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1/chat/completions';
    case 'together':
      return 'https://api.together.xyz/v1/chat/completions';
    case 'openrouter':
      return 'https://openrouter.ai/api/v1/chat/completions';
    default:
      throw new Error(`Unknown provider: \${provider}`);
  }
}

export function getHeadersForProvider(provider: Provider, apiKey: string): Record<string, string> {
  const base = {
    'Content-Type': 'application/json',
    Authorization: `Bearer \${apiKey}`,
  };

  if (provider === 'openrouter') {
    return {
      ...base,
      'HTTP-Referer': 'https://your-extension-id.firefox',
      'X-Title': 'Ethical Product Checker',
    };
  }

  return base;
}

export const PROVIDERS = [
  {
    id: "openai",
    label: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    keyLink: "https://platform.openai.com/account/api-keys",
    models: ["gpt-4", "gpt-3.5-turbo"]
  },
  {
    id: "together",
    label: "Together.ai (Mistral)",
    endpoint: "https://api.together.xyz/v1/chat/completions",
    keyLink: "https://together.ai/auth/api-keys",
    models: ["mistralai/Mistral-7B-Instruct-v0.1", "meta-llama/Llama-Vision-Free"]
  },
  {
    id: "openrouter",
    label: "OpenRouter.ai",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    keyLink: "https://openrouter.ai/account/keys",
    models: ["mistral-7b-instruct:free"]
  }
];

export function getProviderMeta(id: string) {
  return PROVIDERS.find((p) => p.id === id);
}