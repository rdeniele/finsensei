import { supabase } from '@/lib/supabase';

export interface LearningContent {
  id: string;
  title: string;
  description: string;
  url?: string;
  is_featured: boolean;
  status: 'active' | 'draft' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const learningContentService = {
  async getActiveContent() {
    const { data, error } = await supabase
      .from('learning_content')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LearningContent[];
  },

  async getFeaturedContent() {
    const { data, error } = await supabase
      .from('learning_content')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LearningContent[];
  },

  async createContent(content: Omit<LearningContent, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('learning_content')
      .insert([content])
      .select()
      .single();

    if (error) throw error;
    return data as LearningContent;
  },

  async updateContent(id: string, content: Partial<LearningContent>) {
    const { data, error } = await supabase
      .from('learning_content')
      .update(content)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as LearningContent;
  },

  async deleteContent(id: string) {
    const { error } = await supabase
      .from('learning_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 