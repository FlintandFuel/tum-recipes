import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useImageUpload } from '../hooks/useImageUpload'
import Spinner from '../components/Spinner'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

export default function ManageCategories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const { upload, uploading } = useImageUpload()
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [order, setOrder] = useState(0)
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const openNew = () => {
    setName('')
    setOrder(categories.length)
    setThumbnailUrl('')
    setEditing('new')
  }

  const openEdit = (cat) => {
    setName(cat.name)
    setOrder(cat.order || 0)
    setThumbnailUrl(cat.thumbnailUrl || '')
    setEditing(cat.id)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    setThumbnailUrl(url)
  }

  const handleSave = async () => {
    const data = { name, order: Number(order), thumbnailUrl }
    if (editing === 'new') {
      await addCategory(data)
    } else {
      await updateCategory(editing, data)
    }
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Recipes in this category will become uncategorized.')) return
    await deleteCategory(id)
  }

  if (loading) return <Spinner />

  if (editing !== null) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editing === 'new' ? 'Add Category' : 'Edit Category'}
          </h2>
          <button onClick={() => setEditing(null)} className="text-stone hover:text-charcoal cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
            {uploading && <p className="text-xs text-stone mt-1">Uploading…</p>}
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="" className="mt-2 w-20 h-20 object-cover rounded-lg" />
            )}
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save size={18} />
            {editing === 'new' ? 'Add Category' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Categories ({categories.length})</h2>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-stone text-center py-8">No categories yet.</p>
      ) : (
        <div className="bg-white rounded-xl divide-y divide-warm-gray">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 p-3">
              {cat.thumbnailUrl ? (
                <img src={cat.thumbnailUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-wheat-light/50 flex items-center justify-center text-xl">🍞</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{cat.name}</h3>
                <p className="text-xs text-stone">Order: {cat.order}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-2 text-stone hover:text-charcoal rounded-lg hover:bg-warm-gray cursor-pointer">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer">
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
