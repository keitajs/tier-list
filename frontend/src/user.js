import axios from 'axios'
import { connect, disconnect } from './socket'

export const getLoginStatus = async () => {
  try {
    const { data: logged } = await axios.get('/logged')
    return logged
  } catch (error) {
    console.error(error)
    return false
  }
}

export const refreshToken = async () => {
  try {
    const logged = await getLoginStatus()
    if (!logged) return false

    await axios.get('/user/token/refresh')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const login = async (username, password) => {
  try {
    const { data } = await axios.post('/login', { username, password })
    if (data.errors) return { errors: data.errors }

    connect()
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const register = async (username, password, emailId) => {
  try {
    const { data } = await axios.post('/register', { username, password, emailId })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const sendVerificationCode = async (email) => {
  try {
    const { data } = await axios.post('/register/email', { email })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const verifyEmail = async (email, code) => {
  try {
    const { data } = await axios.post('/register/email/verify', { email, code })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateEmail = async (emailId, password) => {
  try {
    const { data } = await axios.patch('/user/email', { emailId, password })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const logout = async ({ redirect, history }) => {
  try {
    disconnect()
    axios.delete('/logout').then(redirect ? () => history(redirect) : () => {})
  } catch (error) {
    console.error(error)
    return false
  }
}