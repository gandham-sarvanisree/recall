-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
-- 1. Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 2. Contacts Table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  relationship_type TEXT DEFAULT 'professional',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 3. Meetings Table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  transcript TEXT,
  summary TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE
);
-- 4. Memories Table
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('episodic', 'semantic', 'procedural')),
  content TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  importance_score FLOAT DEFAULT 0.5,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 5. Commitments Table
CREATE TABLE public.commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  memory_id UUID REFERENCES public.memories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner TEXT NOT NULL CHECK (owner IN ('user', 'contact')),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 6. Conversations Table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 7. Insights Table
CREATE TABLE public.insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  confidence FLOAT DEFAULT 0.8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 8. Relationship Scores Table
CREATE TABLE public.relationship_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  trust_score FLOAT DEFAULT 50.0,
  engagement_score FLOAT DEFAULT 50.0,
  reciprocity_score FLOAT DEFAULT 50.0,
  overall_score FLOAT DEFAULT 50.0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- 9. Memory Embeddings Table
CREATE TABLE public.memory_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
-- Indexing for performance and vector searching
CREATE INDEX idx_memories_user_contact ON public.memories(user_id, contact_id);
CREATE INDEX idx_commitments_status ON public.commitments(status);
CREATE INDEX idx_memory_embeddings_vector ON public.memory_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_embeddings ENABLE ROW LEVEL SECURITY;
-- RLS Policies (User Specific Isolation)
CREATE POLICY "Users can manage their own profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage contacts" ON public.contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage meetings" ON public.meetings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage memories" ON public.memories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage commitments" ON public.commitments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage insights" ON public.insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage scores" ON public.relationship_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage embeddings" ON public.memory_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.memories WHERE memories.id = memory_embeddings.memory_id AND memories.user_id = auth.uid())
);
