import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

import { useCreateOrder } from '@/api/orders';
import type { PaymentMethod } from '@/api/orders/types';
import { Button, ControlledInput, Text, View } from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

const PARAGUAYAN_CITIES = [
  'Asunción',
  'Ciudad del Este',
  'San Lorenzo',
  'Luque',
  'Capiatá',
  'Lambaré',
  'Fernando de la Mora',
  'Encarnación',
];

const schema = z.object({
  shippingAddress: z.string().min(5, 'Address must be at least 5 characters'),
  shippingCity: z.string().min(1, 'City is required'),
  phone: z.string().min(6, 'Phone number is required'),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormType = z.infer<typeof schema>;

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuth.use.user();
  const cartList = useCart.use.cartList();
  const totalPrice = useCart.use.totalPrice();
  const clearCart = useCart.use.clearCart();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COINS');
  const [selectedCity, setSelectedCity] = useState('Asunción');

  const { handleSubmit, control, setValue } = useForm<CheckoutFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      shippingAddress: user?.address || '',
      shippingCity: user?.city || 'Asunción',
      phone: user?.phone || '',
      postalCode: user?.postalCode || '',
      notes: '',
    },
  });

  // Calculate shipping cost - always free
  const shippingCost = 0;
  const tax = 0; // IVA included in Paraguay
  const total = totalPrice + shippingCost + tax;

  const onSubmit: SubmitHandler<CheckoutFormType> = (data) => {
    if (cartList.length === 0) {
      Alert.alert(t('cart.empty'), t('checkout.add_items_message'));
      return;
    }

    createOrder(
      {
        shippingAddress: data.shippingAddress,
        shippingCity: selectedCity,
        shippingCountry: 'Paraguay',
        phone: data.phone,
        postalCode: data.postalCode,
        paymentMethod,
        shippingCost,
        tax,
        notes: data.notes,
      },
      {
        onSuccess: (order) => {
          clearCart();
          Alert.alert(t('common.success'), t('checkout.order_success'), [
            {
              text: t('common.ok'),
              onPress: () => router.push(`/order-confirmation?orderId=${order.id}`),
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            t('checkout.order_failed'),
            error.response?.data?.message || t('common.error')
          );
        },
      }
    );
  };

  if (cartList.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-xl font-bold text-neutral-900 dark:text-white">
          {t('cart.empty')}
        </Text>
        <Text className="mb-6 text-center text-neutral-600 dark:text-neutral-400">
          {t('checkout.add_items_message')}
        </Text>
        <Button label={t('product.continue_shopping')} onPress={() => router.push('/')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 p-4">
        <Text className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
          {t('checkout.title')}
        </Text>

        {/* Shipping Information */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
            {t('checkout.shipping_info')}
          </Text>

          <ControlledInput
            control={control}
            name="shippingAddress"
            label={t('checkout.address')}
            placeholder="Av. Mcal. López 1234"
          />

          {/* City Selector */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-neutral-700 dark:text-neutral-300">
              {t('checkout.city')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {PARAGUAYAN_CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  onPress={() => {
                    setSelectedCity(city);
                    setValue('shippingCity', city);
                  }}
                  className={`mr-2 rounded-lg border px-4 py-2 ${
                    selectedCity === city
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                      : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                  }`}
                >
                  <Text
                    className={
                      selectedCity === city
                        ? 'font-semibold text-primary-600 dark:text-primary-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ControlledInput
            control={control}
            name="phone"
            label={t('checkout.phone')}
            placeholder="+595 981 123456"
            keyboardType="phone-pad"
          />

          <ControlledInput
            control={control}
            name="postalCode"
            label={t('checkout.postal_code')}
            placeholder="1234"
            keyboardType="number-pad"
          />
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
            {t('checkout.payment_method')}
          </Text>
          {(['COINS', 'CASH', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'] as PaymentMethod[]).map(
            (method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setPaymentMethod(method)}
                className={`mb-3 flex-row items-center rounded-lg border p-4 ${
                  paymentMethod === method
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                    : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                }`}
              >
                <View
                  className={`mr-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                    paymentMethod === method
                      ? 'border-primary-600'
                      : 'border-neutral-400'
                  }`}
                >
                  {paymentMethod === method && (
                    <View className="h-3 w-3 rounded-full bg-primary-600" />
                  )}
                </View>
                <Text
                  className={
                    paymentMethod === method
                      ? 'font-semibold text-neutral-900 dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }
                >
                  {method === 'COINS' && '🪙 Moedas'}
                  {method === 'CASH' && '💵 Dinheiro'}
                  {method === 'PIX' && '🔑 Pix'}
                  {method === 'CREDIT_CARD' && t('checkout.credit_card')}
                  {method === 'DEBIT_CARD' && t('checkout.debit_card')}
                  {method === 'BANK_TRANSFER' && t('checkout.bank_transfer')}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Order Notes */}
        <View className="mb-6">
          <ControlledInput
            control={control}
            name="notes"
            label={t('checkout.notes')}
            placeholder={t('checkout.notes_placeholder')}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary */}
        <View className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <Text className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
            {t('checkout.order_summary')}
          </Text>

          <View className="mb-2 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">
              {t('checkout.subtotal')} ({cartList.length} {t('checkout.items')})
            </Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              ₲{totalPrice.toLocaleString('es-PY')}
            </Text>
          </View>

          <View className="mb-2 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">{t('checkout.shipping')}</Text>
            <Text className="font-semibold text-green-600 dark:text-green-400">
              ₲0
            </Text>
          </View>

          <View className="mb-4 flex-row justify-between">
            <Text className="text-neutral-700 dark:text-neutral-300">{t('checkout.tax')}</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white">
              ₲{tax.toLocaleString('es-PY')}
            </Text>
          </View>

          <View className="border-t border-neutral-300 pt-4 dark:border-neutral-600">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('cart.total')}
              </Text>
              <Text className="text-xl font-bold text-primary-600">
                ₲{total.toLocaleString('es-PY')}
              </Text>
            </View>
          </View>

          {totalPrice > 730000 && (
            <View className="mt-3 rounded-lg bg-green-50 p-2 dark:bg-green-900">
              <Text className="text-center text-sm font-semibold text-green-700 dark:text-green-300">
                🎉 {t('checkout.free_shipping_message')}
              </Text>
            </View>
          )}
        </View>

        {/* Place Order Button */}
        <Button
          label={isPending ? `${t('common.loading')}...` : t('checkout.place_order')}
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isPending}
          className="mb-4"
        />

        <Text className="mb-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {t('checkout.terms_message')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
