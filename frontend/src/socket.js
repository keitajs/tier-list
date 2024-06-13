import { io } from 'socket.io-client'
import { getLoginStatus } from './user'

export const socket = io('http://localhost:2000', {
  withCredentials: true,
  autoConnect: false,
  forceNew: true
})

export const connect = async () => {
  const delay = (d) => new Promise((resolve) => { setTimeout(() => { resolve() }, d) })

  const logged = await getLoginStatus()
  if (socket.connected && !logged) return socket.disconnect()
  if (socket.connected || !logged) return

  for (let i = 0; i < 10; i++) {
    if (socket.connected) return
    socket.disconnect()
    socket.connect()
    await delay(200)
  }

  console.error('Csatlakozás a socket szerverhez sikertelen! Amennyiben a probléma nem oldódik meg, kérlek jelezd egy fejlesztőnek!')
}

export const disconnect = () => {
  if (!socket.connected) return
  socket.disconnect()
}