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

export const updateUsername = async (username) => {
  try {
    const { data } = await axios.patch('/user/username', { username })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updatePassword = async (password, currentPassword) => {
  try {
    const { data } = await axios.patch('/user/password', { password, currentPassword })
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateAvatar = async (image) => {
  try {
    const formData = new FormData()
    formData.append('avatar', image)

    const { data } = await axios.patch('/user/avatar', formData)
    if (data.errors) return { errors: data.errors }
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteAvatar = async () => {
  try {
    const { data } = await axios.delete('/user/avatar')
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
    await axios.delete('/logout').then(redirect ? () => history(redirect) : () => {})
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getList = async (listId) => {
  try {
    const { data } = await axios.get(`/user/lists/${listId}`)
    if (data.error) return { error: data.error }
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const getLists = async (query) => {
  try {
    const q = query ? `?q=${query}` : ''

    const { data } = await axios.get('/user/lists' + q)
    if (data.error) return { error: data.error }
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const getSharedLists = async (query) => {
  try {
    const q = query ? `?q=${query}` : ''

    const { data } = await axios.get('/lists/shared' + q)
    if (data.error) return { error: data.error }
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const getPublicLists = async (query) => {
  try {
    const q = query ? `?q=${query}` : ''

    const { data } = await axios.get('/lists/public' + q)
    if (data.error) return { error: data.error }
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}