import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private initialized = false;

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Firebase credentials not set — push notifications disabled');
      return;
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    }
    this.initialized = true;
    this.logger.log('Firebase Admin initialized');
  }

  async sendPush(token: string, title: string, body: string, data?: Record<string, string>): Promise<void> {
    if (!this.initialized || !token) return;
    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        data,
        android: { priority: 'high', notification: { sound: 'default' } },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      });
    } catch (err) {
      this.logger.warn(`FCM send failed for token ${token.slice(0, 20)}...: ${err.message}`);
    }
  }

  async sendMulticast(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<void> {
    if (!this.initialized || !tokens.length) return;
    try {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data,
        android: { priority: 'high', notification: { sound: 'default' } },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      });
    } catch (err) {
      this.logger.warn(`FCM multicast failed: ${err.message}`);
    }
  }
}
