import path from 'path'
import { unlink } from 'fs/promises'

export const checkImage = (req, res, next) => {
  const returnError = async (message) => {
    await unlink(path.resolve() + '/' + req.file.path)
    return res.status(400).send({ message })
  }

  if (!req.file) return returnError('Nincs fájl feltöltve!')
  if (req.file.size > 5000000) return returnError('A fájl nagyobb mint 5 MB!')

  const fileTypes = /jpg|jpeg|png|webp|avif|gif|svg/
  const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase())
  const mimeType = fileTypes.test(req.file.mimetype)
  if (!mimeType || !extName) return returnError('A fájl nem kép!')

  next()
}