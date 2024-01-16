import { Router } from 'express'
import { Register, Login, Logout, Logged, getUserLists, getPublicLists, createList, updateList, removeList } from '../controllers/controller.js'
import { verifyToken } from '../controllers/verifyToken.js'
const router = Router()

router.get('/', (req, res) => { res.send({ message: 'Tier List backend API' }) })

router.get('/logged', Logged)
router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', Logout)

router.get('/user/lists', verifyToken, getUserLists)

router.post('/lists/create', verifyToken, createList)
router.patch('/lists/update/:id', verifyToken, updateList)
router.delete('/lists/remove/:id', verifyToken, removeList)

router.get('/lists/public', verifyToken, getPublicLists)

export default router