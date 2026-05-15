import * as service from '../services/lessonPlanService.js'
import logger from '../utils/logger.js'

export async function index(req, res, next) {
  try {
    const { page, limit, discipline, tags, scheduledAt, search, orderBy, order } = req.query
    const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',')) : undefined

    const result = await service.findAll({ page, limit, discipline, tags: tagsArray, scheduledAt, search, orderBy, order })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function show(req, res, next) {
  try {
    const plan = await service.findById(req.params.id)
    if (!plan) return res.status(404).json({ error: 'Plano de aula não encontrado' })
    res.json(plan)
  } catch (err) {
    next(err)
  }
}

export async function store(req, res, next) {
  try {
    const plan = await service.create(req.body)
    logger.info('Plano de aula criado', { id: plan.id, title: plan.title })
    res.status(201).json(plan)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const plan = await service.findById(req.params.id)
    if (!plan) return res.status(404).json({ error: 'Plano de aula não encontrado' })

    const updated = await service.update(req.params.id, req.body)
    logger.info('Plano de aula atualizado', { id: updated.id })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export async function destroy(req, res, next) {
  try {
    const plan = await service.findById(req.params.id)
    if (!plan) return res.status(404).json({ error: 'Plano de aula não encontrado' })

    await service.remove(req.params.id)
    logger.info('Plano de aula removido', { id: req.params.id })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
