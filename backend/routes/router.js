import { Router } from 'express'
import { getAvatarImage, getCharacterImage, Register, Login, Logout, Logged, updateUsername, updateAvatar, deleteAvatar, updateEmail, updatePassword, verifyEmail, getUserData, getUserDataByUsername, getUserList, getUserLists, getSidebarLists, getSharedLists, getPublicLists, createList, updateList, removeList, createPermission, updatePermission, removePermission, createCharacter, moveCharacter, updateCharacter, removeCharacter, createCategory, moveCategory, updateCategory, removeCategory } from '../controllers/controller.js'
import { hasAnyPermission, hasMovePermission, hasEditPermission, isAdmin, isInList } from '../controllers/checkPermission.js'
import { verifyToken, refreshToken } from '../controllers/verifyToken.js'
import { checkImage } from '../controllers/checkImage.js'
import multer from 'multer'
import path from 'path'

const router = Router()

// Multer
const characterImageStorage = multer.diskStorage({ destination: 'images/characters/', filename: (req, file, cb) => {
  cb(null, `${path.basename(file.originalname)}-${Date.now()}${path.extname(file.originalname)}`)
} })
const avatarImageStorage = multer.diskStorage({ destination: 'images/avatars/', filename: (req, file, cb) => {
  cb(null, `${req.id}${Date.now()}${path.extname(file.originalname)}`)
} })

const uploadCharacterImage = multer({ storage: characterImageStorage })
const uploadAvatarImage = multer({ storage: avatarImageStorage })

// Útvonalak
router.get('/', (req, res) => { res.send({ message: 'Tier List backend API' }) })

// Felhasználó útvonalak
router.get('/logged', Logged)
router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', Logout)

router.get('/user/data', verifyToken, getUserData)
router.get('/user/data/:username', getUserDataByUsername)
router.get('/user/token/refresh', verifyToken, refreshToken)

router.get('/user/lists', verifyToken, getUserLists)
router.get('/user/lists/:id', verifyToken, hasAnyPermission, getUserList)
router.patch('/user/username', verifyToken, updateUsername)
router.patch('/user/avatar', verifyToken, uploadAvatarImage.single('avatar'), checkImage, updateAvatar)
router.delete('/user/avatar', verifyToken, deleteAvatar)
router.patch('/user/email', verifyToken, updateEmail)
router.patch('/user/password', verifyToken, updatePassword)
router.post('/user/email/verify', verifyToken, verifyEmail)

// Lista útvonalak
router.get('/lists/sidebar', verifyToken, getSidebarLists)
router.get('/lists/shared', verifyToken, getSharedLists)
router.get('/lists/public', verifyToken, getPublicLists)
router.post('/lists/create', verifyToken, createList)
router.patch('/lists/:id/update', verifyToken, isAdmin, updateList)
router.delete('/lists/:id/remove', verifyToken, isAdmin, removeList)

// Lista jogosultság útvonalak
router.post('/lists/:id/permissions/create', verifyToken, isAdmin, createPermission)
router.patch('/lists/:id/permissions/update/:userId', verifyToken, isAdmin, updatePermission)
router.delete('/lists/:id/permissions/remove/:userId', verifyToken, isAdmin, removePermission)

// Lista kategória útvonalak
router.post('/lists/:id/categories/create', verifyToken, hasEditPermission, createCategory)
router.patch('/lists/:id/categories/:categoryId/move', verifyToken, hasMovePermission, isInList, moveCategory)
router.patch('/lists/:id/categories/:categoryId/update', verifyToken, hasEditPermission, isInList, updateCategory)
router.delete('/lists/:id/categories/:categoryId/remove', verifyToken, hasEditPermission, isInList, removeCategory)

// Lista karakter útvonalak
router.post('/lists/:id/characters/create', verifyToken, hasEditPermission, uploadCharacterImage.single('image'), checkImage, createCharacter)
router.patch('/lists/:id/characters/:characterId/move', verifyToken, hasMovePermission, isInList, moveCharacter)
router.patch('/lists/:id/characters/:characterId/update', verifyToken, hasEditPermission, isInList, uploadCharacterImage.single('image'), checkImage, updateCharacter)
router.delete('/lists/:id/characters/:characterId/remove', verifyToken, hasEditPermission, isInList, removeCharacter)

// Fájl lekérés útvonalak
router.get('/user/images/:filename', getAvatarImage)
router.get('/characters/images/:filename', getCharacterImage)

export default router