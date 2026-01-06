import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class CoinsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });
    return user?.coinBalance || 0;
  }

  async awardCoins(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    referenceId?: string,
    referenceType?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const balanceBefore = user.coinBalance;
    const balanceAfter = balanceBefore + amount;

    const transaction = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          coinBalance: balanceAfter,
          totalCoinsEarned: user.totalCoinsEarned + amount,
        },
      });

      return tx.coinTransaction.create({
        data: {
          userId,
          amount,
          type,
          description,
          referenceId,
          referenceType,
          balanceBefore,
          balanceAfter,
        },
      });
    });

    return transaction;
  }

  async deductCoins(
    userId: string,
    amount: number,
    type: TransactionType,
    description: string,
    referenceId?: string,
    referenceType?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.coinBalance < amount) {
      throw new BadRequestException('Insufficient coin balance');
    }

    const balanceBefore = user.coinBalance;
    const balanceAfter = balanceBefore - amount;

    const transaction = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { coinBalance: balanceAfter },
      });

      return tx.coinTransaction.create({
        data: {
          userId,
          amount: -amount,
          type,
          description,
          referenceId,
          referenceType,
          balanceBefore,
          balanceAfter,
        },
      });
    });

    return transaction;
  }

  async getTransactions(userId: string, limit = 50) {
    return this.prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getAllTransactions(limit = 100) {
    return this.prisma.coinTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  }

  calculateUsdValue(coins: number): number {
    return coins * 1; // 1 coin = 1 USD
  }
}
