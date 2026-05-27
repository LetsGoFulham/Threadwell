// This file will abstract the product aggregation from various stores.
import { Product, SearchQuery } from "@/types";
import { mockProducts } from "@/data/mock-products";

// Interface for a generic product source (e.g., Amazon API, Walmart API)
interface ProductSource {
    name: string;
    search(query: SearchQuery): Promise<Product[]>;
  }
  
  // Example implementation for a mock source
  const mockStoreSource: ProductSource = {
    name: 'MockStore',
    async search(query: SearchQuery): Promise<Product[]> {
      console.log(`Searching MockStore for:`, query.keywords.join(' '));
      // Filter mock products based on keywords (simple implementation)
      return mockProducts.filter(p => 
        query.keywords.some(kw => p.name.toLowerCase().includes(kw.toLowerCase()))
      );
    },
  };

  const allSources: ProductSource[] = [
    mockStoreSource,
    // Future sources would be added here:
    // new AmazonSource(),
    // new WalmartSource(),
  ];

  /**
 * Aggregates product results from multiple e-commerce sources.
 * @param query The structured search query from the AI service.
 * @returns A flat list of products from all sources.
 */
export async function aggregateProducts(query: SearchQuery): Promise<Product[]> {
    console.log("Aggregating products from all sources...");
  
    const results = await Promise.all(
      allSources.map(source => source.search(query))
    );
  
    // Flatten the array of arrays into a single array
    return results.flat();
  }
