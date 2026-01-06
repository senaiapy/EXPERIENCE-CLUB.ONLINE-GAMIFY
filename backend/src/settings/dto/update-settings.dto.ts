import { IsString, IsNumber, IsBoolean, IsEmail, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    description: 'Site language',
    enum: Language,
    example: 'SPANISH',
  })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({
    description: 'Site name',
    example: 'Experience Club',
  })
  @IsOptional()
  @IsString()
  siteName?: string;

  @ApiPropertyOptional({
    description: 'Site description',
    example: 'Tu tienda online de confianza',
  })
  @IsOptional()
  @IsString()
  siteDescription?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'contacto@experienceclub.com',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact phone',
    example: '+595 21 123 4567',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Support email',
    example: 'soporte@experienceclub.com',
  })
  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @ApiPropertyOptional({
    description: 'Facebook URL',
    example: 'https://facebook.com/experienceclub',
  })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiPropertyOptional({
    description: 'Instagram URL',
    example: 'https://instagram.com/experienceclub',
  })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiPropertyOptional({
    description: 'WhatsApp number',
    example: '595991474601',
  })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiPropertyOptional({
    description: 'Tax rate (percentage)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'PYG',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Currency symbol',
    example: '₲',
  })
  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @ApiPropertyOptional({
    description: 'Exchange rate (USD to local currency)',
    example: 7300,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Free shipping threshold',
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  freeShippingThreshold?: number;

  @ApiPropertyOptional({
    description: 'Default shipping cost',
    example: 50000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultShippingCost?: number;

  @ApiPropertyOptional({
    description: 'SMTP host',
    example: 'smtp.gmail.com',
  })
  @IsOptional()
  @IsString()
  smtpHost?: string;

  @ApiPropertyOptional({
    description: 'SMTP port',
    example: 587,
  })
  @IsOptional()
  @IsNumber()
  smtpPort?: number;

  @ApiPropertyOptional({
    description: 'SMTP user',
    example: 'noreply@experienceclub.com',
  })
  @IsOptional()
  @IsString()
  smtpUser?: string;

  @ApiPropertyOptional({
    description: 'SMTP password',
  })
  @IsOptional()
  @IsString()
  smtpPassword?: string;

  @ApiPropertyOptional({
    description: 'Email from name',
    example: 'Experience Club',
  })
  @IsOptional()
  @IsString()
  emailFromName?: string;

  @ApiPropertyOptional({
    description: 'Email from address',
    example: 'noreply@experienceclub.com',
  })
  @IsOptional()
  @IsEmail()
  emailFromAddress?: string;

  @ApiPropertyOptional({
    description: 'Meta title for SEO',
    example: 'Experience Club - Tu tienda online',
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    example: 'Encuentra las mejores ofertas en productos de calidad',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({
    description: 'Meta keywords for SEO',
    example: 'ofertas, descuentos, tienda online, Paraguay',
  })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Enable shopping cart',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableCart?: boolean;

  @ApiPropertyOptional({
    description: 'Enable wishlist',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableWishlist?: boolean;

  @ApiPropertyOptional({
    description: 'Enable product reviews',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enableReviews?: boolean;

  @ApiPropertyOptional({
    description: 'Enable discount coupons',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enableCoupons?: boolean;

  @ApiPropertyOptional({
    description: 'Maintenance mode enabled',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @ApiPropertyOptional({
    description: 'Maintenance mode message',
    example: 'Sitio en mantenimiento. Volvemos pronto.',
  })
  @IsOptional()
  @IsString()
  maintenanceMessage?: string;
}
