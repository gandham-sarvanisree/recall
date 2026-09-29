// NEWLY CONSTRUCTED: shapes mirror supabase/schema.sql and the Hindsight wrapper.
export type MemoryType = 'episodic' | 'semantic' | 'procedural';

export interface RecalledMemory {
  id: string;
  content: string;
  score: number;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  relationship_type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  contact_id: string | null;
  meeting_id: string | null;
  memory_type: MemoryType;
  content: string;
  context: Record<string, unknown>;
  importance_score: number;
  recorded_at: string;
}

export interface Commitment {
  id: string;
  user_id: string;
  contact_id: string | null;
  memory_id: string | null;
  title: string;
  description: string | null;
  owner: 'user' | 'contact';
  due_date: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}
