import { generateRecommendations } from '../services/aiService.js'
import logger from '../utils/logger.js'

export async function assist(req, res, next) {
  try {
    const { title, discipline, summary } = req.body

    if (!title || !discipline || !summary) {
      return res.status(400).json({ error: 'Título, disciplina e ementa são obrigatórios.' })
    }

    const recommendations = await generateRecommendations({ title, discipline, summary })
    res.json(recommendations)
  } catch (err) {
    logger.error('Falha na chamada ao serviço de IA', { message: err.message })

    if (err.status === 429) {
      return res.status(503).json({
        error: 'A chave da OpenAI está sem cota disponível ou sem billing ativo. Verifique créditos e cobrança na conta da OpenAI.',
      })
    }

    next(err)
  }
}
