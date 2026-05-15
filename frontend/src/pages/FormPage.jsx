import { useState, useEffect } from 'react'
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
    <div className="flex flex-wrap gap-2 bg-white border border-sage-200 rounded-lg p-2.5 min-h-[44px] items-center focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/10 transition-all">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1.5 bg-sage-100 text-forest-800 text-[12px] font-medium px-2.5 py-1 rounded-full">
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
        className="flex-1 min-w-[120px] text-[13px] text-ink bg-transparent outline-none placeholder-ink-light"
      />
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">
        {label}
        {required && <span className="text-amber ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-white border border-sage-200 rounded-lg px-3.5 py-2.5 text-[13.5px] text-ink placeholder-ink-light outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition-all'

const empty = { title: '', objective: '', summary: '', scheduledAt: '', discipline: '', contents: '', resources: '', tags: [] }

export default function FormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)

  const [form, setForm] = useState(empty)
  const [assistStatus, setAssistStatus] = useState(null)
  const [assistError, setAssistError] = useState('')

  const { data: existing } = useQuery({
    queryKey: ['plano', id],
    queryFn: () => lessonPlanApi.get(id),
    enabled: isEditing,
  })

  useEffect(() => {
    if (existing) {
      setForm({
        ...existing,
        scheduledAt: existing.scheduledAt?.split('T')[0] ?? '',
      })
    }
  }, [existing])

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
    <div className="p-8 max-w-[760px]">
      <Link
        to="/planos"
        className="inline-flex items-center gap-2 text-[13px] text-ink-muted hover:text-ink mb-7 transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Voltar para planos
      </Link>

      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600 border-l-2 border-forest-600 pl-3">
          {isEditing ? 'Edição' : 'Novo plano'}
        </span>
        <h1 className="font-display text-[28px] font-semibold text-ink leading-tight mt-3">
          {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
        </h1>
        <p className="text-[13.5px] text-ink-muted mt-1.5">
          Preencha os campos abaixo. Use o Smart Assist para gerar sugestões automáticas de conteúdo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título da Aula" required>
          <input className={inputClass} placeholder="Ex: Introdução ao Protocolo OSPF" value={form.title} onChange={set('title')} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
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
        <div className="bg-amber-light border border-amber/25 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles size={18} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[15px] font-semibold text-ink">Smart Assist</h3>
            <p className="text-[12.5px] text-ink-muted mt-0.5 leading-relaxed">
              Preencha o título, disciplina e ementa — o assistente sugere conteúdos, recursos e tags automaticamente.
            </p>
            {assistError && (
              <p className="flex items-center gap-1.5 text-[12px] text-amber mt-2 font-medium">
                <AlertCircle size={13} /> {assistError}
              </p>
            )}
            {assistStatus === 'done' && (
              <p className="flex items-center gap-1.5 text-[12px] text-forest-600 mt-2 font-medium">
                <CheckCircle2 size={13} /> Campos preenchidos com sucesso!
              </p>
            )}
            {assistStatus === 'error' && (
              <p className="flex items-center gap-1.5 text-[12px] text-red-600 mt-2 font-medium">
                <AlertCircle size={13} /> Falha ao gerar recomendações. Tente novamente.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAssist}
            disabled={assistStatus === 'loading'}
            className="flex items-center gap-2 bg-amber text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-amber-hover disabled:opacity-70 transition-colors flex-shrink-0 whitespace-nowrap"
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
          <p className="text-[13px] text-red-600 flex items-center gap-1.5">
            <AlertCircle size={14} /> Erro ao salvar. Verifique os campos e tente novamente.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sage-200 mt-2">
          <Link
            to="/planos"
            className="px-5 py-2.5 text-[13px] font-medium text-ink-muted border border-sage-200 rounded-lg hover:bg-surface transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white bg-forest-600 rounded-lg hover:bg-forest-700 disabled:opacity-60 transition-colors"
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
