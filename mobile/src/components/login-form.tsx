import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView } from 'react-native';
import * as z from 'zod';

import { useLogin } from '@/api/auth';
import { Button, ControlledInput, Text, View } from '@/components/ui';
import { signIn } from '@/lib/auth';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const onSubmitForm: SubmitHandler<FormType> = (data) => {
    login(data, {
      onSuccess: (response) => {
        console.log('✅ Login successful - User:', response.user.email);
        signIn({
          token: { access: response.access_token },
          user: response.user,
        });
        console.log('🎮 Redirecting to Game page...');
        router.replace('/game');
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || String(t('common.error'));
        console.log('❌ Login failed:', errorMessage);
        Alert.alert(String(t('auth.login')), String(errorMessage));
      },
    });
    onSubmit(data);
  };

  return (
    <View className="flex-1 bg-gray-200">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-2">
          {/* Header Section with Logo */}
          <View className="mb-8 items-center justify-center">
            <Image
              source={require('@/assets/clubofertas-icon.png')}
              style={{ width: 240, height: 240 }}
              resizeMode="contain"
            />
            <Text
              testID="form-title"
              className="my-2 text-center text-3xl font-bold text-gray-800"
            >
              {t('auth.sign_in')}
            </Text>
            <Text className="max-w-sm text-center text-sm text-gray-600">
              {t('auth.welcome_back')}
            </Text>
          </View>

          {/* Form Card */}
          <View className="rounded-3xl bg-white p-6 shadow-lg">
            {/* Email Input with Icon */}
            <View className="mb-1">
              <View className="mb-2 flex-row items-center">
                <Mail size={20} color="#22c55e" strokeWidth={2} />
                <Text className="ml-2 text-base font-semibold text-gray-700">
                  {t('auth.email')}
                </Text>
              </View>
              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="rounded-xl border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
              />
            </View>

            {/* Password Input with Icon */}
            <View className="mb-4">
              <View className="mb-2 flex-row items-center">
                <Lock size={20} color="#22c55e" strokeWidth={2} />
                <Text className="ml-2 text-base font-semibold text-gray-700">
                  {t('auth.password')}
                </Text>
              </View>
              <ControlledInput
                testID="password-input"
                control={control}
                name="password"
                placeholder="••••••••"
                secureTextEntry
                showPasswordToggle
                className="rounded-xl border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
              />
            </View>

            {/* Sign In Button - Light Green */}
            <Button
              testID="login-button"
              label={
                isPending ? `${t('common.loading')}...` : t('auth.sign_in')
              }
              onPress={handleSubmit(onSubmitForm)}
              loading={isPending}
              disabled={isPending}
              className="mt-4 h-14 rounded-xl bg-green-500 shadow-lg"
              textClassName="text-lg font-bold text-white"
            />
          </View>

          {/* Sign Up Link */}
          <View className="mt-8 items-center">
            <Text className="text-base text-gray-600">
              {t('auth.no_account')}{' '}
              <Text
                className="font-bold text-green-500"
                onPress={() => router.push('/register')}
              >
                {t('auth.sign_up')}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
