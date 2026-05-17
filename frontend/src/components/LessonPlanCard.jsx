import { Link } from 'react-router-dom'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function LessonPlanCard({ plan, onDelete }) {
  return (
    <article className="grid gap-4 rounded-lg border border-sage-200 bg-paper p-4 shadow-sm shadow-black/[0.03] transition-colors hover:border-sage-300 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-denim-light px-2 py-1 text-[11px] font-semibold text-denim">
            {plan.discipline}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-ink-light">
            <Calendar size={12} strokeWidth={1.8} />
            {formatDate(plan.scheduledAt)}
          </span>
        </div>

        <h2 className="text-[17px] font-semibold leading-snug text-ink">
          {plan.title}
        </h2>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-ink-muted line-clamp-2">
          {plan.summary}
        </p>

        {plan.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {plan.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-sage-200 bg-surface px-2 py-1 text-[11.5px] font-medium text-ink-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:justify-end">
        <Link
          to={`/planos/${plan.id}/editar`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sage-100 hover:text-ink"
          aria-label={`Editar ${plan.title}`}
          title="Editar"
        >
          <Pencil size={15} strokeWidth={1.8} />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(plan)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-clay-light hover:text-clay"
          aria-label={`Remover ${plan.title}`}
          title="Remover"
        >
          <Trash2 size={15} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  )
}
