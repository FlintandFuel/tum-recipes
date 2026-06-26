import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { BookOpen, Grid3X3, Users, ClipboardList, LogOut } from 'lucide-react'

const navItems = [
  { to: '/admin/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/admin/categories', label: 'Categories', icon: Grid3X3 },
  { to: '/admin/bakers', label: 'Bakers', icon: Users },
  { to: '/admin/access-log', label: 'Access Log', icon: ClipboardList },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-charcoal text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">
          The Upper Millstone — Admin
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-stone-light hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </header>

      <nav className="bg-warm-gray border-b border-stone-light/30 px-4 py-2 flex gap-1 overflow-x-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-wheat text-charcoal'
                  : 'text-stone hover:bg-wheat-light/40 hover:text-charcoal'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
