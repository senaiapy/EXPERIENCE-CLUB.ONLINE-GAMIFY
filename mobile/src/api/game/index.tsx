import { client } from '../common/client';

export interface GameTask {
  id: string;
  name: string;
  description: string;
  coinReward: number;
  taskType: string;
  delayHours: number;
  orderIndex: number;
  isActive: boolean;
  verificationRequired: boolean;
  externalUrl?: string;
  instructions?: string;
}

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'PENDING_VERIFY' | 'COMPLETED';
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  nextAvailableAt?: string;
  proofUrl?: string;
  task: GameTask;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string;
  referenceId?: string;
  referenceType?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface Dashboard {
  coinBalance: number;
  totalCoinsEarned: number;
  referralCode?: string;
  onboardingComplete: boolean;
  completedTasks: number;
  totalTasks: number;
  nextTask?: UserTask;
  referralCount: number;
  recentTransactions: CoinTransaction[];
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  code: string;
  status: 'PENDING' | 'COMPLETED';
  bonusAwarded: boolean;
  createdAt: string;
  completedAt?: string;
}

// Dashboard
export const getDashboard = async (): Promise<Dashboard> => {
  const response = await client.get('/game/progress/dashboard');
  return response.data;
};

// Coins
export const getCoinBalance = async (): Promise<number> => {
  const response = await client.get('/game/coins/balance');
  return response.data.balance;
};

export const getCoinTransactions = async (limit: number = 20): Promise<CoinTransaction[]> => {
  const response = await client.get('/game/coins/transactions', {
    params: { limit },
  });
  return response.data.transactions;
};

// Tasks
export const getAllTasks = async (): Promise<GameTask[]> => {
  const response = await client.get('/game/tasks');
  return response.data.tasks || response.data;
};

export const getUserTasks = async (): Promise<UserTask[]> => {
  const response = await client.get('/game/tasks/user/my-tasks');
  return response.data.userTasks;
};

export const startTask = async (taskId: string): Promise<UserTask> => {
  const response = await client.post(`/game/progress/start/${taskId}`);
  return response.data.userTask;
};

export const completeTask = async (taskId: string, proofUrl?: string): Promise<UserTask> => {
  const response = await client.post(`/game/progress/complete/${taskId}`, {
    proofUrl,
  });
  return response.data.userTask;
};

// Referrals
export const generateReferralCode = async (): Promise<string> => {
  const response = await client.post('/game/referrals/generate');
  return response.data.code;
};

export const getReferrals = async (): Promise<Referral[]> => {
  const response = await client.get('/game/referrals');
  return response.data.referrals;
};

export const getReferralByCode = async (code: string): Promise<Referral> => {
  const response = await client.get(`/game/referrals/${code}`);
  return response.data;
};
