import axios from './axios';

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

class GameApiService {
  // Dashboard
  async getDashboard(): Promise<Dashboard> {
    const response = await axios.get('/game/progress/dashboard');
    return response.data;
  }

  // Coins
  async getCoinBalance(): Promise<number> {
    const response = await axios.get('/game/coins/balance');
    return response.data.balance;
  }

  async getCoinTransactions(limit: number = 20): Promise<CoinTransaction[]> {
    const response = await axios.get('/game/coins/transactions', {
      params: { limit },
    });
    return response.data.transactions;
  }

  // Tasks
  async getAllTasks(): Promise<GameTask[]> {
    const response = await axios.get('/game/tasks');
    return response.data.tasks || response.data;
  }

  async getUserTasks(): Promise<UserTask[]> {
    const response = await axios.get('/game/tasks/user/my-tasks');
    return response.data.userTasks;
  }

  async startTask(taskId: string): Promise<UserTask> {
    const response = await axios.post(`/game/progress/start/${taskId}`);
    return response.data.userTask;
  }

  async completeTask(taskId: string, proofUrl?: string): Promise<UserTask> {
    const response = await axios.post(`/game/progress/complete/${taskId}`, {
      proofUrl,
    });
    return response.data.userTask;
  }

  // Referrals
  async generateReferralCode(): Promise<string> {
    const response = await axios.post('/game/referrals/generate');
    return response.data.code;
  }

  async getReferrals(): Promise<Referral[]> {
    const response = await axios.get('/game/referrals');
    return response.data.referrals;
  }

  async getReferralByCode(code: string): Promise<Referral> {
    const response = await axios.get(`/game/referrals/${code}`);
    return response.data;
  }
}

export const gameApi = new GameApiService();
