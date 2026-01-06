import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { View, Text } from '@/components/ui';
import { getCoinTransactions, getCoinBalance, CoinTransaction } from '@/api/game';

export default function TransactionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const [transactionsData, balanceData] = await Promise.all([
        getCoinTransactions(50),
        getCoinBalance(),
      ]);
      setTransactions(transactionsData);
      setBalance(balanceData);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      TASK_REWARD: '✅',
      REFERRAL_BONUS: '👥',
      ADMIN_BONUS: '⭐',
      PURCHASE: '🛒',
      REFUND: '↩️',
      PENALTY: '⚠️',
      PROMOTION: '🎁',
    };
    return icons[type] || '💰';
  };

  if (isLoading && transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">Loading transactions...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTransactions(); }} />}
    >
      <View className="p-4">
        {/* Header */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-green-600">← Back to Game</Text>
        </Pressable>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            Transaction History
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">View all your coin transactions</Text>
        </View>

        {/* Balance Card */}
        <View className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-8 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-green-100">Current Balance</Text>
              <Text className="mt-1 text-5xl font-bold text-white">{balance}</Text>
              <Text className="mt-1 text-sm text-green-100">coins</Text>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Text className="text-4xl">💰</Text>
            </View>
          </View>
        </View>

        {/* Shop Button */}
        <Pressable
          onPress={() => router.push('/feed')}
          className="mb-6 rounded-xl bg-orange-600 p-4 shadow-md"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-semibold text-white">Use Your Coins</Text>
              <Text className="text-xs text-orange-100">1 coin = 1 USD discount</Text>
            </View>
            <Text className="text-2xl">🛍️</Text>
          </View>
        </Pressable>

        {/* Transactions List */}
        {transactions.length > 0 ? (
          <View className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
              All Transactions
            </Text>
            <View className="gap-3">
              {transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="flex-row items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700"
                >
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-600">
                    <Text className="text-xl">{getTransactionIcon(transaction.type)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-neutral-900 dark:text-white">
                      {transaction.description}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-2">
                      <Text className="text-xs text-neutral-500">
                        {new Date(transaction.createdAt).toLocaleDateString('es-PY', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <View className="rounded bg-neutral-200 px-2 py-0.5 dark:bg-neutral-600">
                        <Text className="text-xs text-neutral-600 dark:text-neutral-300">
                          {transaction.type.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text
                      className={`text-xl font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </Text>
                    <Text className="text-xs text-neutral-500">
                      Bal: {transaction.balanceAfter}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="items-center rounded-xl bg-white p-12 shadow-md dark:bg-neutral-800">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
              <Text className="text-4xl">💳</Text>
            </View>
            <Text className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
              No Transactions Yet
            </Text>
            <Text className="mb-6 text-center text-neutral-600 dark:text-neutral-400">
              Complete tasks to start earning coins!
            </Text>
            <Pressable
              onPress={() => router.push('/game/tasks')}
              className="rounded-lg bg-green-600 px-6 py-3"
            >
              <Text className="font-semibold text-white">View Tasks</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
