import { IsString, IsInt, IsEnum, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Install Mobile App' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Download and install our mobile app from Play Store or App Store' })
  @IsString()
  description: string;

  @ApiProperty({ example: 50, description: 'Coin reward amount' })
  @IsInt()
  @Min(1)
  coinReward: number;

  @ApiProperty({ enum: TaskType, example: TaskType.EXTERNAL_ACTION })
  @IsEnum(TaskType)
  taskType: TaskType;

  @ApiProperty({ example: 24, description: 'Delay in hours before next task unlocks' })
  @IsInt()
  @Min(0)
  @Max(168) // Max 7 days
  delayHours: number;

  @ApiProperty({ example: 2, description: 'Order in task sequence' })
  @IsInt()
  @Min(1)
  orderIndex: number;

  @ApiProperty({ example: true, description: 'Whether task is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: true, description: 'Whether admin verification is required' })
  @IsBoolean()
  @IsOptional()
  verificationRequired?: boolean;

  @ApiProperty({ example: 'https://play.google.com/store/apps/...', required: false })
  @IsString()
  @IsOptional()
  externalUrl?: string;

  @ApiProperty({ example: 'Take a screenshot of the installed app', required: false })
  @IsString()
  @IsOptional()
  instructions?: string;
}
