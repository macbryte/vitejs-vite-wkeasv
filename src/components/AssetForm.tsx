import React, { useState } from 'react';
import { Asset } from '../types/finance';

interface AssetFormProps {
  onAddAsset: (asset: Omit<Asset, 'id' | 'created_at'>) => void;
}

export function AssetForm({ onAddAsset }: AssetFormProps) {
  const [asset, setAsset] = useState<Omit<Asset, 'id' | 'created_at'>>({
    category: '',
    description: '',
    value: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAsset(asset);
    setAsset({ category: '', description: '', value: 0 });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setAsset(prev => ({ ...prev, value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={asset.category}
          onChange={(e) => setAsset(prev => ({ ...prev, category: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select category</option>
          <option value="Cash">Cash</option>
          <option value="Investments">Investments</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={asset.description}
          onChange={(e) => setAsset(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Value</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={asset.value || ''}
          onChange={handleValueChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Asset
      </button>
    </form>
  );
}