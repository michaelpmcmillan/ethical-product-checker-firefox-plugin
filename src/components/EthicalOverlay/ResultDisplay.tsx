import React from "react";
import OwnershipChainDisplay from "./OwnershipChainDisplay";

type Props = {
  result: {
    brand?: string;
    owner?: string;
    ownership_chain?: [string, string][];
    country_of_origin?: string;
    ingredients?: string[];
    packaging?: string;
    price?: string;
  };
};

export default function ResultDisplay({ result }: Props) {
  if (!result) return null;

  return (
    <div className="bg-muted p-4 rounded text-sm space-y-4">
      {result.brand && (
        <div>
          <h3 className="font-semibold">Brand</h3>
          <p>{result.brand}</p>
        </div>
      )}

      {result.owner && (
        <div>
          <h3 className="font-semibold">Owner</h3>
          <p>{result.owner}</p>
        </div>
      )}

      {result.ownership_chain && result.ownership_chain.length > 0 && (
        <div>
          <h3 className="font-semibold">Ownership Chain</h3>
          <OwnershipChainDisplay ownershipChain={result.ownership_chain} />
        </div>
      )}

      {result.country_of_origin && (
        <div>
          <h3 className="font-semibold">Manufactured In</h3>
          <p>{result.country_of_origin}</p>
        </div>
      )}

      {result.ingredients && result.ingredients.length > 0 && (
        <div>
          <h3 className="font-semibold">Ingredients</h3>
          <ul className="list-disc list-inside">
            {result.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.packaging && (
        <div>
          <h3 className="font-semibold">Packaging</h3>
          <p>{result.packaging}</p>
        </div>
      )}

      {result.price && (
        <div>
          <h3 className="font-semibold">Price</h3>
          <p>{result.price}</p>
        </div>
      )}
    </div>
  );
}