import { Link } from 'react-router-dom'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function LessonPlanCard({ plan, onDelete }) {
  return (
    <article className="bg-white border border-sage-200 rounded-xl shadow-sm shadow-forest-900/5 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:shadow-forest-900/8 transition-all duration-200">
      <div className="p-5 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-ink-muted mb-2">
          {plan.discipline}
        </p>
        <h2 className="font-display text-[16.5px] font-semibold text-ink leading-snug mb-2.5">
          {plan.title}
        </h2>
        <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-2 mb-4">
          {plan.summary}
        </p>

        {plan.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface border border-sage-200 text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3.5 border-t border-sage-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-ink-light">
          <Calendar size={12} strokeWidth={1.8} />
          {formatDate(plan.scheduledAt)}
        </div>
        <div className="flex gap-1">
          <Link
            to={`/planos/${plan.id}/editar`}
            className="w-7 h-7 rounded-md flex items-center justify-center text-ink-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <Pencil size={13} strokeWidth={1.8} />
          </Link>
          <button
            onClick={() => onDelete(plan)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  )
}
