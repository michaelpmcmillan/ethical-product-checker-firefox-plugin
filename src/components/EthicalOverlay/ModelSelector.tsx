import React from "react";
import { PROVIDERS } from "@/lib/providers";

type Props = {
  provider: string;
  model: string;
  setModel: (model: string) => void;
};

export default function ModelSelector({ provider, model, setModel }: Props) {
  const selectedProvider = PROVIDERS.find(p => p.id === provider);

  if (!selectedProvider || !selectedProvider.models) return null;

  return (
    <div className="pl-4 space-y-2">
      <label className="font-medium">Model:</label>
      <select
        value={model}
        onChange={(e) => {
          setModel(e.target.value);
          localStorage.setItem(`ethical_model_${provider}`, e.target.value);
        }}
        className="w-full border rounded px-2 py-1"
      >
        {selectedProvider.models.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
