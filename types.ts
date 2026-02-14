
export interface Product {
  id: number;
  name: string;
  price: number;
  regular_price?: number;
  sale_price?: number;
  permalink: string;
  images: { src: string }[];
  stock_status: 'instock' | 'outofstock';
  short_description: string;
  attributes: {
    name: string;
    options: string[];
  }[];
  specs?: {
    processor?: string;
    ram?: string;
    ssd?: string;
    graphics?: string;
    display?: string;
    warranty?: string;
  };
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  products?: Product[];
  comparison?: Product[];
  type?: 'text' | 'product-suggestion' | 'comparison' | 'emi-check' | 'store-info' | 'policy' | 'agent-handoff';
}

export enum BotAction {
  SEARCH_BUDGET = 'SEARCH_BUDGET',
  COMPARE = 'COMPARE',
  CHECK_EMI = 'CHECK_EMI',
  WARRANTY = 'WARRANTY',
  STORE_LOCATOR = 'STORE_LOCATOR'
}
