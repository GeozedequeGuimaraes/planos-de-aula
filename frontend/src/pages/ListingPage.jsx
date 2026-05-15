import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import { lessonPlanApi } from '../services/api'
import LessonPlanCard from '../components/LessonPlanCard'
import Pagination from '../components/Pagination'

const DISCIPLINES = ['Todas as disciplinas', 'Algoritmos', 'Banco de Dados', 'Redes de Computadores', 'Sistemas Operacionais', 'Engenharia de Software']
const ORDER_OPTIONS = [
  { value: 'createdAt_desc', label: 'Mais recentes' },
  { value: 'createdAt_asc', label: 'Mais antigos' },
  { value: 'title_asc', label: 'Título A–Z' },
  { value: 'title_desc', label: 'Título Z–A' },
  { value: 'scheduledAt_asc', label: 'Data da aula' },
]

export default function ListingPage() {
  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [orderBy, setOrderBy] = useState('createdAt_desc')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const queryClient = useQueryClient()

  const [sortField, sortOrder] = orderBy.split('_')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['planos', { search, discipline, sortField, sortOrder, page }],
    queryFn: () =>
      lessonPlanApi.list({
        search,
        discipline: discipline || undefined,
        orderBy: sortField,
        order: sortOrder,
        page,
        limit: 9,
      }),
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => lessonPlanApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] })
      setDeleteTarget(null)
    },
  })

  const plans = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Hero */}
      <section
        className="relative rounded-xl overflow-hidden mb-8 min-h-[220px] flex items-end"
        style={{ backgroundImage: "url('/images/biblioteca-corredor.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/96 via-forest-900/75 to-forest-800/20" />
        <div className="relative p-8">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-300/80 mb-3">
            Área de planejamento
          </span>
          <h1 className="font-display text-4xl font-semibold text-white leading-tight">
            Meus Planos de Aula
          </h1>
          {meta && (
            <p className="mt-2 text-[14px] text-white/60">
              {meta.total} {meta.total === 1 ? 'plano cadastrado' : 'planos cadastrados'}
            </p>
          )}
        </div>
        <Link
          to="/planos/novo"
          className="absolute top-6 right-6 inline-flex items-center gap-2 bg-white text-forest-800 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-sage-100 transition-colors shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} />
          Novo Plano
        </Link>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-7">
        <div className="flex items-center gap-2 bg-white border border-sage-200 rounded-lg px-3.5 py-2 flex-1 min-w-[220px] max-w-xs shadow-sm shadow-forest-900/4">
          <Search size={14} strokeWidth={1.8} className="text-ink-light flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 text-[13.5px] text-ink placeholder-ink-light bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-sage-200 rounded-lg px-3 py-2 shadow-sm shadow-forest-900/4">
          <SlidersHorizontal size={13} className="text-ink-light" />
          <select
            value={discipline}
            onChange={(e) => { setDiscipline(e.target.value); setPage(1) }}
            className="text-[13px] text-ink bg-transparent outline-none cursor-pointer pr-1"
          >
            {DISCIPLINES.map((d) => (
              <option key={d} value={d === 'Todas as disciplinas' ? '' : d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white border border-sage-200 rounded-lg px-3 py-2 shadow-sm shadow-forest-900/4 ml-auto">
          <ArrowUpDown size={13} className="text-ink-light" />
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="text-[13px] text-ink bg-transparent outline-none cursor-pointer pr-1"
          >
            {ORDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-sage-200 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-ink-muted">
          <p className="text-[15px]">Não foi possível carregar os planos.</p>
          <p className="text-[13px] mt-1">Verifique se o servidor está rodando e tente novamente.</p>
        </div>
      )}

      {!isLoading && !isError && plans.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <img
            src="/images/estudante-livros.jpg"
            alt="Estudante com livros"
            className="w-32 h-44 object-cover object-top rounded-xl shadow-md mb-6"
          />
          <h3 className="font-display text-xl font-semibold text-ink mb-2">
            {search || discipline ? 'Nenhum resultado encontrado' : 'Nenhum plano por aqui ainda'}
          </h3>
          <p className="text-[13.5px] text-ink-muted max-w-xs leading-relaxed">
            {search || discipline
              ? 'Tente ajustar os filtros ou buscar por outro termo.'
              : 'Comece criando seu primeiro plano. Use o Smart Assist para sugestões de conteúdo.'}
          </p>
          {!search && !discipline && (
            <Link
              to="/planos/novo"
              className="mt-6 inline-flex items-center gap-2 bg-forest-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-forest-700 transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
              Criar primeiro plano
            </Link>
          )}
        </div>
      )}

      {!isLoading && !isError && plans.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
              <LessonPlanCard key={plan.id} plan={plan} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full mx-4 border border-sage-200">
            <h3 className="font-display text-[18px] font-semibold text-ink mb-2">Remover plano?</h3>
            <p className="text-[13.5px] text-ink-muted leading-relaxed mb-6">
              "<strong>{deleteTarget.title}</strong>" será removido permanentemente.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-[13px] font-medium text-ink-muted border border-sage-200 rounded-lg hover:bg-surface transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deleteMutation.isPending ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
