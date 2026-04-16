// Service d'authentification : inscription, connexion, déconnexion
// Aucune logique UI ici — uniquement les appels Supabase Auth
import { supabase } from '../../lib/supabase'

// Inscription avec email + mot de passe
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Connexion avec email + mot de passe
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Déconnexion : supprime la session locale et invalide le token
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}