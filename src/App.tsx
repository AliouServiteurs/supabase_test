// Routeur principal : redirige selon l'état de session de l'utilisateur
import { useUser } from './features/auth/useUser'
import { Login } from './pages/Login'
import { Home } from './pages/Home'

export default function App() {
  const { user, loading } = useUser()

  // Attend la vérification de session avant de rendre quoi que ce soit
  // Évite le flash d'affichage (page login → home) au refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Vérification de la session...
      </div>
    )
  }

  // Routage conditionnel : pas de react-router nécessaire pour ce cas simple
  // Si connecté → Home, sinon → Login
  return user ? <Home user={user} /> : <Login />
}