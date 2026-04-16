-- Création de la table todos
CREATE TABLE todos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  is_done    BOOLEAN DEFAULT FALSE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activation du Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy SELECT : l'utilisateur ne voit QUE ses tâches
CREATE POLICY "select_own_todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- Policy INSERT : user_id doit correspondre à l'utilisateur connecté
CREATE POLICY "insert_own_todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy UPDATE : uniquement ses propres tâches
CREATE POLICY "update_own_todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy DELETE : uniquement ses propres tâches
CREATE POLICY "delete_own_todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);