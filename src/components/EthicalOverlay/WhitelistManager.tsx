// manages whitelist domains
import { Input } from "@/components/ui/input";

type Props = {
  whitelist: string[];
  setWhitelist: (domains: string[]) => void;
};

export default function WhitelistManager({ whitelist, setWhitelist }: Props) {
  const addDomain = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const domain = e.currentTarget.value.trim();
    if (!domain || whitelist.includes(domain)) return;

    const updated = [...whitelist, domain];
    setWhitelist(updated);
    localStorage.setItem("ethical_whitelist", JSON.stringify(updated));
    e.currentTarget.value = "";
  };

  const removeDomain = (domain: string) => {
    const updated = whitelist.filter((d) => d !== domain);
    setWhitelist(updated);
    localStorage.setItem("ethical_whitelist", JSON.stringify(updated));
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold">Whitelist Domains</h3>
      <div className="pl-4 space-y-2">
        {whitelist.map((domain) => (
          <div key={domain} className="flex justify-between items-center">
            <span>{domain}</span>
            <button
              onClick={() => removeDomain(domain)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
        <Input
          placeholder="Add domain (e.g., aldi.co.uk)"
          onKeyDown={addDomain}
          className="mt-2"
        />
      </div>
    </div>
  );
}
