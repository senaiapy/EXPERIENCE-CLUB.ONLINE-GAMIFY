import { IsString, IsInt, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class AwardCoinsDto {
  @ApiProperty({ example: 'clhxyz123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 100, description: 'Amount of coins to award' })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.ADMIN_BONUS })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Bonus for excellent participation' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'ref123', required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ example: 'promotion', required: false })
  @IsString()
  @IsOptional()
  referenceType?: string;
}
