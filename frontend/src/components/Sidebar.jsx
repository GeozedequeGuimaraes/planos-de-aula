import { NavLink } from 'react-router-dom'
import { BookOpen, ClipboardList, Plus } from 'lucide-react'

const navItems = [
  { to: '/planos', label: 'Planos', icon: ClipboardList, end: true },
  { to: '/planos/novo', label: 'Criar', icon: Plus },
]

export default function Sidebar() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sage-200 bg-paper/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-800 text-white">
            <BookOpen size={17} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-light">Planos</p>
            <p className="text-[14px] font-semibold text-ink">Aulas e conteúdos</p>
          </div>
        </div>
        <NavLink
          to="/planos/novo"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-700 text-white"
          aria-label="Novo plano"
        >
          <Plus size={16} strokeWidth={2.2} />
        </NavLink>
      </header>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-sage-200 bg-paper lg:flex lg:flex-col">
        <div className="px-6 pb-7 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest-800 text-white shadow-sm">
              <BookOpen size={19} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-light">Planejamento</p>
              <h1 className="text-[17px] font-semibold leading-tight text-ink">Planos de Aula</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-light">
            Trabalho
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-800 text-white'
                    : 'text-ink-muted hover:bg-sage-100 hover:text-ink'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.9} />
              {label}
            </NavLink>
          ))}

          <div className="mt-7 overflow-hidden rounded-lg border border-sage-200 bg-surface">
            <img
              src="/images/biblioteca-planejamento.jpg"
              alt=""
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-[12px] font-semibold text-ink">Rotina de planejamento</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                Do tema da aula aos recursos de apoio, tudo em um fluxo só.
              </p>
            </div>
          </div>
        </nav>

        <div className="border-t border-sage-200 p-5">
          <p className="text-[12px] font-semibold text-ink">Geozedeque Guimarães</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
            Gestão de aulas com apoio pedagógico por IA.
          </p>
        </div>
      </aside>
    </>
  )
}
