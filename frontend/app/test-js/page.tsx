'use client';

import { useState } from 'react';

export default function TestJS() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">JavaScript Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => alert('Basic alert works!')}
          className="bg-red-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Alert Button
        </button>

        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Count: {count}
        </button>

        <button 
          onClick={() => console.log('Console log test')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Console Log
        </button>
      </div>
    </div>
  );
}