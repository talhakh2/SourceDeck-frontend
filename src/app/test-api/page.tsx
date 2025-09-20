'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function TestApiPage() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test stats API
      console.log('Testing stats API...');
      const statsResponse = await apiClient.getStats();
      console.log('Stats response:', statsResponse);
      setStats(statsResponse);

      // Test products API
      console.log('Testing products API...');
      const productsResponse = await apiClient.getProducts({ limit: 3 });
      console.log('Products response:', productsResponse);
      setProducts(productsResponse);

    } catch (err) {
      console.error('API test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-4">
            <div>
              <strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
            </div>
            <div>
              <strong>Status:</strong> 
              {loading ? (
                <span className="text-yellow-600 ml-2">Testing...</span>
              ) : error ? (
                <span className="text-red-600 ml-2">Failed</span>
              ) : (
                <span className="text-green-600 ml-2">Connected</span>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Stats API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        )}

        {products && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Products API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={testApiConnection}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Retry Test
        </button>
      </div>
    </div>
  );
}
