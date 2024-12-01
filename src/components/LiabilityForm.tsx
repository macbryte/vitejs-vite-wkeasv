import React, { useState } from 'react';
import { Liability } from '../types/finance';

interface LiabilityFormProps {
  onAddLiability: (liability: Omit<Liability, 'id' | 'created_at'>) => void;
}

export function LiabilityForm({ onAddLiability }: LiabilityFormProps) {
  const [liability, setLiability] = useState<Omit<Liability, 'id' | 'created_at'>>({
    category: '',
    description: '',
    amount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLiability(liability);
    setLiability({ category: '', description: '', amount: 0 });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value === '' ? 0 : parseFloat(e.target.value);
    setLiability(prev => ({ ...prev, amount }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={liability.category}
          onChange={(e) => setLiability(prev => ({ ...prev, category: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select category</option>
          <option value="Credit Cards">Credit Cards</option>
          <option value="Loans">Loans</option>
          <option value="Mortgage">Mortgage</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={liability.description}
          onChange={(e) => setLiability(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={liability.amount || ''}
          onChange={handleAmountChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Add Liability
      </button>
    </form>
  );
}