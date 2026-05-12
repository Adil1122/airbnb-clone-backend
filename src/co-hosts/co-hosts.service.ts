import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoHost, CoHostStatus } from '../entities/co-host.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CoHostsService {
  constructor(
    @InjectRepository(CoHost) private coHostRepo: Repository<CoHost>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async invite(hostId: number, propertyId: number, coHostEmail: string, permissions: string[], message?: string) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.hostId !== hostId) throw new ForbiddenException('Not your property');

    const coHostUser = await this.userRepo.findOne({ where: { email: coHostEmail } });
    if (!coHostUser) throw new NotFoundException('User not found with that email');

    const existing = await this.coHostRepo.findOne({ where: { propertyId, coHostId: coHostUser.id } });
    if (existing) throw new ConflictException('Co-host invitation already sent');

    const coHost = this.coHostRepo.create({ propertyId, hostId, coHostId: coHostUser.id, permissions, message });
    const saved = await this.coHostRepo.save(coHost);

    await this.notificationsService.push(
      coHostUser.id, 'co_host_invitation', 'Co-host Invitation',
      `You have been invited to co-host a property`, { propertyId: propertyId.toString() },
    );

    return saved;
  }

  async respondToInvitation(coHostId: number, invitationId: number, accept: boolean) {
    const coHost = await this.coHostRepo.findOne({ where: { id: invitationId, coHostId } });
    if (!coHost) throw new NotFoundException('Invitation not found');

    coHost.status = accept ? CoHostStatus.ACCEPTED : CoHostStatus.DECLINED;
    return this.coHostRepo.save(coHost);
  }

  async getPropertyCoHosts(propertyId: number, hostId: number) {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.hostId !== hostId) throw new ForbiddenException('Not your property');

    return this.coHostRepo.find({
      where: { propertyId, status: CoHostStatus.ACCEPTED },
      relations: ['coHost'],
    });
  }

  async getMyInvitations(userId: number) {
    return this.coHostRepo.find({
      where: { coHostId: userId, status: CoHostStatus.PENDING },
      relations: ['property'],
    });
  }

  async getMyCoHostProperties(userId: number) {
    return this.coHostRepo.find({
      where: { coHostId: userId, status: CoHostStatus.ACCEPTED },
      relations: ['property'],
    });
  }

  async remove(hostId: number, coHostId: number, propertyId: number) {
    const coHost = await this.coHostRepo.findOne({ where: { propertyId, coHostId, hostId } });
    if (!coHost) throw new NotFoundException('Co-host not found');
    await this.coHostRepo.remove(coHost);
    return { success: true };
  }
}
