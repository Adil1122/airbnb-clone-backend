import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private _supabase: SupabaseClient | null = null;
  private readonly bucket = process.env.SUPABASE_BUCKET || 'airbnb-images';
  private readonly useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

  private get supabase(): SupabaseClient {
    if (!this._supabase) {
      this._supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
      );
    }
    return this._supabase;
  }

  async processUpload(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (this.useSupabase) {
      return this.uploadToSupabase(file);
    }
    return this.serveLocal(file);
  }

  private async uploadToSupabase(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    const buffer = fs.readFileSync(file.path);
    const remotePath = `uploads/${file.filename}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(remotePath, buffer, { contentType: file.mimetype, upsert: true });

    fs.unlinkSync(file.path);

    if (error) {
      this.logger.error('Supabase upload error:', error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(remotePath);
    return { url: data.publicUrl, filename: file.filename };
  }

  private serveLocal(file: Express.Multer.File): { url: string; filename: string } {
    const baseUrl = process.env.BACKEND_URL || `http://192.168.1.12:3001`;
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  async deleteFile(filename: string): Promise<{ success: boolean }> {
    if (this.useSupabase) {
      await this.supabase.storage.from(this.bucket).remove([`uploads/${filename}`]);
    } else {
      const filePath = path.join('./uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return { success: true };
  }
}
