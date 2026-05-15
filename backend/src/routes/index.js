import { Router } from 'express'
import lessonPlanRoutes from './lessonPlanRoutes.js'
import { assist } from '../controllers/smartAssistController.js'

const router = Router()

router.use('/planos', lessonPlanRoutes)
router.post('/smart-assist', assist)

export default router
