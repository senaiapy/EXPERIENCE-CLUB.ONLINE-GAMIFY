import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { View, Text, Button } from '@/components/ui';
import { getUserTasks, completeTask, UserTask } from '@/api/game';

export default function TasksScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getUserTasks();
      setTasks(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setProcessingTaskId(taskId);
      await completeTask(taskId);
      await loadTasks();
      Alert.alert('Success', 'Task completed! Coins have been credited to your account.');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to complete task');
    } finally {
      setProcessingTaskId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      LOCKED: 'bg-neutral-200 dark:bg-neutral-700',
      AVAILABLE: 'bg-green-100 dark:bg-green-900',
      IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900',
      PENDING_VERIFY: 'bg-yellow-100 dark:bg-yellow-900',
      COMPLETED: 'bg-purple-100 dark:bg-purple-900',
    };
    return colors[status as keyof typeof colors] || colors.LOCKED;
  };

  const getStatusTextColor = (status: string) => {
    const colors = {
      LOCKED: 'text-neutral-700 dark:text-neutral-300',
      AVAILABLE: 'text-green-700 dark:text-green-300',
      IN_PROGRESS: 'text-blue-700 dark:text-blue-300',
      PENDING_VERIFY: 'text-yellow-700 dark:text-yellow-300',
      COMPLETED: 'text-purple-700 dark:text-purple-300',
    };
    return colors[status as keyof typeof colors] || colors.LOCKED;
  };

  if (isLoading && tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500">Loading tasks...</Text>
      </View>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const progressPercentage = (completedCount / tasks.length) * 100;

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTasks(); }} />}
    >
      <View className="p-4">
        {/* Header */}
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-green-600">← Back to Game</Text>
        </Pressable>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">My Tasks</Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Complete tasks to earn coins and unlock new challenges
          </Text>
        </View>

        {/* Progress Card */}
        <View className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-neutral-800">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-neutral-900 dark:text-white">Overall Progress</Text>
            <Text className="text-2xl font-bold text-green-600">
              {completedCount}/{tasks.length}
            </Text>
          </View>
          <View className="h-4 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <View
              className="h-full bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <Text className="mt-2 text-xs text-neutral-500">
            {progressPercentage.toFixed(0)}% completed
          </Text>
        </View>

        {/* Tasks List */}
        <View className="gap-4">
          {tasks.map((userTask, index) => {
            const task = userTask.task;
            const isDisabled = userTask.status === 'LOCKED' || userTask.status === 'COMPLETED';
            const canComplete = userTask.status === 'AVAILABLE' && !task.verificationRequired;

            return (
              <View
                key={userTask.id}
                className={`rounded-xl bg-white p-4 shadow-md dark:bg-neutral-800 ${
                  isDisabled ? 'opacity-60' : ''
                }`}
              >
                <View className="mb-3 flex-row items-start">
                  {/* Task Number/Status Icon */}
                  <View
                    className={`mr-4 h-12 w-12 items-center justify-center rounded-full ${
                      userTask.status === 'COMPLETED'
                        ? 'bg-green-100 dark:bg-green-900'
                        : userTask.status === 'AVAILABLE'
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : 'bg-neutral-100 dark:bg-neutral-700'
                    }`}
                  >
                    {userTask.status === 'COMPLETED' ? (
                      <Text className="text-2xl">✅</Text>
                    ) : userTask.status === 'LOCKED' ? (
                      <Text className="text-2xl">🔒</Text>
                    ) : (
                      <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  {/* Task Content */}
                  <View className="flex-1">
                    <View className="mb-2 flex-row flex-wrap items-center gap-2">
                      <Text className="font-bold text-neutral-900 dark:text-white">{task.name}</Text>
                      <View className={`rounded-full px-2 py-1 ${getStatusColor(userTask.status)}`}>
                        <Text className={`text-xs font-semibold ${getStatusTextColor(userTask.status)}`}>
                          {userTask.status.replace('_', ' ')}
                        </Text>
                      </View>
                      {task.verificationRequired && (
                        <View className="rounded-full bg-orange-100 px-2 py-1 dark:bg-orange-900">
                          <Text className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                            Verify
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {task.description}
                    </Text>

                    {task.instructions && (
                      <View className="mb-3 rounded-lg bg-blue-50 p-2 dark:bg-blue-900/30">
                        <Text className="text-xs text-blue-800 dark:text-blue-200">
                          <Text className="font-semibold">Instructions: </Text>
                          {task.instructions}
                        </Text>
                      </View>
                    )}

                    <View className="mb-3 flex-row flex-wrap items-center gap-3">
                      <View className="flex-row items-center">
                        <Text className="mr-1 text-xl">💰</Text>
                        <Text className="font-bold text-green-600">+{task.coinReward} coins</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="mr-1 text-lg">⏱️</Text>
                        <Text className="text-xs text-neutral-500">
                          {task.delayHours === 0
                            ? 'Available now'
                            : `Unlocks ${task.delayHours}h after previous`}
                        </Text>
                      </View>
                    </View>

                    {/* Action Button */}
                    {canComplete && (
                      <Button
                        label={processingTaskId === task.id ? 'Processing...' : 'Complete Task'}
                        onPress={() => handleCompleteTask(task.id)}
                        disabled={processingTaskId === task.id}
                        variant="default"
                        className="mt-2"
                      />
                    )}
                    {userTask.status === 'PENDING_VERIFY' && (
                      <View className="mt-2 rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
                        <Text className="text-center text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                          Pending Verification
                        </Text>
                        <Text className="mt-1 text-center text-xs text-yellow-700 dark:text-yellow-300">
                          Admin will review soon
                        </Text>
                      </View>
                    )}
                    {userTask.status === 'COMPLETED' && userTask.completedAt && (
                      <Text className="mt-2 text-center text-xs text-neutral-500">
                        Completed on{' '}
                        {new Date(userTask.completedAt).toLocaleDateString('es-PY', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
