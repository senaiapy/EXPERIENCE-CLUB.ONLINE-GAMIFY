import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTaskDto {
  @ApiProperty({ example: true, description: 'Whether to approve or reject the task' })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({ example: 'Proof image is clear and valid', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
