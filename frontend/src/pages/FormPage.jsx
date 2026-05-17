import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Sparkles, Loader2, X, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { lessonPlanApi } from '../services/api'

function TagInput({ value, onChange }) {
  const [input, setInput] = useState('')

  function addTag(tag) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, '-')
    if (clean && !value.includes(clean)) onChange([...value, clean])
    setInput('')
  }

  function removeTag(tag) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-sage-200 bg-paper p-2.5 transition-all focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/10">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1.5 rounded-md bg-sage-100 px-2.5 py-1 text-[12px] font-medium text-forest-800">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="opacity-60 hover:opacity-100">
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault()
            addTag(input)
          }
          if (e.key === 'Backspace' && !input && value.length) {
            removeTag(value[value.length - 1])
          }
        }}
        placeholder={value.length === 0 ? 'Adicionar tag (Enter para confirmar)' : ''}
        className="min-w-[120px] flex-1 bg-transparent text-[13px] text-ink outline-none placeholder-ink-light"
      />
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-amber">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-sage-200 bg-paper px-3.5 py-2.5 text-[13.5px] text-ink placeholder-ink-light outline-none transition-all focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10'

const empty = { title: '', objective: '', summary: '', scheduledAt: '', discipline: '', contents: '', resources: '', tags: [] }

function normalizePlan(plan) {
  return {
    ...empty,
    ...plan,
    scheduledAt: plan?.scheduledAt?.split('T')[0] ?? '',
    tags: plan?.tags ?? [],
  }
}

export default function FormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)

  const { data: existing, isLoading, isError } = useQuery({
    queryKey: ['plano', id],
    queryFn: () => lessonPlanApi.get(id),
    enabled: isEditing,
  })

  if (isEditing && isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-sage-100" />
        <div className="mb-8 h-8 w-64 animate-pulse rounded bg-sage-100" />
        <div className="space-y-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-sage-100" />
          ))}
        </div>
      </div>
    )
  }

  if (isEditing && isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/planos"
          className="mb-7 inline-flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Voltar para planos
        </Link>
        <p className="text-[14px] text-clay">Não foi possível carregar este plano.</p>
      </div>
    )
  }

  return <LessonPlanForm key={id ?? 'new'} id={id} initialForm={isEditing ? normalizePlan(existing) : empty} />
}

function LessonPlanForm({ id, initialForm }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [assistStatus, setAssistStatus] = useState(null)
  const [assistError, setAssistError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const saveMutation = useMutation({
    mutationFn: (data) =>
      isEditing ? lessonPlanApi.update(id, data) : lessonPlanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] })
      navigate('/planos')
    },
  })

  async function handleAssist() {
    if (!form.title || !form.discipline || !form.summary) {
      setAssistError('Preencha o título, a disciplina e a ementa antes de gerar recomendações.')
      return
    }
    setAssistError('')
    setAssistStatus('loading')
    try {
      const result = await lessonPlanApi.smartAssist({
        title: form.title,
        discipline: form.discipline,
        summary: form.summary,
      })
      setForm((f) => ({
        ...f,
        contents: result.contents || f.contents,
        resources: result.resources || f.resources,
        tags: result.tags?.length ? result.tags : f.tags,
      }))
      setAssistStatus('done')
    } catch {
      setAssistStatus('error')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    saveMutation.mutate({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link
        to="/planos"
        className="mb-7 inline-flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Voltar para planos
      </Link>

      <div className="mb-7 border-b border-sage-200 pb-6">
        <span className="border-l-2 border-forest-600 pl-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-700">
          {isEditing ? 'Edição' : 'Novo plano'}
        </span>
        <h1 className="mt-3 text-[28px] font-semibold leading-tight text-ink">
          {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
          Preencha os campos principais e use o assistente apenas onde ele ajudar de verdade.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-sage-200 bg-paper p-5 shadow-sm shadow-black/[0.03] sm:p-6">
        <Field label="Título da Aula" required>
          <input className={inputClass} placeholder="Ex: Introdução ao Protocolo OSPF" value={form.title} onChange={set('title')} required />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Disciplina" required>
            <input className={inputClass} placeholder="Ex: Redes de Computadores" value={form.discipline} onChange={set('discipline')} required />
          </Field>
          <Field label="Data Prevista" required>
            <input className={inputClass} type="date" value={form.scheduledAt} onChange={set('scheduledAt')} required />
          </Field>
        </div>

        <Field label="Objetivo" required>
          <textarea className={`${inputClass} resize-y min-h-[88px]`} placeholder="Descreva o objetivo de aprendizagem desta aula..." value={form.objective} onChange={set('objective')} required />
        </Field>

        <Field label="Ementa / Resumo" required>
          <textarea className={`${inputClass} resize-y min-h-[88px]`} placeholder="Resumo do conteúdo a ser abordado na aula..." value={form.summary} onChange={set('summary')} required />
        </Field>

        {/* Smart Assist */}
        <div className="flex flex-col gap-4 rounded-lg border border-amber/25 bg-amber-light p-4 sm:flex-row sm:items-start">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber">
            <Sparkles size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-ink">Assistente pedagógico</h3>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">
              Com título, disciplina e ementa preenchidos, ele sugere conteúdos, recursos e tags.
            </p>
            {assistError && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-amber">
                <AlertCircle size={13} /> {assistError}
              </p>
            )}
            {assistStatus === 'done' && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-forest-700">
                <CheckCircle2 size={13} /> Campos preenchidos com sucesso!
              </p>
            )}
            {assistStatus === 'error' && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-clay">
                <AlertCircle size={13} /> Falha ao gerar recomendações. Tente novamente.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAssist}
            disabled={assistStatus === 'loading'}
            className="flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-amber-hover disabled:opacity-70"
          >
            {assistStatus === 'loading' ? (
              <><Loader2 size={14} className="animate-spin" /> Gerando...</>
            ) : (
              <><Sparkles size={14} strokeWidth={2} /> Gerar Recomendações</>
            )}
          </button>
        </div>

        <Field label="Conteúdos" required>
          <textarea className={`${inputClass} resize-y min-h-[120px]`} placeholder="Liste os conteúdos e tópicos que serão abordados..." value={form.contents} onChange={set('contents')} required />
        </Field>

        <Field label="Recursos de Apoio">
          <textarea className={`${inputClass} resize-y min-h-[88px]`} placeholder="Livros, artigos, vídeos, links e ferramentas..." value={form.resources} onChange={set('resources')} />
        </Field>

        <Field label="Tags">
          <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        </Field>

        {saveMutation.isError && (
          <p className="flex items-center gap-1.5 text-[13px] text-clay">
            <AlertCircle size={14} /> Erro ao salvar. Verifique os campos e tente novamente.
          </p>
        )}

        <div className="mt-2 flex items-center justify-end gap-3 border-t border-sage-200 pt-4">
          <Link
            to="/planos"
            className="rounded-lg border border-sage-200 px-5 py-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-sage-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-forest-800 px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-forest-700 disabled:opacity-60"
          >
            {saveMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" /> Salvando...</>
            ) : (
              <><Plus size={14} strokeWidth={2.5} /> {isEditing ? 'Salvar alterações' : 'Criar Plano'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
