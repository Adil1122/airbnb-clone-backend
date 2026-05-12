import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../entities/user.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';
import { EmailService } from '../email/email.service';

// Real Airbnb Superhost criteria (evaluated every quarter):
// - 10+ trips completed
// - Overall rating >= 4.8
// - Response rate >= 90%
// - Cancellation rate < 1%

@Injectable()
export class SuperhostService {
  private readonly logger = new Logger(SuperhostService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_QUARTER)
  async evaluateAllHosts() {
    this.logger.log('Running quarterly Superhost evaluation...');
    const hosts = await this.userRepo.find({ where: { role: 'HOST' } });

    for (const host of hosts) {
      await this.evaluateHost(host);
    }

    this.logger.log(`Evaluated ${hosts.length} hosts for Superhost status`);
  }

  async evaluateHost(user: User): Promise<{ isSuperhost: boolean; stats: any }> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const completedBookings = await this.bookingRepo.count({
      where: { hostId: user.id, status: BookingStatus.COMPLETED, createdAt: MoreThan(oneYearAgo) },
    });

    const allBookings = await this.bookingRepo.count({
      where: { hostId: user.id, createdAt: MoreThan(oneYearAgo) },
    });

    const cancelledByHost = await this.bookingRepo.count({
      where: { hostId: user.id, status: BookingStatus.CANCELLED, cancelledBy: user.id, createdAt: MoreThan(oneYearAgo) },
    });

    const reviews = await this.reviewRepo.find({
      where: { revieweeId: user.id },
    });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
      : 0;

    const cancellationRate = allBookings > 0 ? (cancelledByHost / allBookings) * 100 : 0;
    const meetsTrips = completedBookings >= 10;
    const meetsRating = avgRating >= 4.8;
    const meetsCancellation = cancellationRate < 1;

    const qualifies = meetsTrips && meetsRating && meetsCancellation;
    const wasAlready = user.isSuperhost;

    if (qualifies !== wasAlready) {
      user.isSuperhost = qualifies;
      await this.userRepo.save(user);

      if (qualifies && !wasAlready) {
        await this.emailService.sendSuperhostAchievement(user.email, user.name);
        this.logger.log(`${user.name} (${user.id}) earned Superhost status`);
      }
    }

    return {
      isSuperhost: qualifies,
      stats: { completedBookings, avgRating: Math.round(avgRating * 100) / 100, cancellationRate, meetsTrips, meetsRating, meetsCancellation },
    };
  }

  async getHostStats(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;
    return this.evaluateHost(user);
  }
}
