import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import socket from './socket'
import axios from 'axios'
import './css/App.css'

import Home from './pages/Home'
import List from './pages/List'
import Profile from './pages/Profile'

axios.defaults.withCredentials = true
window.oncontextmenu = () => { return false }

function App() {
  const history = useNavigate()

  return (
    <div className='text-white bg-neutral-800 min-h-screen'>
      <Routes>
        <Route path='/' element={<Home history={history} />} />
        <Route path='/login' element={<Navigate to={"/?login=1"} />} />
        <Route path='/register' element={<Navigate to={"/?register=1"} />} />
        <Route path='/list/*' element={<List history={history} />} />
        <Route path='/profile' element={<Profile history={history} />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  )
}

export default App