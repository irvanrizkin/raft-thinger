import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { SupabaseSingleton } from '../services/SupabaseSingleton';

export class Controller {
  protected supabase: SupabaseClient<Database>;
  constructor() {
    this.supabase = SupabaseSingleton.getInstance().supabase;
  }
}
