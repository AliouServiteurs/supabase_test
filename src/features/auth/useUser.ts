// Hook React qui écoute les changements de session Supabase en temps réel
// Retourne l'utilisateur connecté (ou null) et l'état de chargement initial
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export function useUser() {
  // null = pas connecté, undefined = chargement en cours
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    // Récupère la session existante au montage (persistance après refresh)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // S'abonne aux événements auth : LOGIN, LOGOUT, TOKEN_REFRESHED...
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Nettoyage de l'abonnement au démontage du composant
    return () => listener.subscription.unsubscribe()
  }, [])

  // loading = true tant que la session n'a pas été vérifiée
  return { user, loading: user === undefined }
}