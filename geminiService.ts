
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { POLICIES, BUSINESS_INFO } from "../constants";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// WooCommerce API Configuration
const WC_CONFIG = {
  url: "https://itgalleryshop.com/wp-json/wc/v3",
  consumerKey: "ck_c1385acb7c3163a93d559a6e14cf07a1f76bf2ed",
  consumerSecret: "cs_1fb0625b3539e54773642183cc9e3c6a60cb2382"
};

/**
 * Fetches products from real WooCommerce store
 */
async function fetchProductsFromWC(params: { search?: string; min_price?: string; max_price?: string; category?: string; status?: string }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.min_price) query.append("min_price", params.min_price);
  if (params.max_price) query.append("max_price", params.max_price);
  query.append("stock_status", "instock"); // Prioritize in-stock products
  query.append("per_page", "10");

  const auth = btoa(`${WC_CONFIG.consumerKey}:${WC_CONFIG.consumerSecret}`);
  
  try {
    const response = await fetch(`${WC_CONFIG.url}/products?${query.toString()}`, {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch from WooCommerce");
    
    const data = await response.json();
    
    // Map WC product to our App's Product type
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      regular_price: p.regular_price ? parseFloat(p.regular_price) : undefined,
      permalink: p.permalink,
      images: p.images.length ? [{ src: p.images[0].src }] : [{ src: "https://placehold.co/400x300?text=No+Image" }],
      stock_status: p.stock_status,
      short_description: p.short_description.replace(/<[^>]*>?/gm, ''), // Strip HTML
      specs: {
        processor: p.attributes?.find((a: any) => a.name.toLowerCase() === "processor")?.options?.[0] || "N/A",
        ram: p.attributes?.find((a: any) => a.name.toLowerCase() === "ram")?.options?.[0] || "N/A",
        ssd: p.attributes?.find((a: any) => a.name.toLowerCase() === "ssd" || a.name.toLowerCase() === "storage")?.options?.[0] || "N/A",
        warranty: "15 Days Replacement, 1-5 Years Service Warranty" // Default based on user instructions
      }
    }));
  } catch (error) {
    console.error("WooCommerce API Error:", error);
    return [];
  }
}

const searchProductsTool: FunctionDeclaration = {
  name: "searchProducts",
  parameters: {
    type: Type.OBJECT,
    description: "Search for used laptops and computers from the live shop by budget, brand, or purpose.",
    properties: {
      searchTerm: { type: Type.STRING, description: "Keywords like 'laptop', 'gaming', 'dell', 'i5'." },
      minPrice: { type: Type.NUMBER, description: "Minimum budget in BDT." },
      maxPrice: { type: Type.NUMBER, description: "Maximum budget in BDT." }
    }
  }
};

const getPoliciesTool: FunctionDeclaration = {
  name: "getPolicies",
  parameters: {
    type: Type.OBJECT,
    description: "Retrieve specific store policies (warranty, return, used status).",
    properties: {
      policyType: { type: Type.STRING, enum: ["warranty", "return", "usedStatus", "replacement"] }
    }
  }
};

export const chatWithAssistant = async (history: any[], message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: `User message: ${message}` }] }
      ],
      config: {
        systemInstruction: `আপনি IT Gallery Shop-এর অফিসিয়াল এআই অ্যাসিস্ট্যান্ট। 

অত্যন্ত গুরুত্বপূর্ণ (Strict Rules):
১. সকল পণ্য USED: আপনি অবশ্যই জানাবেন যে আমাদের সকল ল্যাপটপ ব্যবহৃত (Used/Pre-owned), তবে এগুলো হাই-কোয়ালিটি এবং চেক করা।
২. রিয়েল-টাইম তথ্য: 'searchProducts' টুল ব্যবহার করে ওয়েবসাইট থেকে বর্তমান দাম এবং স্টক যাচাই করুন। কোনো তথ্য অনুমান করবেন না।
৩. ওয়ারেন্টি পলিসি: আমাদের প্রতিটি ইউজড ল্যাপটপের সাথে '১৫ দিনের রিপ্লেসমেন্ট গ্যারান্টি' এবং '১ থেকে ৫ বছরের সার্ভিস ওয়ারেন্টি' থাকে।
৪. লোকেশন: মিরপুর-১০, ফাহাদ প্লাজা (৩য় তলা)। সকাল ১০টা থেকে রাত ১০টা পর্যন্ত খোলা (৭ দিনই)।
৫. সাজেশন লজিক: 
   - কাস্টমার যদি বাজেট বলে, সেই বাজেটের মধ্য থেকে ইন-স্টক প্রোডাক্ট দেখান।
   - গেমিং এর জন্য বললে ডেডিকেটেড জিপিইউ (RTX/GTX) আছে এমন ল্যাপটপ খুঁজুন।
   - অফিস বা স্টুডেন্টদের জন্য স্লিম এবং বাজেট ফ্রেন্ডলি অপশন দিন।
৬. ভাষা: কাস্টমারের ভাষা অনুযায়ী (বাংলা/ইংরেজি) উত্তর দিন।`,
        tools: [{ functionDeclarations: [searchProductsTool, getPoliciesTool] }],
        temperature: 0.1,
      },
    });

    const callPart = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall);
    
    if (callPart && callPart.functionCall) {
      const { name, args } = callPart.functionCall as any;
      
      if (name === "searchProducts") {
        const products = await fetchProductsFromWC({
          search: args.searchTerm,
          min_price: args.minPrice?.toString(),
          max_price: args.maxPrice?.toString()
        });
        
        return {
          content: products.length > 0 
            ? `আমি আপনার জন্য আমাদের ওয়েবসাইট থেকে সেরা কিছু ব্যবহৃত ল্যাপটপ খুঁজে পেয়েছি:` 
            : `দুঃখিত, আপনার চাহিদা অনুযায়ী বর্তমানে কোনো প্রোডাক্ট স্টকে নেই। আমাদের অন্য কালেকশনগুলো দেখতে পারেন।`,
          products: products,
          type: 'product-suggestion'
        };
      }

      if (name === "getPolicies") {
        const type = args.policyType as keyof typeof POLICIES;
        return {
          content: POLICIES[type] || "আমাদের শোরুম ভিজিট করুন বা আমাদের কল দিন বিস্তারিত তথ্যের জন্য।",
          type: 'policy'
        };
      }
    }

    return {
      content: response.text || "আমি দুঃখিত, আমি আপনার কথাটি ঠিক বুঝতে পারিনি। পুনরায় বলবেন কি?",
      type: 'text'
    };
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return {
      content: "দুঃখিত, বর্তমানে আমাদের সিস্টেমে সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর চেষ্টা করুন বা সরাসরি ফোন করুন: " + BUSINESS_INFO.phone,
      type: 'text'
    };
  }
};
