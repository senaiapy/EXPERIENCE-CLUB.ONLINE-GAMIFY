import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AwardCoinsDto, DeductCoinsDto } from '../dto';

@ApiTags('game/coins')
@Controller('game/coins')
export class CoinsController {
  constructor(private coinsService: CoinsService) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user coin balance' })
  async getBalance(@Request() req) {
    const balance = await this.coinsService.getBalance(req.user.userId);
    return { balance };
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactions(@Request() req, @Query('limit') limit?: string) {
    const transactions = await this.coinsService.getTransactions(
      req.user.userId,
      limit ? parseInt(limit) : 50,
    );
    return { transactions };
  }

  @Post('award')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Award coins to user (Admin only)' })
  async awardCoins(@Body() data: AwardCoinsDto) {
    const { userId, amount, type, description, referenceId, referenceType } = data;
    const transaction = await this.coinsService.awardCoins(
      userId,
      amount,
      type,
      description,
      referenceId,
      referenceType,
    );
    return { success: true, transaction };
  }

  @Post('deduct')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deduct coins from user (Admin only)' })
  async deductCoins(@Body() data: DeductCoinsDto) {
    const { userId, amount, type, description, referenceId, referenceType } = data;
    const transaction = await this.coinsService.deductCoins(
      userId,
      amount,
      type,
      description,
      referenceId,
      referenceType,
    );
    return { success: true, transaction };
  }

  @Get('all-transactions')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions (Admin only)' })
  async getAllTransactions(@Query('limit') limit?: string) {
    const transactions = await this.coinsService.getAllTransactions(
      limit ? parseInt(limit) : 100,
    );
    return { transactions };
  }
}
