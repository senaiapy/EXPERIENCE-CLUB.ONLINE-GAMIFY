import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Menu, ShoppingBag, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { View, Text, SafeAreaView } from './ui';
import { useCart } from '@/lib';

interface GameHeaderProps {
  onMenuPress: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onMenuPress }) => {
  const router = useRouter();
  const totalItems = useCart.use.totalItems();

  return (
    <SafeAreaView className="bg-emerald-600">
      <View className="px-4 pb-4 pt-2">
        <View className="relative flex-row items-center justify-between">
          {/* Menu Button - Left Aligned */}
          <TouchableOpacity
            onPress={onMenuPress}
            className="h-10 w-10 items-center justify-center rounded-lg bg-white/20"
          >
            <Menu size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Center Section with Home Icon and Text - Absolutely positioned */}
          <View
            className="absolute left-0 right-0 flex-row items-center justify-center gap-2"
            style={{ pointerEvents: 'box-none' }}
          >
            <TouchableOpacity
              onPress={() => router.push('/game')}
              className="h-10 w-10 items-center justify-center rounded-lg bg-white/20"
              style={{ pointerEvents: 'auto' }}
            >
              <Home size={22} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Xperience Club</Text>
          </View>

          {/* Shopping Bag Button - Right Aligned - Redirects to Loja */}
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="relative h-10 w-10 items-center justify-center rounded-lg bg-white/20"
          >
            <ShoppingBag size={22} color="#fff" strokeWidth={2.5} />
            {totalItems > 0 && (
              <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1">
                <Text className="text-[8px] font-bold leading-[18px] text-white">
                  {totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
