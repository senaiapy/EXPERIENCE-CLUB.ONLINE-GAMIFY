import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return this.configService.get<string>('APP_VERSION_STRING') || 'Version 1.0.1-Experience Club!';
  }
}
