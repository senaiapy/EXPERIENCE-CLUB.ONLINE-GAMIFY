import { IsString, IsInt, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class DeductCoinsDto {
  @ApiProperty({ example: 'clhxyz123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 50, description: 'Amount of coins to deduct' })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.PURCHASE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Purchase of premium item' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'order123', required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ example: 'order', required: false })
  @IsString()
  @IsOptional()
  referenceType?: string;
}
