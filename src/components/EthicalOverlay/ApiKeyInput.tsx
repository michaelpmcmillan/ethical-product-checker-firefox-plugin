import { Input } from "@/components/ui/input";
import { PROVIDERS } from "@/lib/providers";

type Props = {
  apiKey: string;
  setApiKey: (key: string) => void;
  provider: string;
  setProvider: (p: string) => void;
};

export default function ApiKeyInput({
  apiKey,
  setApiKey,
  provider,
  setProvider,
}: Props) {
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem(`ethical_api_key_${provider}`, key);
  };

  const providerMeta = PROVIDERS.find((p) => p.id === provider);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Provider Configuration</h3>
      <div className="pl-4 space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">Provider:</label>
          <select
            value={provider}
            onChange={handleProviderChange}
            className="w-full border rounded px-2 py-1"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key:</label>
          <Input
            type="text"
            placeholder={`${provider} API Key`}
            value={apiKey}
            onChange={handleKeyChange}
          />
          {providerMeta?.signupUrl && (
            <a
              href={providerMeta.signupUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 underline"
            >
              Don't have a key? Create one here
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
