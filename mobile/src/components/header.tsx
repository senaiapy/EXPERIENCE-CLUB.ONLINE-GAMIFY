import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Menu, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { View, Text, SafeAreaView } from './ui';
import { useCart } from '@/lib';

interface HeaderProps {
  onMenuPress: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress, title = 'Shop' }) => {
  const router = useRouter();
  const totalItems = useCart.use.totalItems();

  return (
    <SafeAreaView className="bg-emerald-600">
      <View className="px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between">
        {/* Menu Button */}
        <TouchableOpacity
          onPress={onMenuPress}
          className="h-10 w-10 items-center justify-center rounded-lg bg-white/20"
        >
          <Menu size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl font-bold text-white">{title}</Text>

        {/* Cart Button */}
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          className="relative h-10 w-10 items-center justify-center rounded-lg bg-white/20"
        >
          <ShoppingCart size={22} color="#fff" strokeWidth={2.5} />
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
