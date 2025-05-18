# Ethical Product Checker – Firefox Extension 🧭

A browser extension that shows ethical metadata for products on sites like Sainsburys, Tesco, and Amazon. Powered by GPT-4, it fetches:

- ✅ Brand
- ✅ Ownership chain (e.g., McVitie’s → United Biscuits → Yıldız Holding)
- ✅ Country of manufacture
- ✅ Links to EthicalConsumer and Wikipedia

## 🔐 Privacy-first

- Your API key is stored locally (not transmitted anywhere except OpenAI).
- The plugin only runs on URLs you whitelist.

## 🧪 Tech Stack

- Firefox extension (Manifest v3)
- React + Vite
- TailwindCSS
- shadcn/ui (for clean, reusable components)

## 🛠 Setup

```bash
git clone https://github.com/michaelpmcmillan/ethical-product-checker-firefox-plugin.git
cd ethical-product-checker-firefox-plugin
npm install
npm run build
```