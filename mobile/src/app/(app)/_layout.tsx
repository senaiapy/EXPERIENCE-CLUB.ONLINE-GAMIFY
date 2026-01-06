/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View as RNView } from 'react-native';
import { Home, ShoppingBag } from 'lucide-react-native';

import {
  Cart as CartIcon,
  Heart as HeartIcon,
  User as UserIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime, useCart } from '@/lib';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from '@/components/whats-app-button';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const totalItems = useCart.use.totalItems();
  const { t } = useTranslation();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <RNView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarIconStyle: {
            width: 24,
            height: 24,
          },
          tabBarBadgeStyle: {
            minWidth: 18,
            maxHeight: 18,
            borderRadius: 9,
            fontSize: 8,
            lineHeight: 18,
            fontWeight: '700',
            paddingHorizontal: 0,
            marginLeft: 16,
            top: -2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Hide from tab bar (used only for redirect)
          }}
        />

        <Tabs.Screen
          name="game"
          options={{
            title: t('tabs.game'),
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            tabBarButtonTestID: 'game-tab',
            href: '/game',
          }}
        />

        <Tabs.Screen
          name="shop"
          options={{
            title: t('tabs.shop'),
            tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
            tabBarButtonTestID: 'shop-tab',
          }}
        />

        <Tabs.Screen
          name="wishlist"
          options={{
            title: t('tabs.wishlist'),
            tabBarIcon: ({ color }) => <HeartIcon color={color} />,
            tabBarButtonTestID: 'wishlist-tab',
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: t('tabs.cart'),
            tabBarIcon: ({ color }) => <CartIcon color={color} />,
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
            tabBarButtonTestID: 'cart-tab',
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color }) => <UserIcon color={color} />,
            tabBarButtonTestID: 'profile-tab',
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="terms"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="style"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </RNView>
  );
}
