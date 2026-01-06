import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Lock, Mail, Phone, User } from 'lucide-react-native';
import React from 'react';
import type { Control, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { useRegister } from '@/api/auth';
import { Button, ControlledInput, Text, View } from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';

const schema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    phone: z
      .string({
        required_error: 'Phone is required',
      })
      .min(8, 'Phone must be at least 8 characters')
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormType = z.infer<typeof schema>;

// Header Component
function RegisterHeader() {
  const { t } = useTranslation();
  return (
    <View className="mb-6 items-center justify-center">
      <Image
        source={require('@/assets/clubofertas-icon.png')}
        style={{ width: 240, height: 240 }}
        resizeMode="contain"
      />
      <Text className="my-1 text-center text-3xl font-bold text-gray-800">
        {t('auth.create_account')}
      </Text>
      <Text className="max-w-sm text-center text-sm text-gray-600">
        {t('welcome')}
      </Text>
    </View>
  );
}

// Form Input Field with Icon
function FormField({
  icon: Icon,
  label,
  control,
  name,
  placeholder,
  secureTextEntry,
  showPasswordToggle,
  keyboardType,
  autoCapitalize,
  testID,
}: {
  icon: typeof User;
  label: string;
  control: Control<RegisterFormType>;
  name: keyof RegisterFormType;
  placeholder: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  keyboardType?: 'email-address' | 'default' | 'phone-pad';
  autoCapitalize?: 'none' | 'words';
  testID: string;
}) {
  return (
    <View className="mb-1">
      <View className="mb-2 flex-row items-center">
        <Icon size={20} color="#22c55e" strokeWidth={2} />
        <Text className="ml-2 text-base font-semibold text-gray-700">
          {label}
        </Text>
      </View>
      <ControlledInput
        testID={testID}
        control={control}
        name={name}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        showPasswordToggle={showPasswordToggle}
        className="rounded-xl border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
      />
    </View>
  );
}

// Footer Component
function RegisterFooter() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <View className="mt-8 items-center">
        <Text className="text-base text-gray-600">
          {t('auth.have_account')}{' '}
          <Text
            className="font-bold text-green-500"
            onPress={() => router.back()}
          >
            {t('auth.sign_in')}
          </Text>
        </Text>
      </View>
      <Text className="mt-6 text-center text-xs leading-5 text-gray-500">
        {t('checkout.terms_message')}
      </Text>
    </>
  );
}

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const { handleSubmit, control } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
    register(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
      {
        onSuccess: () => {
          Alert.alert(
            String(t('common.success')),
            'Tu cuenta ha sido creada exitosamente',
            [
              {
                text: String(t('common.ok')),
                onPress: () => router.replace('/login'),
              },
            ]
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || String(t('common.error'));
          Alert.alert(String(t('auth.register')), String(errorMessage));
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-2">
          <RegisterHeader />

          <View className="rounded-3xl bg-white p-6 shadow-lg">
            <FormField
              icon={User}
              label={t('auth.name')}
              control={control}
              name="name"
              placeholder="John Doe"
              autoCapitalize="words"
              testID="name-input"
            />

            <FormField
              icon={Mail}
              label={t('auth.email')}
              control={control}
              name="email"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              testID="email-input"
            />

            <FormField
              icon={Phone}
              label={t('auth.phone')}
              control={control}
              name="phone"
              placeholder="+595 XXX XXXXXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              testID="phone-input"
            />

            <FormField
              icon={Lock}
              label={t('auth.password')}
              control={control}
              name="password"
              placeholder="••••••••"
              secureTextEntry
              showPasswordToggle
              testID="password-input"
            />

            <FormField
              icon={Lock}
              label={`Confirm ${t('auth.password')}`}
              control={control}
              name="confirmPassword"
              placeholder="••••••••"
              secureTextEntry
              showPasswordToggle
              testID="confirm-password-input"
            />

            <Button
              testID="register-button"
              label={
                isPending ? `${t('common.loading')}...` : t('auth.sign_up')
              }
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
              className="mt-4 h-14 rounded-xl bg-green-500 shadow-lg"
              textClassName="text-lg font-bold text-white"
            />
          </View>

          <RegisterFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
