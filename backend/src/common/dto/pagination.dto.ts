import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  startItem: number;
  endItem: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export class PaginationResponse {
  @ApiPropertyOptional({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'Total number of items',
    example: 150,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Total number of pages',
    example: 8,
  })
  pages: number;

  @ApiPropertyOptional({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;

  @ApiPropertyOptional({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrev: boolean;

  @ApiPropertyOptional({
    description: 'Index of first item on current page',
    example: 1,
  })
  startItem: number;

  @ApiPropertyOptional({
    description: 'Index of last item on current page',
    example: 20,
  })
  endItem: number;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const pages = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    startItem,
    endItem,
  };
}