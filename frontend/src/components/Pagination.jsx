import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null

  const { page, totalPages } = meta

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-sage-200 bg-paper text-ink-muted transition-colors hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={14} strokeWidth={2} />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1]
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && (
              <span className="w-8 text-center text-sm text-ink-light">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-lg text-[13px] font-medium transition-colors ${
                p === page
                  ? 'bg-forest-600 text-white border border-forest-600'
                  : 'border border-sage-200 bg-paper text-ink-muted hover:bg-sage-100'
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
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-sage-200 bg-paper text-ink-muted transition-colors hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
