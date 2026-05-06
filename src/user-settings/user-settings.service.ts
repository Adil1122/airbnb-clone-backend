import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from '../entities/user-settings.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: number): Promise<UserSettings> {
    let settings = await this.userSettingsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!settings) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      settings = this.userSettingsRepository.create({
        user: user,
        notificationPreferences: {
          offers: {
            recognition: true,
            insights: true,
            pricing: true,
            perks: true,
            news: true,
            laws: true,
            inspiration: true,
            planning: true,
            airbnbNews: true,
            feedback: true,
            regulations: true,
          },
          account: {
            activity: true,
            listing: true,
            guestPolicies: true,
            hostPolicies: true,
            reminders: true,
            messages: true,
          }
        }
      });
      await this.userSettingsRepository.save(settings);
    }

    return settings;
  }

  async update(userId: number, updateData: Partial<UserSettings>): Promise<UserSettings> {
    const settings = await this.findByUserId(userId);
    Object.assign(settings, updateData);
    return await this.userSettingsRepository.save(settings);
  }
}
