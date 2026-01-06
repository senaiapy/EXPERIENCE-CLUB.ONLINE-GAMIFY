'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminGameApi } from '@/lib/game-api';

const TRANSACTION_TYPES = [
  'TASK_REWARD',
  'REFERRAL_BONUS',
  'ADMIN_BONUS',
  'ORDER_REDEMPTION',
  'REFUND',
  'PENALTY',
  'PROMOTION',
  'PURCHASE',
];

export default function AdminCoinsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!authenticated) {
      setIsLoading(false);
      router.push('/auth/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coins Management</h1>
        <p className="text-gray-600">Award or deduct coins from users</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setShowAwardModal(true)}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Award Coins</h3>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-green-100">Give bonus coins to users for special achievements or promotions</p>
        </button>

        <button
          onClick={() => setShowDeductModal(true)}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Deduct Coins</h3>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-red-100">Remove coins from users for violations or corrections</p>
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes:</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>All transactions are permanently recorded and auditable</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Users will see these transactions in their coin history</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Provide clear descriptions for transparency</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>1 coin = 1 USD value in the system</span>
          </li>
        </ul>
      </div>

      {/* Modals */}
      {showAwardModal && (
        <CoinModal
          type="award"
          onClose={() => setShowAwardModal(false)}
          onSuccess={() => setShowAwardModal(false)}
        />
      )}
      {showDeductModal && (
        <CoinModal
          type="deduct"
          onClose={() => setShowDeductModal(false)}
          onSuccess={() => setShowDeductModal(false)}
        />
      )}
    </div>
  );
}

function CoinModal({
  type,
  onClose,
  onSuccess,
}: {
  type: 'award' | 'deduct';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    userId: '',
    amount: 10,
    type: 'ADMIN_BONUS',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (type === 'award') {
        await adminGameApi.awardCoins(formData);
        alert('Coins awarded successfully!');
      } else {
        await adminGameApi.deductCoins(formData);
        alert('Coins deducted successfully!');
      }
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${type} coins`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {type === 'award' ? 'Award Coins' : 'Deduct Coins'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter user ID"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Find user ID in the users management section
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Provide a clear reason for this transaction"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 ${
                type === 'award' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {saving ? 'Processing...' : type === 'award' ? 'Award Coins' : 'Deduct Coins'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
