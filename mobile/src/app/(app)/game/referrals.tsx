import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Alert, Pressable, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { View, Text, Button } from '@/components/ui';
import { getReferrals, generateReferralCode, getDashboard, Referral } from '@/api/game';

export default function ReferralsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const [referralsData, dashboard] = await Promise.all([
        getReferrals(),
        getDashboard(),
      ]);
      setReferrals(referralsData);
      if (dashboard.referralCode) {
        setReferralCode(dashboard.referralCode);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load referrals');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      const code = await generateReferralCode();
      setReferralCode(code);
      Alert.alert('Success', 'Referral code generated!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate referral code');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    const referralLink = `https://experience-club.online/auth/register?ref=${referralCode}`;
    await Clipboard.setStringAsync(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Referral link copied to clipboard');
  };

  const handleShare = async () => {
    try {
      const referralLink = `https://experience-club.online/auth/register?ref=${referralCode}`;
      await Share.share({
        message: `Join Experience Club and get 50 bonus coins! Use my referral code: ${referralCode}\n\n${referralLink}`,
        title: 'Join Experience Club',
      });
    } catch (error: any) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading && !referralCode) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">Loading...</Text>
      </View>
    );
  }

  const pendingCount = referrals.filter((r) => r.status === 'PENDING').length;
  const completedCount = referrals.filter((r) => r.status === 'COMPLETED').length;

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadReferrals(); }} />}
    >
      <View className="p-4">
        {/* Header */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-green-600">← Back to Game</Text>
        </Pressable>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Referrals</Text>
          <Text className="mt-1 text-sm text-neutral-500">Invite friends and earn bonus coins!</Text>
        </View>

        {/* Stats */}
        <View className="mb-6 flex-row gap-4">
          <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="text-xs text-neutral-500">Total</Text>
            <Text className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
              {referrals.length}
            </Text>
          </View>
          <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="text-xs text-neutral-500">Pending</Text>
            <Text className="mt-1 text-2xl font-bold text-yellow-600">{pendingCount}</Text>
          </View>
          <View className="flex-1 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="text-xs text-neutral-500">Completed</Text>
            <Text className="mt-1 text-2xl font-bold text-green-600">{completedCount}</Text>
          </View>
        </View>

        {/* Referral Code Card */}
        <View className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg">
          <Text className="mb-4 text-2xl font-bold text-white">Your Referral Code</Text>

          {referralCode ? (
            <View>
              <View className="mb-4 rounded-lg bg-white/20 p-4">
                <Text className="mb-1 text-xs text-green-100">Share this link:</Text>
                <Text className="mb-3 break-all text-sm font-mono text-white">
                  experience-club.online/register?ref={referralCode}
                </Text>
                <Text className="text-xs text-green-100">
                  Code: <Text className="text-lg font-bold text-white">{referralCode}</Text>
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Button
                  label={copied ? 'Copied!' : 'Copy Link'}
                  onPress={handleCopyCode}
                  variant="outline"
                  className="flex-1"
                />
                <Button label="Share" onPress={handleShare} variant="outline" className="flex-1" />
              </View>

              <View className="mt-4 rounded-lg bg-white/10 p-3">
                <Text className="mb-2 font-semibold text-white">How it works:</Text>
                <View className="gap-2">
                  <Text className="text-sm text-green-100">1. Share your referral link</Text>
                  <Text className="text-sm text-green-100">2. Friends register using your link</Text>
                  <Text className="text-sm text-green-100">
                    3. You both earn <Text className="font-bold">20 bonus coins!</Text>
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text className="mb-4 text-white">You don't have a referral code yet.</Text>
              <Button
                label={generating ? 'Generating...' : 'Generate Referral Code'}
                onPress={handleGenerateCode}
                disabled={generating}
                variant="outline"
              />
            </View>
          )}
        </View>

        {/* Referrals List */}
        {referrals.length > 0 && (
          <View className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800">
            <Text className="mb-3 text-lg font-bold text-neutral-900 dark:text-white">
              Your Referrals
            </Text>
            <View className="gap-3">
              {referrals.map((referral) => (
                <View
                  key={referral.id}
                  className="flex-row items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700"
                >
                  <View>
                    <Text className="font-medium text-neutral-900 dark:text-white">
                      Referral #{referral.id.slice(0, 8)}
                    </Text>
                    <Text className="text-xs text-neutral-500">
                      {new Date(referral.createdAt).toLocaleDateString('es-PY', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <View
                      className={`rounded-full px-3 py-1 ${
                        referral.status === 'COMPLETED'
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-yellow-100 dark:bg-yellow-900'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          referral.status === 'COMPLETED'
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                        }`}
                      >
                        {referral.status}
                      </Text>
                    </View>
                    {referral.bonusAwarded && (
                      <Text className="text-xs font-bold text-green-600">+20 coins</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
