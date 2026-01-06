import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { View, Text } from '@/components/ui';

export default function TermsScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView className="flex-1 p-6">
        <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t('terms.title')}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {t('terms.intro')}
        </Text>
        <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {t('terms.section1_title')}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {t('terms.section1_content')}
        </Text>
        <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {t('terms.section2_title')}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {t('terms.section2_content')}
        </Text>
      </ScrollView>
    </View>
  );
}
