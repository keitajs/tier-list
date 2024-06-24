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

export const register = async (username, password) => {
  try {
    const { data } = await axios.post('/register', { username, password })
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const sendVerificationCode = async (email) => {
  try {
    const { data } = await axios.post('/register/email', { email })
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const verifyEmail = async (email, code) => {
  try {
    const { data } = await axios.post('/register/email/verify', { email, code })
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateEmail = async () => {
  try {
    const { data } = await axios.patch('/user/email')
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updateUsername = async (username) => {
  try {
    const { data } = await axios.patch('/user/username', { username })
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const updatePassword = async (password, currentPassword) => {
  try {
    const { data } = await axios.patch('/user/password', { password, currentPassword })
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
    return data
  } catch (error) {
    console.error(error)
    return false
  }
}

export const deleteAvatar = async () => {
  try {
    const { data } = await axios.delete('/user/avatar')
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
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const createPermission = async (listId, username, permission) => {
  try {
    const { data } = await axios.post(`/lists/${listId}/permissions/create`, { username, permission })
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const updatePermission = async (listId, userId, permission) => {
  try {
    const { data } = await axios.patch(`/lists/${listId}/permissions/update/${userId}`, { value: permission })
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}

export const removePermission = async (listId, userId) => {
  try {
    const { data } = await axios.delete(`/lists/${listId}/permissions/remove/${userId}`)
    return data
  } catch (error) {
    console.error(error)
    return { error: 'Ismeretlen hiba' }
  }
}