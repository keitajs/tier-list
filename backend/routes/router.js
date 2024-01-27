import { Router } from 'express'
import { Register, Login, Logout, Logged, getUserList, getUserLists, getSharedLists, getPublicLists, createList, updateList, removeList, createPermission, updatePermission, removePermission, createCharacter, moveCharacter, updateCharacter, removeCharacter, createCategory, moveCategory, updateCategory, removeCategory } from '../controllers/controller.js'
import { hasAnyPermission, hasMovePermission, hasEditPermission, isAdmin, isInList } from '../controllers/checkPermission.js'
import { verifyToken } from '../controllers/verifyToken.js'
const router = Router()

router.get('/', (req, res) => { res.send({ message: 'Tier List backend API' }) })

router.get('/logged', Logged)
router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', Logout)

router.get('/user/lists', verifyToken, getUserLists)
router.get('/user/lists/:id', verifyToken, hasAnyPermission, getUserList)

router.get('/lists/shared', verifyToken, getSharedLists)
router.get('/lists/public', verifyToken, getPublicLists)
router.post('/lists/create', verifyToken, createList)
router.patch('/lists/:id/update', verifyToken, isAdmin, updateList)
router.delete('/lists/:id/remove', verifyToken, isAdmin, removeList)

router.post('/lists/:id/permissions/create', verifyToken, isAdmin, createPermission)
router.patch('/lists/:id/permissions/update/:userId', verifyToken, isAdmin, updatePermission)
router.delete('/lists/:id/permissions/remove/:userId', verifyToken, isAdmin, removePermission)

router.post('/lists/:id/categories/create', verifyToken, hasEditPermission, createCategory)
router.patch('/lists/:id/categories/:categoryId/move', verifyToken, hasMovePermission, isInList, moveCategory)
router.patch('/lists/:id/categories/:categoryId/update', verifyToken, hasEditPermission, isInList, updateCategory)
router.delete('/lists/:id/categories/:categoryId/remove', verifyToken, hasEditPermission, isInList, removeCategory)

router.post('/lists/:id/characters/create', verifyToken, hasEditPermission, createCharacter)
router.patch('/lists/:id/characters/:characterId/move', verifyToken, hasMovePermission, isInList, moveCharacter)
router.patch('/lists/:id/characters/:characterId/update', verifyToken, hasEditPermission, isInList, updateCharacter)
router.delete('/lists/:id/characters/:characterId/remove', verifyToken, hasEditPermission, isInList, removeCharacter)

export default router