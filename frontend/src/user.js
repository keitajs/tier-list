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
    if (data.errors) return { errors }

    connect()
    return { message: data.message }
  } catch (error) {
    console.error(error)
    return false
  }
}

export const register = async (username, email, password) => {
  try {
    const { data } = await axios.post('/register', { username, email, password })
    if (data.errors) return { errors }
    return { message: data.message }
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