import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function EthicalOverlay() {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("ethical_api_key") || "");
  const [whitelist, setWhitelist] = useState(() => {
    const saved = localStorage.getItem("ethical_whitelist");
    return saved ? JSON.parse(saved) : ["sainsburys.co.uk", "tesco.com", "amazon.co.uk"];
  });
  const [useGpt4, setUseGpt4] = useState(false);
  const [showConfig, setShowConfig] = useState(() => !localStorage.getItem("ethical_api_key"));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setUrl(tab?.url || "");
    });
  }, []);

  const isWhitelisted = whitelist.some(domain => url.includes(domain));

  const handleAnalyze = async () => {
    if (!apiKey || !url) return;

    setIsLoading(true);
    setResult(null);
    setErrorMessage("");

    const model = useGpt4 ? "gpt-4" : "gpt-3.5-turbo";
    const prompt = `Analyze the product at the following URL. Identify the brand, the immediate owner, and the full ownership chain. Return in this format:

Brand: ___
Owner: ___
Manufactured In: ___
EthicalConsumer | Wikipedia

URL: ${url}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const msg = data?.error?.message || `Request failed with status ${response.status}`;
        setErrorMessage(msg);
        console.error("GPT Error:", msg);
        return;
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("No response from GPT");

      setResult(content.trim());
    } catch (err: any) {
      console.error("Failed to parse response:", err);
      setErrorMessage(err.message || "Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const domain = e.currentTarget.value.trim();
      if (domain && !whitelist.includes(domain)) {
        const updated = [...whitelist, domain];
        setWhitelist(updated);
        localStorage.setItem("ethical_whitelist", JSON.stringify(updated));
      }
      e.currentTarget.value = "";
    }
  };

  const handleDeleteDomain = (domain: string) => {
    const updated = whitelist.filter(d => d !== domain);
    setWhitelist(updated);
    localStorage.setItem("ethical_whitelist", JSON.stringify(updated));
  };

  const handleKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("ethical_api_key", key);
  };

  return (
    <Card className="p-4 w-[400px] text-sm">
      <CardContent>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Ethical Info Overlay</h2>
          <button
            className="text-gray-500 text-lg"
            title="Toggle Settings"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>

        {showConfig && (
          <>
            <Input
              className="mt-3"
              placeholder="OpenAI API Key"
              value={apiKey}
              onChange={e => handleKeyChange(e.target.value)}
            />
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              className="text-blue-500 text-xs mt-1 inline-block"
            >
              Don't have a key? Create one here
            </a>

            <div className="flex items-center justify-between mt-4">
              <label htmlFor="gpt4" className="text-sm">
                Use GPT-4
              </label>
              <Switch
                id="gpt4"
                checked={useGpt4}
                onCheckedChange={v => setUseGpt4(v)}
              />
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-1">Whitelist Domains</p>
              {whitelist.map(domain => (
                <div key={domain} className="flex justify-between items-center">
                  <span>{domain}</span>
                  <button onClick={() => handleDeleteDomain(domain)}>×</button>
                </div>
              ))}
              <Input
                className="mt-2"
                placeholder="Add domain (e.g., aldi.co.uk)"
                onKeyDown={handleAddDomain}
              />
            </div>
          </>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <strong>URL:</strong>
          <div className="break-words">{url}</div>
        </div>

        <Button
          className="mt-4 w-full"
          disabled={!apiKey || !isWhitelisted || isLoading}
          onClick={handleAnalyze}
        >
          {isLoading ? "Analyzing..." : "Analyze Page"}
        </Button>

        {result && (
          <pre className="mt-4 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">
            {result}
          </pre>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-600 text-sm">
            ⚠️ {errorMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}