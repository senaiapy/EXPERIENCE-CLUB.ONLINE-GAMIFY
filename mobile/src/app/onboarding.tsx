import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-xl font-bold">
          Experience Club
        </Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          Descubre Tu Estilo
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🚀 Indica Y Gana
        </Text>
        <Text className="my-1 text-left text-lg">
          🥷 Usa su Billetera Y Gana
        </Text>
        <Text className="my-1 text-left text-lg">
          🧩 Descuentos Incleibles
        </Text>
        <Text className="my-1 text-left text-lg">
          💪 Regalos por Uso
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Iniciar"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
