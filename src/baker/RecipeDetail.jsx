import { useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAccessLog } from '../hooks/useAccessLog'
import Spinner from '../components/Spinner'
import { X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function RecipeDetail({ baker }) {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const { logOpen, logClose } = useAccessLog()
  const logIdRef = useRef(null)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onSnapshot(doc(db, 'recipes', recipeId), (snap) => {
      if (snap.exists()) {
        setRecipe({ id: snap.id, ...snap.data() })
      }
      setLoading(false)
    })
  }, [recipeId])

  useEffect(() => {
    if (!recipe || !baker) return

    logOpen(baker.id, baker.name, recipe.id, recipe.name).then((docRef) => {
      logIdRef.current = docRef.id
    })

    return () => {
      if (logIdRef.current) {
        logClose(logIdRef.current)
      }
    }
  }, [recipe?.id, baker?.id])

  const handleClose = useCallback(() => {
    if (logIdRef.current) {
      logClose(logIdRef.current)
      logIdRef.current = null
    }
    navigate(-1)
  }, [logClose, navigate])

  if (loading) return <Spinner />
  if (!recipe) return <p className="text-center text-stone py-8">Recipe not found.</p>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{recipe.name}</h2>
        <button
          onClick={handleClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/80 transition-colors cursor-pointer"
        >
          <X size={18} />
          Close recipe
        </button>
      </div>

      {recipe.thumbnailUrl && (
        <img
          src={recipe.thumbnailUrl}
          alt={recipe.name}
          className="w-full h-48 md:h-64 object-cover rounded-xl mb-6"
        />
      )}

      <div className="grid gap-6">
        {recipe.yield && (
          <div className="bg-wheat-light/30 rounded-xl px-4 py-3">
            <span className="font-semibold">Yield:</span> {recipe.yield}
          </div>
        )}

        {recipe.allergens?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="font-semibold text-red-700">Allergens</span>
            </div>
            <p className="text-red-600">{recipe.allergens.join(', ')}</p>
          </div>
        )}

        {recipe.ingredients?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="bg-white rounded-xl p-4 space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-wheat mt-2 flex-shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.steps?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Method</h3>
            <ol className="bg-white rounded-xl p-4 space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-wheat text-charcoal font-semibold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {recipe.notes && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <div className="bg-white rounded-xl p-4 text-stone">
              {recipe.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
