// Composant UI qui affiche et gère les interactions avec la liste de tâches
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo } from './todo.service'

type Props = { user: User }

export function TodoList({ user }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Charge les tâches au montage du composant
  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    try {
      setLoading(true)
      const data = await getTodos()
      setTodos(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Ajoute une nouvelle tâche et met à jour l'état local sans recharger
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const todo = await createTodo(newTitle.trim(), user.id)
      setTodos([todo, ...todos])
      setNewTitle('')
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Bascule le statut is_done d'une tâche
  async function handleToggle(todo: Todo) {
    try {
      const updated = await updateTodo(todo.id, { is_done: !todo.is_done })
      setTodos(todos.map(t => t.id === todo.id ? updated : t))
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Sauvegarde le nouveau titre après édition inline
  async function handleEditSave(id: string) {
    if (!editTitle.trim()) return
    try {
      const updated = await updateTodo(id, { title: editTitle.trim() })
      setTodos(todos.map(t => t.id === id ? updated : t))
      setEditingId(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Supprime une tâche avec confirmation visuelle
  async function handleDelete(id: string) {
    try {
      await deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (loading) return <p className="text-center text-gray-400 mt-8">Chargement...</p>

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </form>

      {/* Liste vide */}
      {todos.length === 0 && (
        <p className="text-center text-gray-400">Aucune tâche — commencez par en créer une !</p>
      )}

      {/* Liste des tâches */}
      <ul className="space-y-3">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            {/* Checkbox pour marquer comme terminé */}
            <input
              type="checkbox"
              checked={todo.is_done}
              onChange={() => handleToggle(todo)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />

            {/* Mode édition inline ou affichage normal */}
            {editingId === todo.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={() => handleEditSave(todo.id)}
                onKeyDown={e => e.key === 'Enter' && handleEditSave(todo.id)}
                className="flex-1 border-b border-blue-400 outline-none px-1"
              />
            ) : (
              <span
                onClick={() => { setEditingId(todo.id); setEditTitle(todo.title) }}
                className={`flex-1 cursor-pointer ${todo.is_done ? 'line-through text-gray-400' : 'text-gray-800'}`}
              >
                {todo.title}
              </span>
            )}

            {/* Bouton suppression */}
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-400 hover:text-red-600 transition text-sm"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}