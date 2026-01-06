import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('game/referrals')
@Controller('game/referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user referrals' })
  async getUserReferrals(@Request() req) {
    const referrals = await this.referralsService.getUserReferrals(req.user.userId);
    return { referrals };
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate referral code' })
  async generateCode(@Request() req) {
    const code = await this.referralsService.generateCode(req.user.userId);
    return { code };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get referral by code' })
  async getReferralByCode(@Param('code') code: string) {
    const user = await this.referralsService.generateCode(code);
    return { valid: !!user };
  }

  @Post('claim/:referralId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim referral bonus' })
  async claimBonus(@Request() req, @Param('referralId') referralId: string) {
    const transaction = await this.referralsService.claimBonus(req.user.userId, referralId);
    return { success: true, transaction };
  }
}
