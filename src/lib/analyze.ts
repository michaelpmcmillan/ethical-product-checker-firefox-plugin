import { getProviderMeta } from "./providers";
import prompt from "./prompt.json";

export async function analyzePage(provider: string, apiKey: string, url: string, model: string) {
  const endpoint = getProviderMeta(provider)?.endpoint;
  if (!endpoint) throw new Error(`No endpoint for provider: ${provider}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://www.mikemcmillan.dev/";
    headers["X-Title"] = "Conscious Cart Extension";
  }

  const body = {
    model,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: `Please analyze this product page: ${url}` },
    ]
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}
