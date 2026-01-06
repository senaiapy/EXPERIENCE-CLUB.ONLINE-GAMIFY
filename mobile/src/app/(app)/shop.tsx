/* eslint-disable max-lines-per-function */
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { useProducts } from '@/api/products';
import { Carousel } from '@/components/carousel';
import { Drawer } from '@/components/drawer';
import { Header } from '@/components/header';
import {
  ActivityIndicator,
  Pagination,
  ProductCard,
  Text,
  View,
} from '@/components/ui';

export default function ShopScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Only search if 3 or more characters, otherwise show all products
  const searchQuery = search.length >= 3 ? search : '';

  const { data, isLoading, error, refetch } = useProducts({
    variables: { page, limit: 20, search: searchQuery },
  });

  const totalPages = data?.total ? Math.ceil(data.total / 20) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    refetch();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-neutral-600">{t('home.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-2 text-center text-lg font-semibold text-red-600">
          {t('common.error')}
        </Text>
        <Text className="text-center text-sm text-neutral-600">
          {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      {/* Header with Menu */}
      <Header
        onMenuPress={() => setIsDrawerOpen(true)}
        title="Xperience Club"
      />

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="bg-white p-4 dark:bg-neutral-800">
          <View className="flex-row items-center rounded-xl bg-neutral-100 dark:bg-neutral-700">
            <TextInput
              placeholder={t('home.search')}
              value={search}
              onChangeText={setSearch}
              className="flex-1 px-4 py-3 text-base dark:text-white"
              placeholderTextColor="#999"
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#ef4444',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {search.length > 0 && search.length < 3 && (
            <Text className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {t('home.search_min_chars', { count: 3 - search.length })}
            </Text>
          )}
        </View>

        {/* Carousel */}
        <View className="p-4">
          <Carousel />
        </View>

        {/* Products Grid */}
        <View className="flex-row flex-wrap p-2">
          {data?.data && data.data.length > 0 ? (
            data.data.map((item) => (
              <View key={item.id} className="w-1/2 px-1">
                <ProductCard
                  product={item}
                  onPress={() => router.push(`/product/${item.id}`)}
                />
              </View>
            ))
          ) : (
            <Text className="w-full py-10 text-center">
              {t('home.no_products')}
            </Text>
          )}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={3}
          />
        )}
      </ScrollView>

      {/* Drawer Menu */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </View>
  );
}
