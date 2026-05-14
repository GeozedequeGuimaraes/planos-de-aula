import logger from '../utils/logger.js'

export function errorHandler(err, _req, res, _next) {
  logger.error(err.message, { stack: err.stack })

  if (err.isJoi) {
    return res.status(400).json({ error: 'Dados inválidos', details: err.details.map(d => d.message) })
  }

  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Erro interno do servidor' })
}

export function notFound(_req, res) {
  res.status(404).json({ error: 'Rota não encontrada' })
}
