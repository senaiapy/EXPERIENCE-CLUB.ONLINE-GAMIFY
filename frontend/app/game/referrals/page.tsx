'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { gameApi, Referral } from '@/lib/game-api';
import { authApi } from '@/lib/auth-api';
import Link from 'next/link';

export default function ReferralsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadReferrals();
  }, [router]);

  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const [referralsData, dashboard] = await Promise.all([
        gameApi.getReferrals(),
        gameApi.getDashboard(),
      ]);
      setReferrals(referralsData);
      if (dashboard.referralCode) {
        setReferralCode(dashboard.referralCode);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao carregar indicações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      const code = await gameApi.generateReferralCode();
      setReferralCode(code);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao gerar código de indicação');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h2 className="text-xl font-semibold text-red-800 mb-2">{t.error}</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const pendingCount = referrals.filter((r) => r.status === 'PENDING').length;
  const completedCount = referrals.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <Link href="/game" className="text-green-600 hover:text-green-700 font-medium mb-3 sm:mb-4 inline-block text-sm sm:text-base">
          ← Voltar ao Painel
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t.referrals}</h1>
        <p className="text-sm sm:text-base text-gray-600">Convide amigos e ganhe moedas bônus!</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Indicações</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{referrals.length}</h3>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pendente</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Concluído</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">{completedCount}</h3>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 mb-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Seu Código de Indicação</h2>

        {referralCode ? (
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-green-100 text-sm mb-1">Compartilhe este link:</p>
                  <p className="text-2xl font-bold font-mono break-all">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${referralCode}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCopyCode}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
                <div className="text-sm text-green-100">
                  <p>Código: <span className="font-bold text-lg">{referralCode}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Como funciona:</h3>
              <ul className="space-y-2 text-sm text-green-100">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Compartilhe seu link de indicação com amigos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Eles se registram usando seu link</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Vocês dois ganham 20 moedas bônus quando completam o registro!</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Você ainda não tem um código de indicação.</p>
            <button
              onClick={handleGenerateCode}
              disabled={generating}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              {generating ? 'Gerando...' : 'Gerar Código de Indicação'}
            </button>
          </div>
        )}
      </div>

      {/* Referrals List */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Suas Indicações</h2>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Indicação #{referral.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      referral.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {referral.status === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                  </span>
                  {referral.bonusAwarded && (
                    <span className="text-green-600 font-bold">{t.bonusCoins}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
