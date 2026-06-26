import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { useCategories } from '../hooks/useCategories'
import Spinner from '../components/Spinner'

export default function RecipeList() {
  const { categoryId } = useParams()
  const { recipes, loading } = useRecipes(categoryId)
  const { categories } = useCategories()
  const navigate = useNavigate()

  const category = categories.find((c) => c.id === categoryId)

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{category?.name || 'Recipes'}</h2>

      {recipes.length === 0 ? (
        <p className="text-stone text-center py-8">No recipes in this category yet.</p>
      ) : (
        <div className="grid gap-3">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left w-full cursor-pointer"
            >
              {recipe.thumbnailUrl ? (
                <img
                  src={recipe.thumbnailUrl}
                  alt={recipe.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-wheat-light/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📖</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-charcoal">{recipe.name}</h3>
                {recipe.yield && (
                  <p className="text-sm text-stone">Yield: {recipe.yield}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
