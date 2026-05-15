import { NavLink } from 'react-router-dom'
import { BookOpen, Plus, Tag, Calendar } from 'lucide-react'

const navItems = [
  { to: '/planos', label: 'Meus Planos', icon: BookOpen, end: true },
  { to: '/planos/novo', label: 'Novo Plano', icon: Plus },
]

const secondaryItems = [
  { label: 'Disciplinas', icon: Tag },
  { label: 'Calendário', icon: Calendar },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-forest-900 flex flex-col z-50">
      <div
        className="relative h-44 flex-shrink-0 overflow-hidden"
        style={{ backgroundImage: "url('/images/biblioteca-abajures.jpg')", backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/50 to-forest-900/95" />
        <div className="absolute bottom-5 left-6">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-300/70">
            Lab de Pesquisa
          </span>
          <span className="block font-display text-[19px] font-semibold text-white leading-tight mt-1">
            Planos de Aula
          </span>
        </div>
      </div>

      <nav className="flex-1 py-5">
        <p className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-white/30">
          Menu
        </p>

        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-[10px] text-[13.5px] border-l-2 transition-colors ${
                isActive
                  ? 'border-amber text-white bg-white/[0.08]'
                  : 'border-transparent text-white/55 hover:text-white/85 hover:bg-white/[0.05]'
              }`
            }
          >
            <Icon size={15} strokeWidth={1.8} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        <p className="px-6 mt-5 mb-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-white/30">
          Organizar
        </p>

        {secondaryItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-6 py-[10px] text-[13.5px] text-white/45 border-l-2 border-transparent cursor-default"
          >
            <Icon size={15} strokeWidth={1.8} className="flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-forest-700 border border-white/15 flex items-center justify-center text-[12px] font-semibold text-white/80 flex-shrink-0">
            GG
          </div>
          <div>
            <p className="text-[13px] font-medium text-white/80 leading-tight">Geozedeque</p>
            <p className="text-[11px] text-white/35">Docente</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
