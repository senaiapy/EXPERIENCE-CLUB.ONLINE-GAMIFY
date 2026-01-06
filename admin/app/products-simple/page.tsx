'use client';

import { useState, useEffect } from 'react';

export default function ProductsSimplePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=10`)
      .then(res => res.json())
      .then(data => {
        console.log('Success:', data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8"><h1 className="text-2xl">Loading...</h1></div>;
  if (error) return <div className="p-8"><h1 className="text-2xl text-red-600">Error: {error}</h1></div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products - Simple Test</h1>
      <p className="mb-4">Found {products.length} products</p>

      <div className="grid gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="border p-4 rounded bg-white">
            <h3 className="font-bold">{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Sale: ${p.price_sale}</p>
            <p>Brand: {p.brand?.name}</p>
            <p>Category: {p.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}