import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CoinsService } from '../coins/coins.service';
import { ReferralStatus, TransactionType } from '@prisma/client';

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private coinsService: CoinsService,
  ) {}

  async generateCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.referralCode) {
      return user.referralCode;
    }

    // Generate unique 8-character code
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const existing = await this.prisma.user.findUnique({
        where: { referralCode: code },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });

    return code;
  }

  async registerReferral(referralCode: string, newUserId: string) {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      throw new BadRequestException('Invalid referral code');
    }

    if (referrer.id === newUserId) {
      throw new BadRequestException('Cannot refer yourself');
    }

    const existingReferral = await this.prisma.referral.findFirst({
      where: {
        OR: [{ referredId: newUserId }, { referrerId: newUserId }],
      },
    });

    if (existingReferral) {
      throw new BadRequestException('User already referred');
    }

    const referral = await this.prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: newUserId,
        referralCode,
        status: ReferralStatus.REGISTERED,
      },
    });

    return referral;
  }

  async claimBonus(referrerId: string, referralId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
      include: { referred: true },
    });

    if (!referral) {
      throw new BadRequestException('Referral not found');
    }

    if (referral.referrerId !== referrerId) {
      throw new BadRequestException('Not your referral');
    }

    if (referral.rewardClaimed) {
      throw new BadRequestException('Bonus already claimed');
    }

    if (referral.status !== ReferralStatus.COMPLETED_FIRST_TASK) {
      throw new BadRequestException('Referred user has not completed first task yet');
    }

    const bonusAmount = 100; // 100 coins for successful referral

    await this.prisma.referral.update({
      where: { id: referralId },
      data: {
        rewardClaimed: true,
        coinReward: bonusAmount,
        claimedAt: new Date(),
        status: ReferralStatus.REWARD_GIVEN,
      },
    });

    const transaction = await this.coinsService.awardCoins(
      referrerId,
      bonusAmount,
      TransactionType.REFERRAL_BONUS,
      `Referral bonus for ${referral.referred.email}`,
      referralId,
      'referral',
    );

    return transaction;
  }

  async getUserReferrals(userId: string) {
    return this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: {
          select: {
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReferralStatus(referredId: string, status: ReferralStatus) {
    const referral = await this.prisma.referral.findFirst({
      where: { referredId },
    });

    if (referral) {
      await this.prisma.referral.update({
        where: { id: referral.id },
        data: { status },
      });
    }
  }
}
