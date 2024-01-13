import { Router } from 'express'
import { Logged, Register, Login, Logout } from '../controllers/controller.js'
import { verifyToken } from '../controllers/verifyToken.js'
const router = Router()

router.get('/', (req, res) => { res.send({ message: 'Tier List backend API' }) })

router.get('/logged', Logged)
router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', Logout)

export default router