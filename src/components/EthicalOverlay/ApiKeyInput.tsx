import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  apiKey: string;
  setApiKey: (key: string) => void;
  provider: string;
  setProvider: (p: string) => void;
  useGpt4: boolean;
  setUseGpt4: (b: boolean) => void;
};

export default function ApiKeyInput({
  apiKey,
  setApiKey,
  provider,
  setProvider,
  useGpt4,
  setUseGpt4,
}: Props) {
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem(`ethical_api_key_${provider}`, key);
  };

  return (
    <>
      <label className="text-sm font-medium">Provider:</label>
      <select
        value={provider}
        onChange={handleProviderChange}
        className="rounded border p-1"
      >
        <option value="openai">OpenAI</option>
        <option value="together">Together.ai (Mistral)</option>
      </select>

      <Input
        type="text"
        placeholder={`${provider} API Key`}
        value={apiKey}
        onChange={handleKeyChange}
      />
      <a
        href={
          provider === "openai"
            ? "https://platform.openai.com/account/api-keys"
            : "https://platform.together.xyz"
        }
        target="_blank"
        className="text-sm text-blue-600 underline"
      >
        Don’t have a key? Create one here
      </a>

      {provider === "openai" && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">Use GPT-4</span>
          <Switch checked={useGpt4} onCheckedChange={setUseGpt4} />
        </div>
      )}
    </>
  );
}
