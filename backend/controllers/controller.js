import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import users from '../models/user.js'
import { Errors } from '../libs/errors.js'

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, email, password }, 'Üres mező!')
    errors.email({ email }, 'Nem megfelelő formátum!')
    errors.password({ password }, 'A jelszavadnak legalább 8 karakter hosszúnak kell lenni!')
    
    if (!errors.get('username')) {
      const nameCheck = await users.findOne({ where: { username } })
      if (nameCheck) errors.push('username', 'A megadott felhasználónév már foglalt!')
    }
    
    if (!errors.get('email')) {
      const emailCheck = await users.findOne({ where: { email } })
      if (emailCheck) errors.push('email', 'A megadott email cím már foglalt!')
    }
    
    // Ha vannak hibás adatok, akkor visszaküldi a felhasználónak
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // Jelszó titkosítás, felhasználó létrehozás
    const hashedPassword = await bcrypt.hash(password, 10)
    await users.create({ username, email, password: hashedPassword })

    res.status(200).send({ message: 'Sikeres regisztráció!' })
  } catch (err) {
    if (!err) return
    console.log(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    const user = await users.findOne({ where: { username }, attributes: [ 'id', 'username', 'email', 'password' ] })
    if (!user) errors.push('username', 'A felhasználó nem található!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) errors.push('password', 'Hibás jelszó!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // accessToken létrehozás
    const accessToken = jwt.sign({ id: user.id, username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })

    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.status(200).send({ message: 'Sikeres bejelentkezés!' })
  } catch (err) {
    if (!err) return
    console.log(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

const Logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.status(400).send({ message: 'Nem vagy bejelentkezve!' })

    res.clearCookie('accessToken')
    return res.status(200).send({ message: 'Sikeres kijelentkezés!' })
  } catch (err) {
    if (!err) return
    console.log(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export { Register, Login, Logout }