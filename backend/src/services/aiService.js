import OpenAI from 'openai'
import logger from '../utils/logger.js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateRecommendations({ title, discipline, summary }) {
  const start = Date.now()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Você é um Assistente Pedagógico especializado em apoiar docentes no planejamento de aulas.
Sua função é sugerir conteúdos complementares, tópicos relacionados e tags relevantes com base no tema da aula.
Responda sempre em JSON válido com exatamente esta estrutura:
{
  "contents": "lista numerada de tópicos e subtópicos a abordar",
  "resources": "referências bibliográficas, artigos, ferramentas e links úteis",
  "tags": ["tag1", "tag2", "tag3"]
}
As tags devem ser exatamente 3, em minúsculas, sem acentos e sem espaços.`,
      },
      {
        role: 'user',
        content: `Título da Aula: ${title}\nDisciplina: ${discipline}\nEmenta/Resumo: ${summary}\n\nSugira conteúdos complementares, recursos de apoio e 3 tags para este plano de aula.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  const latency = ((Date.now() - start) / 1000).toFixed(1)
  const usage = completion.usage?.total_tokens ?? 0

  logger.info('AI Request', {
    Title: title,
    Discipline: discipline,
    TokenUsage: usage,
    Latency: `${latency}s`,
  })

  return JSON.parse(completion.choices[0].message.content)
}
