import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ApiKeyInput from "./ApiKeyInput";
import WhitelistManager from "./WhitelistManager";
import ResultDisplay from "./ResultDisplay";
import { analyzePage } from "../../lib/analyze";
import SettingsToggle from "./SettingsToggle";
import ModelSelector from "./ModelSelector";

export default function EthicalOverlay() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [provider, setProvider] = useState(() => localStorage.getItem("ethical_provider") || "openai");
  const [model, setModel] = useState(() => {
    const saved = localStorage.getItem(`ethical_model_${provider}`);
    return saved || "";
  });
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem("ethical_api_keys");
    return saved ? JSON.parse(saved) : {};
  });

  const apiKey = apiKeys[provider] || "";

  useEffect(() => {
    const saved = localStorage.getItem(`ethical_model_${provider}`);
    setModel(saved || "");
  }, [provider]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setUrl(tab?.url || "");
    });
  }, []);

  const handleAnalyze = async () => {
    if (!apiKey || !url) return;
    setIsLoading(true);
    setResult(null);

    try {
      const resultText = await analyzePage(provider, apiKey, url, model);
      setResult(resultText);
    } catch (err: any) {
      setResult("⚠️ Request failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyChange = (key: string) => {
    const updated = { ...apiKeys, [provider]: key };
    setApiKeys(updated);
    localStorage.setItem("ethical_api_keys", JSON.stringify(updated));
  };

  const isWhitelisted = ["sainsburys.co.uk", "tesco.com", "amazon.co.uk"].some(domain =>
    url.includes(domain)
  );

  const [whitelist, setWhitelist] = useState<string[]>([
    "sainsburys.co.uk",
    "tesco.com",
    "amazon.co.uk",
  ]);

  return (
    <Card className="p-4 space-y-4 w-[480px] text-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Conscious Cart</h2>
        <SettingsToggle expanded={expanded} setExpanded={setExpanded} />
      </div>

      {expanded && (
        <div className="space-y-4">
          <div className="space-y-1">
            <ApiKeyInput
              provider={provider}
              setProvider={setProvider}
              apiKey={apiKey}
              setApiKey={handleKeyChange}
            />
            <ModelSelector provider={provider} model={model} setModel={setModel} />
          </div>

          <hr className="my-2 border-muted" />

          <div className="space-y-1">
            <WhitelistManager whitelist={whitelist} setWhitelist={setWhitelist} />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
        </Button>
      </div>

      <div>
        <p className="text-muted-foreground text-xs mb-1">URL:</p>
        <p className="break-words text-xs">{url}</p>
      </div>

      {isWhitelisted && (
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? "Analyzing..." : "Analyze Page"}
        </Button>
      )}

      {result && <ResultDisplay result={result} />}
    </Card>
  );
}
