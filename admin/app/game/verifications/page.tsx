'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminGameApi, UserTask } from '@/lib/game-api';

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated') === 'true';
    if (!authenticated) {
      setIsLoading(false);
      router.push('/auth/login');
      return;
    }
    loadVerifications();
  }, [router]);

  const loadVerifications = async () => {
    try {
      setIsLoading(true);
      const data = await adminGameApi.getPendingVerifications();
      setVerifications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load verifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userTaskId: string, approved: boolean) => {
    const notes = approved
      ? ''
      : prompt('Please provide a reason for rejection:');

    if (!approved && !notes) return;

    try {
      setProcessingId(userTaskId);
      await adminGameApi.verifyTask(userTaskId, approved, notes || undefined);
      await loadVerifications();
      alert(
        approved
          ? 'Task approved! User has been credited with coins.'
          : 'Task rejected. User has been notified.'
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify task');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Verifications</h1>
        <p className="text-gray-600">Review and approve user task submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Pending Verifications</p>
          <h3 className="text-3xl font-bold text-yellow-600 mt-1">{verifications.length}</h3>
        </div>
      </div>

      {/* Verifications List */}
      {verifications.length > 0 ? (
        <div className="space-y-6">
          {verifications.map((userTask) => (
            <div
              key={userTask.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{userTask.task.name}</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      Pending Verification
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{userTask.task.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">User:</p>
                      <p className="font-medium text-gray-900">
                        {userTask.user.name || userTask.user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted:</p>
                      <p className="font-medium text-gray-900">
                        {userTask.completedAt
                          ? new Date(userTask.completedAt).toLocaleDateString('es-PY', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Coin Reward:</p>
                      <p className="font-bold text-green-600 text-lg">
                        +{userTask.task.coinReward} coins
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Task Type:</p>
                      <p className="font-medium text-gray-900">{userTask.task.taskType}</p>
                    </div>
                  </div>

                  {userTask.proofUrl && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Proof Submitted:</p>
                      <a
                        href={userTask.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {userTask.proofUrl}
                      </a>
                    </div>
                  )}

                  {userTask.task.instructions && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Task Instructions:</p>
                      <p className="text-sm text-gray-600">{userTask.task.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleVerify(userTask.id, false)}
                  disabled={processingId === userTask.id}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleVerify(userTask.id, true)}
                  disabled={processingId === userTask.id}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{processingId === userTask.id ? 'Processing...' : 'Approve'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending verifications at the moment.</p>
        </div>
      )}
    </div>
  );
}
