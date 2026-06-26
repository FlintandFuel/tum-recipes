import { useState } from 'react'
import { useBakers } from '../hooks/useBakers'
import Spinner from '../components/Spinner'
import { UserCircle, Check } from 'lucide-react'

export default function BakerSelect({ onSelect }) {
  const { bakers, loading } = useBakers(true)
  const [selected, setSelected] = useState(null)

  if (loading) return <Spinner />

  if (selected) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <UserCircle size={64} className="mx-auto text-wheat mb-4" />
          <h2 className="text-xl font-semibold mb-1">Is this you?</h2>
          <p className="text-2xl font-bold text-charcoal mb-6">{selected.name}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 py-3 rounded-xl border-2 border-stone-light text-stone font-medium text-lg hover:bg-warm-gray transition-colors cursor-pointer"
            >
              No, go back
            </button>
            <button
              onClick={() => onSelect(selected)}
              className="flex-1 py-3 rounded-xl bg-wheat text-charcoal font-semibold text-lg hover:bg-wheat-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={20} />
              Yes, this is me
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">The Upper Millstone</h1>
        <p className="text-stone text-center mb-8">Select your name to get started</p>

        {bakers.length === 0 ? (
          <p className="text-center text-stone">No bakers have been added yet.</p>
        ) : (
          <div className="grid gap-3">
            {bakers.map((baker) => (
              <button
                key={baker.id}
                onClick={() => setSelected(baker)}
                className="w-full py-4 px-6 bg-white rounded-xl shadow-sm text-lg font-medium text-charcoal hover:bg-wheat-light/30 hover:shadow-md transition-all text-left cursor-pointer"
              >
                {baker.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
