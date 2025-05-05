'use client';

import { useState } from 'react';

type ApiResponse = {
  [key: string]: unknown;
};

export default function Others() {
  const [apiUrl, setApiUrl] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!apiUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const renderDataAsCards = (data: unknown) => {
    if (!Array.isArray(data)) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="font-semibold">{key}: </span>
                {typeof value === 'object' ? (
                  <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <span>{String(value)}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">External API Viewer</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API URL (e.g., https://api.example.com/data)"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-8 text-black">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Raw API Response</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {Array.isArray(data) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Data Cards</h2>
              {renderDataAsCards(data)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
