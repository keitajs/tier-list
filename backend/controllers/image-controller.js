import path from 'path'
import fs from 'fs'
import { unlink } from 'fs/promises'

// Feltöltött kép ellenőrzése
export const checkImage = (req, res, next) => {
  const returnError = async (message) => {
    const filePath = path.resolve() + '/' + req.file?.path

    if (fs.existsSync(filePath)) await unlink(filePath)
    return res.status(400).send({ message })
  }

  if (!req.file) return next()
  if (req.file.size > 5000000) return returnError('A fájl nagyobb mint 5 MB!')

  const fileTypes = /jpg|jpeg|png|webp|avif|gif|svg/
  const extName = fileTypes.test(path.extname(req.file.originalname).toLowerCase())
  const mimeType = fileTypes.test(req.file.mimetype)
  if (!mimeType || !extName) return returnError('A fájl nem kép!')

  next()
}

// Felhasználó profilképek lekérése
export const getAvatarImage = async (req, res) => {
  let filePath = `${path.resolve()}/images/avatars/${req.params.filename}`
  if (!fs.existsSync(filePath)) filePath = `${path.resolve()}/images/avatars/dummy.png`

  res.sendFile(filePath)
}

// Karakter képek lekérése
export const getCharacterImage = async (req, res) => {
  const filePath = `${path.resolve()}/images/characters/${req.params.filename}`
  if (!fs.existsSync(filePath)) res.status(404).send({ message: 'Nem található kép!' })

  res.sendFile(`${path.resolve()}/images/characters/${req.params.filename}`)
}