import { Database } from '../types/supabase';
import { supabase } from './supabase';

export const database = {
  goals: {
    async get(userId: string) {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Database['public']['Tables']['goals']['Row'][];
    },

    async create(goal: Database['public']['Tables']['goals']['Insert']) {
      const { data, error } = await supabase
        .from('goals')
        .insert(goal)
        .select()
        .single();
      
      if (error) throw error;
      return data as Database['public']['Tables']['goals']['Row'];
    },

    async update(id: string, updates: Database['public']['Tables']['goals']['Update']) {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Database['public']['Tables']['goals']['Row'];
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  settings: {
    async get(userId: string) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data as Database['public']['Tables']['settings']['Row'];
    },

    async update(userId: string, updates: Database['public']['Tables']['settings']['Update']) {
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Database['public']['Tables']['settings']['Row'];
    }
  }
}; 