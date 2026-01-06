import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Language } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get settings (creates default if doesn't exist)
   */
  async getSettings() {
    let settings = await this.prisma.settings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          language: Language.SPANISH,
          siteName: 'Experience Club',
          currency: 'PYG',
          currencySymbol: '₲',
          exchangeRate: 7300,
        },
      });
    }

    return settings;
  }

  /**
   * Update settings
   */
  async updateSettings(updateSettingsDto: UpdateSettingsDto) {
    // Get current settings or create if doesn't exist
    let settings = await this.prisma.settings.findFirst();

    if (!settings) {
      // Create new settings with provided data
      settings = await this.prisma.settings.create({
        data: {
          language: Language.SPANISH,
          ...updateSettingsDto,
        },
      });
    } else {
      // Update existing settings
      settings = await this.prisma.settings.update({
        where: { id: settings.id },
        data: updateSettingsDto,
      });
    }

    return settings;
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings() {
    const settings = await this.prisma.settings.findFirst();

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        language: Language.SPANISH,
        siteName: 'Experience Club',
        siteDescription: null,
        contactEmail: null,
        contactPhone: null,
        supportEmail: null,
        facebookUrl: null,
        instagramUrl: null,
        whatsappNumber: null,
        taxRate: 0,
        currency: 'PYG',
        currencySymbol: '₲',
        exchangeRate: 7300,
        freeShippingThreshold: 0,
        defaultShippingCost: 0,
        smtpHost: null,
        smtpPort: null,
        smtpUser: null,
        smtpPassword: null,
        emailFromName: null,
        emailFromAddress: null,
        metaTitle: null,
        metaDescription: null,
        metaKeywords: null,
        enableCart: true,
        enableWishlist: true,
        enableReviews: false,
        enableCoupons: false,
        maintenanceMode: false,
        maintenanceMessage: null,
      },
    });
  }
}
