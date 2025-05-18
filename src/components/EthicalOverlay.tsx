import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function EthicalOverlay() {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("ethical_api_key") || "");
  const [whitelist, setWhitelist] = useState(() => {
    const saved = localStorage.getItem("ethical_whitelist");
    return saved ? JSON.parse(saved) : ["sainsburys.co.uk", "tesco.com", "amazon.co.uk"];
  });
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    const prompt = `Analyze the product at the following URL. Identify the brand, the immediate owner, and the full ownership chain. Also identify the country of manufacture for this specific product if available. Output as structured JSON.

URL: ${url}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    try {
      const json = JSON.parse(content);
      setResult(json);
    } catch {
      setResult({ error: "Failed to parse response:", raw: content });
    }

    setIsLoading(false);
  };

  const saveApiKey = (value) => {
    localStorage.setItem("ethical_api_key", value);
    setApiKey(value);
  };

  const saveWhitelist = (list) => {
    localStorage.setItem("ethical_whitelist", JSON.stringify(list));
    setWhitelist(list);
  };

  return (
    <Card className="w-[340px] p-4 space-y-4">
      <h2 className="text-lg font-bold">Ethical Info Overlay</h2>

      <Input
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={(e) => saveApiKey(e.target.value)}
      />

      <div>
        <p className="text-sm font-semibold">URL:</p>
        <p className="text-xs break-all text-gray-600">{url}</p>
      </div>

      {isWhitelisted ? (
        <Button disabled={isLoading} onClick={handleAnalyze}>
          {isLoading ? "Loading..." : "Analyze Page"}
        </Button>
      ) : (
        <p className="text-red-500 text-sm">This domain is not whitelisted</p>
      )}

      {result && (
        <CardContent className="text-sm bg-gray-100 rounded p-2">
          {result.error && <div>{result.error}<pre>{result.raw}</pre></div>}
          {result.brand && (
            <>
              <p><strong>Brand:</strong> {result.brand}</p>
              <p><strong>Owner:</strong> {result.owner}</p>
              <p>
                <strong>Ownership Chain:</strong>{" "}
                {result.ownership_chain?.[0]}
                {result.ownership_chain?.length > 1 && (
                  <>
                    {!expanded && (
                      <Button size="sm" variant="link" onClick={() => setExpanded(true)}>
                        +{result.ownership_chain.length - 1} more
                      </Button>
                    )}
                    {expanded && (
                      <ul className="list-disc list-inside text-xs mt-1">
                        {result.ownership_chain.slice(1).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </p>
              <p><strong>Manufactured In:</strong> {result.manufactured_in || "Unknown"}</p>
            </>
          )}
        </CardContent>
      )}

      <div className="mt-4">
        <h3 className="font-semibold text-sm">Whitelist Domains</h3>
        <ul className="text-xs text-gray-700 space-y-1">
          {whitelist.map((domain, i) => (
            <li key={i} className="flex justify-between items-center">
              {domain}
              <Button size="sm" variant="ghost" onClick={() => {
                const updated = whitelist.filter((_, idx) => idx !== i);
                saveWhitelist(updated);
              }}>✕</Button>
            </li>
          ))}
        </ul>
        <Input
          placeholder="Add domain (e.g., aldi.co.uk)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = e.target.value.trim();
              if (val && !whitelist.includes(val)) {
                saveWhitelist([...whitelist, val]);
                e.target.value = "";
              }
            }
          }}
        />
      </div>
    </Card>
  );
}
