import { useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import Spinner from '../components/Spinner'

export default function CategoryGrid() {
  const { categories, loading } = useCategories()
  const navigate = useNavigate()

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {categories.length === 0 ? (
        <p className="text-stone text-center py-8">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/recipes/${cat.id}`)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-square cursor-pointer bg-warm-gray"
            >
              {cat.thumbnailUrl ? (
                <img
                  src={cat.thumbnailUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-wheat-light to-wheat flex items-center justify-center">
                  <span className="text-4xl">🍞</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-lg text-left">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
