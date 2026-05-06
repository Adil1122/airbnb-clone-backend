import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL or Key is missing in environment variables');
      return null;
    }

    this.clientInstance = createClient(supabaseUrl, supabaseKey);

    this.logger.log('Supabase client initialized');
    return this.clientInstance;
  }
}
