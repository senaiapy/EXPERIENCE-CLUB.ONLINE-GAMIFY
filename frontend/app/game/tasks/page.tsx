'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { gameApi, UserTask } from '@/lib/game-api';
import { authApi } from '@/lib/auth-api';
import Link from 'next/link';

export default function TasksPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await gameApi.getUserTasks();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Invalid tasks data received:', data);
        setTasks([]);
        setError('Formato de dados inválido recebido do servidor');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao carregar tarefas');
      setTasks([]); // Ensure tasks is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setProcessingTaskId(taskId);
      await gameApi.completeTask(taskId);
      await loadTasks();
      alert('Tarefa concluída! Moedas foram creditadas na sua conta.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao concluir tarefa');
    } finally {
      setProcessingTaskId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      LOCKED: 'bg-gray-200 text-gray-700',
      AVAILABLE: 'bg-green-100 text-green-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      PENDING_VERIFY: 'bg-yellow-100 text-yellow-700',
      COMPLETED: 'bg-purple-100 text-purple-700',
    };
    return badges[status as keyof typeof badges] || badges.LOCKED;
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      LOCKED: 'Bloqueado',
      AVAILABLE: 'Disponível',
      IN_PROGRESS: 'Em Progresso',
      PENDING_VERIFY: 'Aguardando Verificação',
      COMPLETED: 'Concluído',
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') {
      return (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'LOCKED') {
      return (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">{t.error}</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  // Safe fallback for tasks array - ensure it's always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedCount = safeTasks.filter((t) => t.status === 'COMPLETED').length;
  const progressPercentage = safeTasks.length > 0 ? (completedCount / safeTasks.length) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <Link href="/game" className="text-green-600 hover:text-green-700 font-medium mb-3 sm:mb-4 inline-block text-sm sm:text-base">
          ← Voltar ao Painel
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t.myTasks}</h1>
        <p className="text-sm sm:text-base text-gray-600">Complete tarefas para ganhar moedas e desbloquear novos desafios</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Progresso Geral</h2>
          <span className="text-2xl font-bold text-green-600">
            {completedCount}/{safeTasks.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {progressPercentage.toFixed(0)}% Concluído
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {safeTasks.map((userTask, index) => {
          const task = userTask.task;
          const isDisabled = userTask.status === 'LOCKED' || userTask.status === 'COMPLETED';
          const canComplete =
            userTask.status === 'AVAILABLE' && !task.verificationRequired;

          return (
            <div
              key={userTask.id}
              className={`bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 transition-all ${
                isDisabled ? 'opacity-60' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 w-full">
                  {/* Task Number */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      userTask.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : userTask.status === 'AVAILABLE'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {userTask.status === 'COMPLETED' ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Task Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{task.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          userTask.status
                        )}`}
                      >
                        {getStatusText(userTask.status)}
                      </span>
                      {task.verificationRequired && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          Verificação Necessária
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>

                    {task.instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Instruções:</strong> {task.instructions}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-green-600">
                          +{task.coinReward} coins
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {task.delayHours === 0
                            ? 'Disponível agora'
                            : `Disponível ${task.delayHours}h após tarefa anterior`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full sm:w-auto sm:ml-4">
                  {canComplete && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={processingTaskId === task.id}
                      className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {processingTaskId === task.id ? 'Processando...' : 'Completar Tarefa'}
                    </button>
                  )}
                  {userTask.status === 'PENDING_VERIFY' && (
                    <div className="text-center">
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold">
                        Verificação Pendente
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        O admin revisará em breve
                      </p>
                    </div>
                  )}
                  {userTask.status === 'COMPLETED' && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        {getStatusIcon('COMPLETED')}
                      </div>
                      {userTask.completedAt && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {new Date(userTask.completedAt).toLocaleDateString('pt-BR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}
                  {userTask.status === 'LOCKED' && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getStatusIcon('LOCKED')}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Bloqueado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
