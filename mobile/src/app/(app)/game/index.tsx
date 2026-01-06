import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { View, Text } from '@/components/ui';
import { getDashboard, Dashboard } from '@/api/game';

export default function GameDashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboard();
      setDashboard(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  if (isLoading && !dashboard) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">{t('game.loading')}</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-900">
        <Text className="text-center text-neutral-500">{t('game.failed_load')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadDashboard(); }} />}
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            {t('game.title')}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">{t('game.subtitle')}</Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-6 gap-4">
          {/* Coin Balance Card */}
          <View className="overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-green-100">{t('game.coin_balance')}</Text>
                <Text className="mt-1 text-4xl font-bold text-white">{dashboard.coinBalance}</Text>
              </View>
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <Text className="text-3xl">💰</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="flex-row gap-4">
            <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
              <Text className="text-xs text-neutral-500">{t('game.total_earned')}</Text>
              <Text className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                {dashboard.totalCoinsEarned}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
              <Text className="text-xs text-neutral-500">{t('game.tasks')}</Text>
              <Text className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                {dashboard.completedTasks}/{dashboard.totalTasks}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
              <Text className="text-xs text-neutral-500">{t('game.referrals')}</Text>
              <Text className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                {dashboard.referralCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Next Task Card */}
        {dashboard.nextTask && dashboard.nextTask.task && (
          <Pressable
            onPress={() => router.push('/game/tasks')}
            className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 shadow-lg"
          >
            <Text className="mb-2 text-xl font-bold text-white">{t('game.next_task')}</Text>
            <View className="rounded-lg bg-white/20 p-4">
              <Text className="mb-2 text-lg font-semibold text-white">
                {dashboard.nextTask.task.name}
              </Text>
              <Text className="mb-3 text-sm text-indigo-100">
                {dashboard.nextTask.task.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="rounded-full bg-yellow-400 px-3 py-1">
                  <Text className="text-sm font-bold text-yellow-900">
                    +{dashboard.nextTask.task.coinReward} {t('game.coins')}
                  </Text>
                </View>
                <Text className="text-sm text-indigo-100">
                  {t(`game.status.${dashboard.nextTask.status.toLowerCase()}`)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* Shop with Coins Button */}
        <Pressable
          onPress={() => router.push('/feed')}
          className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 shadow-lg"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">{t('game.shop_with_coins')}</Text>
              <Text className="mt-1 text-sm text-orange-100">
                {t('game.use_coins_discount', { count: dashboard.coinBalance })}
              </Text>
              <Text className="mt-2 text-xs text-orange-200">
                {t('game.coin_value')}
              </Text>
            </View>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Text className="text-3xl">🛍️</Text>
            </View>
          </View>
        </Pressable>

        {/* Quick Links */}
        <View className="mb-6 gap-3">
          <Pressable
            onPress={() => router.push('/game/tasks')}
            className="flex-row items-center rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800"
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Text className="text-2xl">✅</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-neutral-900 dark:text-white">{t('game.my_tasks')}</Text>
              <Text className="text-xs text-neutral-500">{t('game.view_complete_tasks')}</Text>
            </View>
            <Text className="text-neutral-400">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/game/referrals')}
            className="flex-row items-center rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800"
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Text className="text-2xl">👥</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-neutral-900 dark:text-white">{t('game.referrals')}</Text>
              <Text className="text-xs text-neutral-500">{t('game.invite_friends')}</Text>
            </View>
            <Text className="text-neutral-400">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/game/transactions')}
            className="flex-row items-center rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800"
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Text className="text-2xl">💳</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-neutral-900 dark:text-white">{t('game.transactions')}</Text>
              <Text className="text-xs text-neutral-500">{t('game.view_coin_history')}</Text>
            </View>
            <Text className="text-neutral-400">›</Text>
          </Pressable>
        </View>

        {/* Recent Transactions */}
        {dashboard.recentTransactions && dashboard.recentTransactions.length > 0 && (
          <View className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
              {t('game.recent_transactions')}
            </Text>
            <View className="gap-3">
              {dashboard.recentTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="flex-row items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-neutral-900 dark:text-white">
                      {transaction.description}
                    </Text>
                    <Text className="text-xs text-neutral-500">
                      {new Date(transaction.createdAt).toLocaleDateString('es-PY', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text
                    className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
