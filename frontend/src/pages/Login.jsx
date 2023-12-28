import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Username from '../components/Login/Username'
import Password from '../components/Login/Password'

function Login(props) {
  const [msg, setMsg] = useState('')

  const [username, setUsername] = useState('')
  const [nameMsg, setNameMsg] = useState('Adj meg egy felhasználónevet!')

  const [password, setPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('Adj meg egy jelszót!')

  const Login = (e) => {
    e.preventDefault()
    if (nameMsg !== '' || passwordMsg !== '') return

    axios.post('http://localhost:2000/login', { username, password }).then(res => {
      setMsg(res.data.message)
      setTimeout(() => props.history('/list'), 3000)
    }).catch(err => {
      const { errors } = err.response.data

      setPassword('')
      setPasswordMsg('Adj meg egy jelszót!')
      if (errors.username) setNameMsg(errors.username)
      if (errors.password) setPasswordMsg(errors.password)
    })
  }

  return (
    <form className='w-screen flex flex-col items-center'>
      <h3 className='text-center text-3xl w-72 pb-3 mb-6 border-b-2 border-slate-500'>Login</h3>

      {msg === '' ? <></> : <div className='text-center text-sm text-green-200 bg-green-700 bg-opacity-20 px-3 py-1 border-2 border-green-600 rounded-md w-84 mb-2'>{msg}</div>}

      <div className="form flex flex-col items-center">
        <Username username={username} setUsername={setUsername} nameMsg={nameMsg} setNameMsg={setNameMsg} />
        <Password password={password} setPassword={setPassword} passwordMsg={passwordMsg} setPasswordMsg={setPasswordMsg} />

        <button className={`w-72 mt-10 py-2 rounded-xl bg-slate-500 ${nameMsg === '' && passwordMsg === '' ? 'hover:bg-slate-600' : 'cursor-not-allowed'} transition-colors`} onClick={Login}>Login</button>
      </div>

      <div className="flex">
        <Link className='mx-1 opacity-40 hover:opacity-60 transition-colors' to={'/'}>Home</Link>
        <Link className='mx-1 opacity-40 hover:opacity-60 transition-colors' to={'/register'}>Register</Link>
      </div>
    </form>
  )
}

export default Login