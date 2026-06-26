import { useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { useCategories } from '../hooks/useCategories'
import { useImageUpload } from '../hooks/useImageUpload'
import Spinner from '../components/Spinner'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

const emptyRecipe = {
  name: '',
  categoryId: '',
  thumbnailUrl: '',
  ingredients: [''],
  steps: [''],
  notes: '',
  yield: '',
  allergens: [''],
}

export default function ManageRecipes() {
  const { recipes, loading, addRecipe, updateRecipe, deleteRecipe } = useRecipes()
  const { categories } = useCategories()
  const { upload, uploading } = useImageUpload()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyRecipe)

  const openNew = () => {
    setForm(emptyRecipe)
    setEditing('new')
  }

  const openEdit = (recipe) => {
    setForm({
      name: recipe.name || '',
      categoryId: recipe.categoryId || '',
      thumbnailUrl: recipe.thumbnailUrl || '',
      ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
      steps: recipe.steps?.length ? recipe.steps : [''],
      notes: recipe.notes || '',
      yield: recipe.yield || '',
      allergens: recipe.allergens?.length ? recipe.allergens : [''],
    })
    setEditing(recipe.id)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file, `recipes/${Date.now()}_${file.name}`)
    setForm((f) => ({ ...f, thumbnailUrl: url }))
  }

  const updateList = (field, index, value) => {
    setForm((f) => {
      const list = [...f[field]]
      list[index] = value
      return { ...f, [field]: list }
    })
  }

  const addListItem = (field) => {
    setForm((f) => ({ ...f, [field]: [...f[field], ''] }))
  }

  const removeListItem = (field, index) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    const data = {
      ...form,
      ingredients: form.ingredients.filter(Boolean),
      steps: form.steps.filter(Boolean),
      allergens: form.allergens.filter(Boolean),
    }
    if (editing === 'new') {
      await addRecipe(data)
    } else {
      await updateRecipe(editing, data)
    }
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return
    await deleteRecipe(id)
  }

  if (loading) return <Spinner />

  if (editing !== null) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editing === 'new' ? 'Add Recipe' : 'Edit Recipe'}
          </h2>
          <button onClick={() => setEditing(null)} className="text-stone hover:text-charcoal cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Yield</label>
              <input
                value={form.yield}
                onChange={(e) => setForm((f) => ({ ...f, yield: e.target.value }))}
                placeholder="e.g. 12 rolls"
                className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
              {uploading && <p className="text-xs text-stone mt-1">Uploading…</p>}
              {form.thumbnailUrl && (
                <img src={form.thumbnailUrl} alt="" className="mt-2 w-20 h-20 object-cover rounded-lg" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ingredients</label>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={ing}
                  onChange={(e) => updateList('ingredients', i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
                />
                {form.ingredients.length > 1 && (
                  <button onClick={() => removeListItem('ingredients', i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addListItem('ingredients')} className="text-sm text-wheat-dark hover:text-wheat font-medium cursor-pointer">
              + Add ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Method Steps</label>
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-sm text-stone mt-2 w-6">{i + 1}.</span>
                <textarea
                  value={step}
                  onChange={(e) => updateList('steps', i, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
                />
                {form.steps.length > 1 && (
                  <button onClick={() => removeListItem('steps', i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addListItem('steps')} className="text-sm text-wheat-dark hover:text-wheat font-medium cursor-pointer">
              + Add step
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Allergens</label>
            {form.allergens.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={a}
                  onChange={(e) => updateList('allergens', i, e.target.value)}
                  placeholder={`Allergen ${i + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
                />
                {form.allergens.length > 1 && (
                  <button onClick={() => removeListItem('allergens', i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addListItem('allergens')} className="text-sm text-wheat-dark hover:text-wheat font-medium cursor-pointer">
              + Add allergen
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save size={18} />
            {editing === 'new' ? 'Add Recipe' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recipes ({recipes.length})</h2>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="text-stone text-center py-8">No recipes yet. Add your first one!</p>
      ) : (
        <div className="bg-white rounded-xl divide-y divide-warm-gray">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex items-center gap-4 p-3">
              {recipe.thumbnailUrl ? (
                <img src={recipe.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-wheat-light/50 flex items-center justify-center text-xl">📖</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{recipe.name}</h3>
                <p className="text-xs text-stone">
                  {categories.find((c) => c.id === recipe.categoryId)?.name || 'Uncategorized'}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(recipe)} className="p-2 text-stone hover:text-charcoal rounded-lg hover:bg-warm-gray cursor-pointer">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(recipe.id)} className="p-2 text-stone hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
