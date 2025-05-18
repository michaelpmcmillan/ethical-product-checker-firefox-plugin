// handles the actual request and button logic
import { Button } from "@/components/ui/button";

type Props = {
  disabled: boolean;
  isLoading: boolean;
  provider: string;
  useGpt4: boolean;
  apiKey: string;
  url: string;
  setIsLoading: (val: boolean) => void;
  setResult: (res: string) => void;
};

export default function AnalyzeButton({
  disabled,
  isLoading,
  provider,
  useGpt4,
  apiKey,
  url,
  setIsLoading,
  setResult,
}: Props) {
  const handleClick = async () => {
    if (!apiKey || !url) return;

    setIsLoading(true);
    setResult("");

    const prompt = `Analyze the product at the following URL. Identify the brand, owner chain, and country of manufacture.

URL: ${url}`;

    const model =
      provider === "openai"
        ? useGpt4
          ? "gpt-4"
          : "gpt-3.5-turbo"
        : "mistralai/Mistral-7B-Instruct-v0.1";

    const endpoint =
      provider === "openai"
        ? "https://api.openai.com/v1/chat/completions"
        : "https://api.together.xyz/v1/chat/completions";

    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok || !data.choices) {
        throw new Error(data?.error?.message || "Unknown error");
      }

      const content = data.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("Empty response");

      setResult(content);
    } catch (err: any) {
      setResult("⚠️ Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={disabled} onClick={handleClick} className="w-full">
      {isLoading ? "Analyzing..." : "Analyze Page"}
    </Button>
  );
}
