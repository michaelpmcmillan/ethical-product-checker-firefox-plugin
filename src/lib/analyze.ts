import { getProviderMeta } from "./providers";

export async function analyzePage(provider: string, apiKey: string, url: string, model: string) {
  const endpoint = getProviderMeta(provider)?.endpoint;
  if (!endpoint) throw new Error(`No endpoint for provider: ${provider}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://your-extension-domain.com";
    headers["X-Title"] = "Ethical Info Extension";
  }

  const body = {
    model,
    messages: [
      { role: "system", content: "You are an ethical sourcing assistant..." },
      { role: "user", content: `Analyze the ethical background of the product at: ${url}` },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}
