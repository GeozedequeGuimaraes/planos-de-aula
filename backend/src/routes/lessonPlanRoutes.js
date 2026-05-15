import { Router } from 'express'
import { validate } from '../middlewares/validate.js'
import { lessonPlanSchema, lessonPlanUpdateSchema } from '../middlewares/schemas.js'
import * as controller from '../controllers/lessonPlanController.js'

const router = Router()

router.get('/', controller.index)
router.get('/:id', controller.show)
router.post('/', validate(lessonPlanSchema), controller.store)
router.put('/:id', validate(lessonPlanUpdateSchema), controller.update)
router.delete('/:id', controller.destroy)

export default router
