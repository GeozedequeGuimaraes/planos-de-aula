import Joi from 'joi'

export const lessonPlanSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  objective: Joi.string().min(10).required(),
  summary: Joi.string().min(10).required(),
  scheduledAt: Joi.date().iso().required(),
  discipline: Joi.string().min(2).max(100).required(),
  contents: Joi.string().min(5).required(),
  resources: Joi.string().optional().allow(''),
  tags: Joi.array().items(Joi.string().max(50)).max(10).default([]),
})

export const lessonPlanUpdateSchema = lessonPlanSchema.fork(
  ['title', 'objective', 'summary', 'scheduledAt', 'discipline', 'contents'],
  (field) => field.optional()
)
