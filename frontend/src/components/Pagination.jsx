import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null

  const { page, totalPages } = meta

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 rounded-lg border border-sage-200 bg-white flex items-center justify-center text-ink-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} strokeWidth={2} />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1]
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && (
              <span className="w-8 text-center text-ink-light text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                p === page
                  ? 'bg-forest-600 text-white border border-forest-600'
                  : 'border border-sage-200 bg-white text-ink-muted hover:bg-surface'
              }`}
            >
              {p}
            </button>
          </span>
        )
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-lg border border-sage-200 bg-white flex items-center justify-center text-ink-muted hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
