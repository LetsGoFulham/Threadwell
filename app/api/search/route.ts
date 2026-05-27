// Mock API route for search
import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/data/mock-products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // In a real app, this is where the AI query processing, 
  // product aggregation, and ranking would happen.
  console.log(`Searching for: ${query}`);

  // For now, returning mock data
  return NextResponse.json(mockProducts);
}
