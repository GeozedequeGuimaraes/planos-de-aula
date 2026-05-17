import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, FilterX, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { lessonPlanApi } from '../services/api'
import LessonPlanCard from '../components/LessonPlanCard'
import Pagination from '../components/Pagination'

const DISCIPLINES = ['Todas as disciplinas', 'Algoritmos', 'Banco de Dados', 'Redes de Computadores', 'Sistemas Operacionais', 'Engenharia de Software']
const ORDER_OPTIONS = [
  { value: 'createdAt_desc', label: 'Mais recentes' },
  { value: 'createdAt_asc', label: 'Mais antigos' },
  { value: 'title_asc', label: 'Título A-Z' },
  { value: 'title_desc', label: 'Título Z-A' },
  { value: 'scheduledAt_asc', label: 'Data da aula' },
]

const controlClass =
  'h-10 rounded-lg border border-sage-200 bg-paper px-3 text-[13px] text-ink outline-none transition-colors focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10'

export default function ListingPage() {
  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [tags, setTags] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [orderBy, setOrderBy] = useState('createdAt_desc')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const queryClient = useQueryClient()

  const [sortField, sortOrder] = orderBy.split('_')
  const hasFilters = Boolean(search || discipline || tags || scheduledAt)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['planos', { search, discipline, tags, scheduledAt, sortField, sortOrder, page }],
    queryFn: () =>
      lessonPlanApi.list({
        search: search || undefined,
        discipline: discipline || undefined,
        tags: tags || undefined,
        scheduledAt: scheduledAt || undefined,
        orderBy: sortField,
        order: sortOrder,
        page,
        limit: 8,
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

  function resetFilters() {
    setSearch('')
    setDiscipline('')
    setTags('')
    setScheduledAt('')
    setPage(1)
  }

  const plans = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="mb-7 flex flex-col gap-5 border-b border-sage-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-forest-700">
            Acervo pedagógico
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
            Planos de aula
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
            Organize aulas por disciplina, data e tags. O assistente ajuda a completar conteúdos sem tirar sua autoria do planejamento.
          </p>
        </div>

        <Link
          to="/planos/novo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-forest-800 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-forest-700"
        >
          <Plus size={15} strokeWidth={2.4} />
          Novo plano
        </Link>
      </header>

      <section className="mb-6 rounded-lg border border-sage-200 bg-paper p-4 shadow-sm shadow-black/[0.03]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-forest-700" />
            <h2 className="text-[14px] font-semibold text-ink">Consulta</h2>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:bg-sage-100 hover:text-ink"
            >
              <FilterX size={13} />
              Limpar
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(220px,1.4fr)_minmax(170px,0.9fr)_minmax(150px,0.8fr)_minmax(145px,0.7fr)_minmax(160px,0.8fr)]">
          <label className="relative block">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Buscar por título"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={`${controlClass} w-full pl-9`}
            />
          </label>

          <select
            value={discipline}
            onChange={(e) => { setDiscipline(e.target.value); setPage(1) }}
            className={`${controlClass} w-full`}
          >
            {DISCIPLINES.map((d) => (
              <option key={d} value={d === 'Todas as disciplinas' ? '' : d}>{d}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tags: redes, ospf"
            value={tags}
            onChange={(e) => { setTags(e.target.value); setPage(1) }}
            className={`${controlClass} w-full`}
          />

          <label className="relative block">
            <CalendarDays size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="date"
              value={scheduledAt}
              onChange={(e) => { setScheduledAt(e.target.value); setPage(1) }}
              className={`${controlClass} w-full pl-9`}
            />
          </label>

          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className={`${controlClass} w-full`}
          >
            {ORDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          {meta
            ? `${meta.total} ${meta.total === 1 ? 'plano encontrado' : 'planos encontrados'}`
            : isError ? 'Falha ao carregar planos' : 'Carregando planos'}
        </p>
        <p className="hidden text-[12px] text-ink-light sm:block">
          Ordene por título, criação ou data prevista
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg border border-sage-200 bg-paper animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-clay/30 bg-clay-light px-4 py-5 text-[14px] text-clay">
          Não foi possível carregar os planos. Verifique se o backend está rodando e tente novamente.
        </div>
      )}

      {!isLoading && !isError && plans.length === 0 && (
        <div className="rounded-lg border border-dashed border-sage-300 bg-paper px-6 py-14 text-center">
          <h3 className="text-lg font-semibold text-ink">
            {hasFilters ? 'Nenhum plano corresponde aos filtros' : 'Nenhum plano cadastrado ainda'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-muted">
            {hasFilters
              ? 'Ajuste a busca, limpe os filtros ou experimente consultar por outra disciplina.'
              : 'Crie o primeiro plano e use o assistente pedagógico para sugerir conteúdos, recursos e tags.'}
          </p>
          {!hasFilters && (
            <Link
              to="/planos/novo"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-forest-800 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-forest-700"
            >
              <Plus size={15} strokeWidth={2.4} />
              Criar plano
            </Link>
          )}
        </div>
      )}

      {!isLoading && !isError && plans.length > 0 && (
        <>
          <div className="space-y-3">
            {plans.map((plan) => (
              <LessonPlanCard key={plan.id} plan={plan} onDelete={setDeleteTarget} />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-sage-200 bg-paper p-6 shadow-2xl">
            <h3 className="text-[18px] font-semibold text-ink">Remover plano?</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
              "{deleteTarget.title}" será removido permanentemente.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="h-10 rounded-lg border border-sage-200 px-4 text-[13px] font-medium text-ink-muted transition-colors hover:bg-sage-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="h-10 rounded-lg bg-clay px-4 text-[13px] font-semibold text-white transition-colors hover:bg-clay/90 disabled:opacity-60"
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
