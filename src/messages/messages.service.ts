import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message, MessageType } from '../entities/message.entity';
import { CreateConversationDto, SendMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async getConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.guest', 'guest')
      .leftJoinAndSelect('c.host', 'host')
      .leftJoinAndSelect('c.listing', 'listing')
      .leftJoinAndSelect('listing.images', 'images')
      .where('c.guestId = :userId OR c.hostId = :userId', { userId })
      .orderBy('c.lastMessageAt', 'DESC')
      .getMany();
  }

  async getMessages(conversationId: number, userId: number): Promise<Message[]> {
    const conversation = await this.findAccessible(conversationId, userId);
    await this.markAsRead(conversationId, userId);
    return this.messageRepo.find({
      where: { conversationId: conversation.id },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async createConversation(guestId: number, dto: CreateConversationDto): Promise<Conversation> {
    // Reuse existing conversation if it already exists
    let conversation = await this.conversationRepo.findOne({
      where: { listingId: dto.listingId, guestId, hostId: dto.hostId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        listingId: dto.listingId,
        guestId,
        hostId: dto.hostId,
        bookingId: dto.bookingId,
        lastMessageAt: new Date(),
      });
      conversation = await this.conversationRepo.save(conversation);
    }

    await this.sendMessage(conversation.id, guestId, { body: dto.initialMessage });
    return this.conversationRepo.findOne({
      where: { id: conversation.id },
      relations: ['guest', 'host', 'listing', 'listing.images'],
    }) as Promise<Conversation>;
  }

  async sendMessage(conversationId: number, senderId: number, dto: SendMessageDto): Promise<Message> {
    const conversation = await this.findAccessible(conversationId, senderId);
    const message = this.messageRepo.create({
      conversationId,
      senderId,
      body: dto.body,
      type: dto.type ?? MessageType.TEXT,
    });
    const saved = await this.messageRepo.save(message);
    await this.conversationRepo.update(conversation.id, { lastMessageAt: new Date() });
    return saved;
  }

  async markAsRead(conversationId: number, userId: number): Promise<void> {
    await this.messageRepo
      .createQueryBuilder()
      .update()
      .set({ isRead: true, readAt: new Date() })
      .where('conversationId = :conversationId AND senderId != :userId AND isRead = false', {
        conversationId,
        userId,
      })
      .execute();
  }

  async getUnreadCount(userId: number): Promise<number> {
    const conversations = await this.conversationRepo.find({
      where: [{ guestId: userId }, { hostId: userId }],
    });
    const ids = conversations.map((c) => c.id);
    if (ids.length === 0) return 0;
    return this.messageRepo
      .createQueryBuilder('m')
      .where('m.conversationId IN (:...ids)', { ids })
      .andWhere('m.senderId != :userId', { userId })
      .andWhere('m.isRead = false')
      .getCount();
  }

  private async findAccessible(conversationId: number, userId: number): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.guestId !== userId && conversation.hostId !== userId) {
      throw new ForbiddenException('Not authorized to access this conversation');
    }
    return conversation;
  }
}
