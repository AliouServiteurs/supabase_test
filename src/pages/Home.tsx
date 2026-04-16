// Page principale accessible uniquement aux utilisateurs connectés
import { signOut } from '../features/auth/auth.service'
import { TodoList } from '../features/todos/TodoList'
import type { User } from '@supabase/supabase-js'

type Props = { user: User }

export function Home({ user }: Props) {
  async function handleSignOut() {
    await signOut()
    // Le hook useUser détecte automatiquement la déconnexion → App.tsx redirige
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec info utilisateur et bouton déconnexion */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">📝 Mes Tâches</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Corps principal : liste des tâches */}
      <main className="py-8">
        <TodoList user={user} />
      </main>
    </div>
  )
}