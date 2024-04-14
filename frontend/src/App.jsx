import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { socket } from './socket'
import axios from 'axios'
import './css/App.css'

import Home from './pages/Home'
import List from './pages/List'
import Profile from './pages/Profile'
import EmailVerification from './pages/EmailVerification'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:2000'

function App() {
  const history = useNavigate()
  const [logged, setLogged] = useState(null)

  const tryConnect = async () => {
    const { data } = await axios.get('/logged')
    if (data) await axios.get('/user/token/refresh')
    setLogged(data)

    if (data && !socket.connected) socket.connect()
  }

  useEffect(() => {
    tryConnect()
  }, [])

  return (
    <div className='text-white bg-neutral-800 min-h-screen'>
      {logged === null ?
        <div className='flex gap-4 items-center justify-center w-svw h-svh text-xl'>
          <div className='w-7 h-7 border-2 border-transparent border-x-white rounded-full animate-spin'></div>
          Betöltés...
        </div>
      :
        <Routes>
          <Route path='/' element={<Home history={history} />} />
          <Route path='/login' element={<Navigate to={"/?login=1"} />} />
          <Route path='/register' element={<Navigate to={"/?register=1"} />} />
          <Route path='/list/*' element={<List history={history} />} />
          <Route path='/profile' element={<Profile history={history} />} />
          <Route path='/email-verification' element={<EmailVerification history={history} />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      }
    </div>
  )
}

export default App