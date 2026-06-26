import { useState } from 'react'
import { useBakers } from '../hooks/useBakers'
import Spinner from '../components/Spinner'
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react'

export default function ManageBakers() {
  const { bakers, loading, addBaker, updateBaker } = useBakers()
  const [newName, setNewName] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    await addBaker(newName.trim())
    setNewName('')
  }

  const toggleActive = (baker) => {
    updateBaker(baker.id, { active: !baker.active })
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bakers ({bakers.length})</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New baker name…"
          className="flex-1 px-3 py-2 rounded-lg border border-stone-light/50 focus:outline-none focus:ring-2 focus:ring-wheat"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-wheat text-charcoal font-semibold rounded-xl hover:bg-wheat-dark transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {bakers.length === 0 ? (
        <p className="text-stone text-center py-8">No bakers yet.</p>
      ) : (
        <div className="bg-white rounded-xl divide-y divide-warm-gray max-w-md">
          {bakers.map((baker) => (
            <div key={baker.id} className="flex items-center justify-between p-3">
              <span className={`font-medium ${baker.active ? 'text-charcoal' : 'text-stone line-through'}`}>
                {baker.name}
              </span>
              <button
                onClick={() => toggleActive(baker)}
                className={`flex items-center gap-1.5 text-sm cursor-pointer ${
                  baker.active ? 'text-green-600' : 'text-stone'
                }`}
                title={baker.active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
              >
                {baker.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                <span className="hidden sm:inline">{baker.active ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
