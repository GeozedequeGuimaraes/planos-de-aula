import prisma from '../config/database.js'

export async function findAll({ page = 1, limit = 10, discipline, tags, scheduledAt, search, orderBy = 'createdAt', order = 'desc' }) {
  const skip = (page - 1) * limit

  const where = {
    ...(discipline && { discipline: { equals: discipline, mode: 'insensitive' } }),
    ...(tags?.length && { tags: { hasSome: tags } }),
    ...(scheduledAt && { scheduledAt: { gte: new Date(scheduledAt) } }),
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
  }

  const validOrderFields = ['title', 'createdAt', 'scheduledAt']
  const sortField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt'

  const [data, total] = await Promise.all([
    prisma.lessonPlan.findMany({
      where,
      orderBy: { [sortField]: order === 'asc' ? 'asc' : 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.lessonPlan.count({ where }),
  ])

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function findById(id) {
  return prisma.lessonPlan.findUnique({ where: { id } })
}

export async function create(data) {
  return prisma.lessonPlan.create({ data })
}

export async function update(id, data) {
  return prisma.lessonPlan.update({ where: { id }, data })
}

export async function remove(id) {
  return prisma.lessonPlan.delete({ where: { id } })
}
