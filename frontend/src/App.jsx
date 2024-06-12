import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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

  return (
    <div className='text-white bg-neutral-800 min-h-screen'>
      <Routes>
        <Route path='/' element={<Home history={history} active={0} />} />
        <Route path='/login' element={<Home history={history} active={1} />} />
        <Route path='/register' element={<Home history={history} active={2} />} />
        <Route path='/list/*' element={<List history={history} />} />
        <Route path='/profile' element={<Profile history={history} />} />
        <Route path='/profile/:username' element={<Profile history={history} />} />
        <Route path='/email-verification' element={<EmailVerification history={history} />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  )
}

export default App