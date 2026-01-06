import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, View, Text } from '@/components/ui';
import { User as UserIcon } from '@/components/ui/icons';
import { signOut, useAuth } from '@/lib';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const token = useAuth.use.token();

  return (
    <View className="flex-1 bg-neutral-50 p-4 dark:bg-neutral-900">
      <View className="items-center py-10">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-orange-600">
          <UserIcon color="#fff" width={48} height={48} />
        </View>
        <Text className="text-2xl font-bold">{t('profile.title')}</Text>
        <Text className="mt-2 text-sm text-neutral-500">
          {token?.access || 'Demo Account'}
        </Text>
      </View>

      <View className="mt-6 gap-4">
        <View className="rounded-xl bg-white p-4 dark:bg-neutral-800">
          <Text className="mb-2 text-sm text-neutral-500">{t('auth.email')}</Text>
          <Text className="font-medium">user@example.com</Text>
        </View>

        <View className="rounded-xl bg-white p-4 dark:bg-neutral-800">
          <Text className="mb-2 text-sm text-neutral-500">{t('profile.member_since')}</Text>
          <Text className="font-medium">January 2025</Text>
        </View>

        <Button label={t('profile.sign_out')} onPress={signOut} variant="secondary" />
      </View>
    </View>
  );
}
