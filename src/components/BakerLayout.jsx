import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCircle } from 'lucide-react'

export default function BakerLayout({ baker, onChangeBaker }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-charcoal text-white px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-stone-light hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-sm hidden sm:inline">Back</span>
        </button>

        <h1 className="text-lg font-semibold tracking-tight">
          The Upper Millstone
        </h1>

        <button
          onClick={onChangeBaker}
          className="flex items-center gap-1.5 text-sm text-stone-light hover:text-white transition-colors cursor-pointer"
        >
          <UserCircle size={18} />
          <span className="hidden sm:inline">{baker?.name}</span>
        </button>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
