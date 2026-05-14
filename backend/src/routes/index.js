import { Router } from 'express'
import lessonPlanRoutes from './lessonPlanRoutes.js'

const router = Router()

router.use('/planos', lessonPlanRoutes)

export default router
