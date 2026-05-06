import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserSettings } from '../entities/user-settings.entity';

@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  async getSettings(@Req() req: any): Promise<UserSettings> {
    return await this.userSettingsService.findByUserId(req.user.id);
  }

  @Put()
  async updateSettings(@Req() req: any, @Body() updateData: Partial<UserSettings>): Promise<UserSettings> {
    return await this.userSettingsService.update(req.user.id, updateData);
  }
}
