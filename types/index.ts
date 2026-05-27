// Product type
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    store: string; // e.g., 'Amazon', 'Walmart'
    rating: number;
    reviewCount: number;
    imageUrl: string;
    affiliateLink: string;
    shippingInfo: string;
  }
  
  // User type
  export interface User {
    id: string;
    name: string;
    email: string;
    searchHistory: SearchHistory[];
    savedItems: Product[]; // "Closet"
  }
  
  // Search-related types
  export interface SearchQuery {
    originalQuery: string;
    keywords: string[];
    category?: string;
    priceMin?: number;
    priceMax?: number;
    brand?: string;
  }
  
  export interface SearchHistory {
    id: string;
    query: string;
    timestamp: Date;
    results: Product[];
  }
  
  // Ranking type
  export interface RankingScore {
    relevance: number;
    price: number;
    reviews: number;
    shipping: number;
    overall: number;
  }
  
