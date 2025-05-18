import React from "react";
import flags from "country-emoji";

type OwnershipLink = {
  name: string;
  country: string;
};

export default function OwnershipChainDisplay({ ownershipChain }: { ownershipChain: OwnershipLink[];}) {
  if (!ownershipChain || ownershipChain.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {ownershipChain.map((link, index) => {
        console.warn("Missing flag for:", link.country);
        const flag = flags.flag(link.country) || "🏳️";
        return (
          <span key={index} className="bg-muted px-2 py-1 rounded">
            {flag} {link.name}
          </span>
        );
      })}
    </div>
  );
}