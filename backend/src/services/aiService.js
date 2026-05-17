import OpenAI from 'openai'
import logger from '../utils/logger.js'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const provider = process.env.AI_PROVIDER || 'openai'
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o'
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const systemPrompt = `Você é um Assistente Pedagógico especializado em apoiar docentes no planejamento de aulas.
Sua função é sugerir conteúdos complementares, tópicos relacionados e tags relevantes com base no tema da aula.
Responda sempre em JSON válido com exatamente esta estrutura:
{
  "contents": "lista numerada de tópicos e subtópicos a abordar",
  "resources": "referências bibliográficas, artigos, ferramentas e links úteis",
  "tags": ["tag1", "tag2", "tag3"]
}
As tags devem ser exatamente 3, em minúsculas, sem acentos e sem espaços.`

function buildPrompt({ title, discipline, summary }) {
  return `${systemPrompt}

Título da Aula: ${title}
Disciplina: ${discipline}
Ementa/Resumo: ${summary}

Sugira conteúdos complementares, recursos de apoio e 3 tags para este plano de aula.`
}

function parseJsonResponse(text) {
  const clean = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')

  return JSON.parse(clean)
}

async function generateWithOpenAI(input) {
  if (!openai) {
    throw new Error('OPENAI_API_KEY não configurada.')
  }

  const completion = await openai.chat.completions.create({
    model: openaiModel,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Título da Aula: ${input.title}\nDisciplina: ${input.discipline}\nEmenta/Resumo: ${input.summary}\n\nSugira conteúdos complementares, recursos de apoio e 3 tags para este plano de aula.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return {
    data: JSON.parse(completion.choices[0].message.content),
    usage: completion.usage?.total_tokens ?? 0,
    model: openaiModel,
  }
}

async function generateWithGemini(input) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada.')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(input) }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  const body = await response.json()

  if (!response.ok) {
    const error = new Error(body.error?.message || 'Falha na chamada ao Gemini.')
    error.status = response.status
    throw error
  }

  const text = body.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini não retornou conteúdo para o rascunho assistido.')
  }

  return {
    data: parseJsonResponse(text),
    usage: body.usageMetadata?.totalTokenCount ?? 0,
    model: geminiModel,
  }
}

export async function generateRecommendations({ title, discipline, summary }) {
  const start = Date.now()
  const input = { title, discipline, summary }
  const result = provider === 'gemini'
    ? await generateWithGemini(input)
    : await generateWithOpenAI(input)

  const latency = ((Date.now() - start) / 1000).toFixed(1)

  logger.info('AI Request', {
    Provider: provider,
    Model: result.model,
    Title: title,
    Discipline: discipline,
    TokenUsage: result.usage,
    Latency: `${latency}s`,
  })

  return result.data
}
