import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ApiKeyInput from "./ApiKeyInput";
import WhitelistManager from "./WhitelistManager";
import ResultDisplay from "./ResultDisplay";
import AnalyzeButton from "./AnalyzeButton";
import SettingsToggle from "./SettingsToggle";

export default function EthicalOverlay() {
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState(
    localStorage.getItem("ethical_provider") || "openai"
  );
  const [apiKey, setApiKey] = useState(
    localStorage.getItem(`ethical_api_key_${provider}`) || ""
  );
  const [useGpt4, setUseGpt4] = useState(false);
  const [whitelist, setWhitelist] = useState(() => {
    const saved = localStorage.getItem("ethical_whitelist");
    return saved ? JSON.parse(saved) : ["sainsburys.co.uk"];
  });
  const [result, setResult] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!apiKey);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setUrl(tab?.url || "");
    });
  }, []);

  const isWhitelisted = whitelist.some((domain) => url.includes(domain));

  // Switch API key when provider changes
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    localStorage.setItem("ethical_provider", newProvider);
    const storedKey = localStorage.getItem(`ethical_api_key_${newProvider}`) || "";
    setApiKey(storedKey);
  };

  return (
    <Card className="w-[360px] p-4">
      <CardContent className="flex flex-col gap-4">
        <SettingsToggle expanded={expanded} onToggle={() => setExpanded(!expanded)} />

        {expanded && (
          <>
            <ApiKeyInput
              apiKey={apiKey}
              setApiKey={setApiKey}
              provider={provider}
              setProvider={handleProviderChange}
              useGpt4={useGpt4}
              setUseGpt4={setUseGpt4}
            />
            <WhitelistManager whitelist={whitelist} setWhitelist={setWhitelist} />
          </>
        )}

        <div>
          <h4 className="text-xs text-gray-500">URL:</h4>
          <p className="text-sm break-all">{url}</p>
        </div>

        <AnalyzeButton
          disabled={!isWhitelisted || !apiKey || isLoading}
          isLoading={isLoading}
          provider={provider}
          useGpt4={useGpt4}
          apiKey={apiKey}
          url={url}
          setIsLoading={setIsLoading}
          setResult={setResult}
        />

        <ResultDisplay result={result} />
      </CardContent>
    </Card>
  );
}
