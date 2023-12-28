class Errors {
  constructor() {
    this.errors = {}
    this.check = false
  }

  // Összes hibaüzenet lekérdezése
  get = (field) => {
    if (!field) return this.errors
    return this.errors[field]
  }

  // Hibaüzenet hozzáadása
  push = (field, message) => {
    this.check = true
    if (!this.errors[field])
      this.errors[field] = message
  }

  // Hibaüzenet száma
  count = () => {
    return Object.keys(this.errors).length
  }

  // A kapott fieldekre hibaüzenetet tesz, ha üresek
  empty = (fields, message) => {
    for (const [key, val] of Object.entries(fields))
      if (EmptyTest(val))
        this.push(key, message)
  }

  // Email ellenőrzés
  email = (emails, message) => {
    for (const [key, val] of Object.entries(emails))
      if (!EmailTest(val))
        this.push(key, message)
  }

  // Jelszó ellenőrzés
  password = (passwords, message) => {
    for (const [key, val] of Object.entries(passwords))
      if (!PasswordTest(val))
        this.push(key, message)
  }
}

const EmptyTest = (value) => {
  return !value || value === '' || value.length === 0
}

const EmailTest = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
}

const PasswordTest = (password) => {
  return password.length >= 8
}

export { Errors, EmptyTest, EmailTest, PasswordTest }