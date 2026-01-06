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
  createdAt: string;
  updatedAt: string;
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
  verificationNotes?: string;
  task: GameTask;
  user: {
    id: string;
    email: string;
    name?: string;
  };
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
  user: {
    id: string;
    email: string;
    name?: string;
  };
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
  referrer: {
    id: string;
    email: string;
    name?: string;
  };
  referred: {
    id: string;
    email: string;
    name?: string;
  };
}

class AdminGameApiService {
  // Tasks Management
  async getAllTasks(): Promise<GameTask[]> {
    const response = await axios.get('/game/tasks');
    return response.data;
  }

  async createTask(data: {
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
  }): Promise<GameTask> {
    const response = await axios.post('/game/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: Partial<GameTask>): Promise<GameTask> {
    const response = await axios.patch(`/game/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`/game/tasks/${id}`);
  }

  // Verification
  async getPendingVerifications(): Promise<UserTask[]> {
    const response = await axios.get('/game/progress');
    return response.data.filter((ut: UserTask) => ut.status === 'PENDING_VERIFY');
  }

  async verifyTask(
    userTaskId: string,
    approved: boolean,
    notes?: string
  ): Promise<UserTask> {
    const response = await axios.post(`/game/progress/verify/${userTaskId}`, {
      approved,
      notes,
    });
    return response.data;
  }

  // Coins Management
  async awardCoins(data: {
    userId: string;
    amount: number;
    type: string;
    description: string;
    referenceId?: string;
    referenceType?: string;
  }): Promise<CoinTransaction> {
    const response = await axios.post('/game/coins/award', data);
    return response.data.transaction;
  }

  async deductCoins(data: {
    userId: string;
    amount: number;
    type: string;
    description: string;
    referenceId?: string;
    referenceType?: string;
  }): Promise<CoinTransaction> {
    const response = await axios.post('/game/coins/deduct', data);
    return response.data.transaction;
  }

  // Analytics
  async getAllReferrals(): Promise<Referral[]> {
    // Note: This would need an admin endpoint in backend
    // For now, return empty array
    return [];
  }

  async getGameStats(): Promise<{
    totalUsers: number;
    totalCoinsDistributed: number;
    totalTasksCompleted: number;
    totalReferrals: number;
    pendingVerifications: number;
  }> {
    // Note: This would need a stats endpoint in backend
    // Return mock data for now
    return {
      totalUsers: 0,
      totalCoinsDistributed: 0,
      totalTasksCompleted: 0,
      totalReferrals: 0,
      pendingVerifications: 0,
    };
  }
}

export const adminGameApi = new AdminGameApiService();
