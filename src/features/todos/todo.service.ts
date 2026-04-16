// Service CRUD pour les todos — toute la logique métier, zéro UI
// Grâce au RLS, Supabase filtre automatiquement par user_id
import { supabase } from '../../lib/supabase'

// Type TypeScript pour une tâche
export type Todo = {
  id: string
  title: string
  is_done: boolean
  user_id: string
  created_at: string
}

// SELECT — Récupère toutes les tâches de l'utilisateur connecté
// Le RLS garantit que seules SES tâches sont retournées
export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// INSERT — Crée une nouvelle tâche
// user_id est obligatoire pour satisfaire la policy RLS INSERT
export async function createTodo(title: string, userId: string): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert({ title, user_id: userId, is_done: false })
    .select()
    .single()

  if (error) throw error
  return data
}

// UPDATE — Modifie le titre ou le statut d'une tâche
// .eq('id', id) cible la tâche, le RLS vérifie que c'est bien la sienne
export async function updateTodo(id: string, changes: Partial<Pick<Todo, 'title' | 'is_done'>>): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// DELETE — Supprime une tâche par son id
// Le RLS empêche de supprimer une tâche qui n'appartient pas à l'utilisateur
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) throw error
}