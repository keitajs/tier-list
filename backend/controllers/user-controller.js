import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rndstr from 'rndstr'
import logger from '../libs/logger.js'
import users from '../models/user.js'
import emails from '../models/emails.js'
import moment from 'moment'
import { Op } from 'sequelize'
import { Errors } from '../libs/errors.js'
import { sendMail } from '../libs/resend.js'

export const registerEmail = async (req, res) => {
  try {
    // Email cím regisztrálása és hitelesítés megkezdése
    const { email } = req.body
    const errors = new Errors()

    // Formai követelmények
    errors.empty({ email }, 'Üres mező!')
    errors.email({ email }, 'Nem megfelelő formátum!')
    if (errors.check) return res.send({ errors: errors.get() })

    // Ellenőrzés, hogy az email cím már foglalt-e
    const checkEmail = await emails.findOne({ where: { address: email } })
    if (checkEmail) {
      const user = await users.findOne({ where: { emailId: checkEmail.id } })
      if (user) return res.send({ errors: { email: 'A megadott email cím már foglalt!' } })

      const diff = (moment(checkEmail.expDate).subtract(process.env.MAILCODE_MINS - 1, 'minutes')).diff(moment(), 'seconds')
      if (diff > 0) return res.send({ errors: { email: `A következő hitelesítő kódot ${diff} másodperc múlva kérheted!` } })
    }

    // Hitelesítő kód és lejárati idő
    const code = rndstr({ length: 6, chars: 'A-Z0-9', parseRange: true })
    const expDate = moment().add(process.env.MAILCODE_MINS, 'minutes').toDate()

    // Email kód adatok frissítése
    if (!checkEmail) await emails.create({ address: email, code, expDate })
    else {
      checkEmail.code = code
      checkEmail.expDate = expDate
      await checkEmail.save()
    }

    // Hitelesítő email kiküldése
    await sendMail(email, 'Email hitelesítés', 'libs/resend_templates/verifyEmail.html', { title: 'Email hitelesítés', code })
    res.send({ message: 'Email hitelesítő kód sikeresen elküldve!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { message: 'Ismeretlen hiba történt!' } })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    // Email hitelesítés
    const { email, code } = req.body
    
    const checkEmail = await emails.findOne({ where: { address: email } })
    if (checkEmail.code === null) return res.send({ errors: { code: 'Az email címhez nem tartozik kód!' } })
    if (checkEmail.code !== code) return res.send({ errors: { code: 'Az email címhez nem ez a kód tartozik!' } })
    if (moment().isAfter(checkEmail.expDate)) return res.send({ errors: { code: 'Az email címhez tartozó kód lejárt!' } })
    
    checkEmail.code = null
    await checkEmail.save()

    const registerToken = jwt.sign({ address: email }, process.env.REGISTER_SECRET, { expiresIn: '15m' })
    res.cookie('registerToken', registerToken, { maxAge: 15*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeresen hitelesítetted az email címedet!', emailId: checkEmail.id })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { message: 'Ismeretlen hiba történt!' } })
  }
}

export const Register = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    errors.username({ username }, 'Nem megfelelő formátum!')
    errors.password({ password }, 'A jelszavadnak legalább 8 karakter hosszúnak kell lenni!')
    
    if (!errors.get('username')) {
      const nameCheck = await users.findOne({ where: { username } })
      if (nameCheck) errors.push('username', 'A megadott felhasználónév már foglalt!')
    }
    if (errors.check) return res.send({ errors: errors.get() })

    // Regisztrációs token lekérése
    const token = req.cookies.registerToken
    if (!token) return res.send({ errors: { message: 'Regisztrációs token nem található!' } })

    // Tokenből email address kinyerése
    let address = ''
    jwt.verify(token, process.env.REGISTER_SECRET, (err, decoded) => {
      if (err) res.send({ errors: { message: 'Hiba történt a token feldolgozása közben!' } })
      address = decoded.address
    })
    if (!address) return res.send({ errors: { message: 'Regisztrációs email nem található!' } })

    // Email ellenőrzések
    const email = await emails.findOne({ where: { address } })
    if (!email) return res.send({ errors: { message: 'Az email cím nem található!' } })
    if (email.code) return res.send({ errors: { message: 'Az email cím nincs hitelesítve!' } })
    if (moment().isAfter(email.expDate)) return res.send({ errors: { message: 'Az email cím regisztrációs ideje lejárt!' } })
    
    // Ellenőrzés, hogy nem-e lett regisztrálva az email címmel
    const user = await users.findOne({ where: { emailId: email.id } })
    if (user) return res.send({ errors: { message: 'A megadott email cím már foglalt!' } })

    const hashedPassword = await bcrypt.hash(password, 10)
    await users.create({ username, password: hashedPassword, emailId: email.id })

    res.clearCookie('registerToken', { sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres regisztráció!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { message: 'Ismeretlen hiba történt!' } })
  }
}

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    if (errors.check) return res.send({ errors: errors.get() })

    const user = await users.findOne({
      attributes: ['id', 'username', 'password'],
      include: {
        model: emails,
        attributes: ['address'],
        required: false
      },
      where: {
        [Op.or]: [
          { username },
          { '$email.address$': username }
        ]
      }
    })
    if (!user) errors.push('username', 'A felhasználó nem található!')
    if (errors.check) return res.send({ errors: errors.get() })

    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) errors.push('password', 'Hibás jelszó!')
    if (errors.check) return res.send({ errors: errors.get() })

    // accessToken létrehozás
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
    user.accessToken = accessToken
    await user.save()

    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres bejelentkezés!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { username: 'Ismeretlen hiba történt!' } })
  }
}

export const Logout = async (req, res) => {
  try {
    // accessToken-t törli a sütikből
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.status(400).send({ message: 'Nem vagy bejelentkezve!' })

    await users.update({ accessToken: null }, { where: { accessToken } })

    res.clearCookie('accessToken', { sameSite: 'None', secure: true })
    return res.send({ message: 'Sikeres kijelentkezés!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const Logged = async (req, res) => {
  try {
    // Visszaadja, hogy a felhasználó be van-e jelentkezve
    const token = req.cookies.accessToken
    if (!token) return res.send(false)

    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.send(false)
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id: id, username: username } })
      if (!user) return res.send(false)
      if (user.accessToken !== token) return res.send(false)

      res.send(true)
    })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}