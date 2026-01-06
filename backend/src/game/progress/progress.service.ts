import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CoinsService } from '../coins/coins.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private tasksService: TasksService,
    private coinsService: CoinsService,
  ) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        coinBalance: true,
        totalCoinsEarned: true,
        referralCode: true,
        onboardingComplete: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userTasks = await this.tasksService.getUserTasks(userId);
    const completedTasks = userTasks.filter((ut) => ut.status === TaskStatus.COMPLETED).length;

    const nextTask = userTasks.find(
      (ut) => ut.status === TaskStatus.AVAILABLE || ut.status === TaskStatus.IN_PROGRESS,
    );

    const referralCount = await this.prisma.referral.count({
      where: { referrerId: userId },
    });

    const recentTransactions = await this.coinsService.getTransactions(userId, 5);

    return {
      coinBalance: user.coinBalance,
      totalCoinsEarned: user.totalCoinsEarned,
      referralCode: user.referralCode,
      onboardingComplete: user.onboardingComplete,
      completedTasks,
      totalTasks: userTasks.length,
      nextTask: nextTask
        ? {
            ...nextTask.task,
            status: nextTask.status,
            nextAvailableAt: nextTask.nextAvailableAt,
          }
        : null,
      referralCount,
      recentTransactions,
    };
  }

  async getProgress(userId: string) {
    const userTasks = await this.tasksService.getUserTasks(userId);

    return {
      tasks: userTasks.map((ut) => ({
        id: ut.task.id,
        name: ut.task.name,
        description: ut.task.description,
        coinReward: ut.task.coinReward,
        taskType: ut.task.taskType,
        status: ut.status,
        startedAt: ut.startedAt,
        completedAt: ut.completedAt,
        nextAvailableAt: ut.nextAvailableAt,
        orderIndex: ut.task.orderIndex,
      })),
    };
  }

  async getAllUsersProgress() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        coinBalance: true,
        totalCoinsEarned: true,
        referralCode: true,
        onboardingComplete: true,
        createdAt: true,
      },
      orderBy: { totalCoinsEarned: 'desc' },
    });

    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        const userTasks = await this.tasksService.getUserTasks(user.id);
        const completedTasks = userTasks.filter((ut) => ut.status === TaskStatus.COMPLETED).length;

        const referralCount = await this.prisma.referral.count({
          where: { referrerId: user.id },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          coinBalance: user.coinBalance,
          totalCoinsEarned: user.totalCoinsEarned,
          completedTasks,
          totalTasks: userTasks.length,
          referralCode: user.referralCode,
          referralCount,
          onboardingComplete: user.onboardingComplete,
          lastActivity: user.createdAt,
        };
      }),
    );

    return { users: usersWithProgress };
  }
}
