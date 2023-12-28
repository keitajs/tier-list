import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Username from '../components/Register/Username'
import Email from '../components/Register/Email'
import Password from '../components/Register/Password'
import Passwor2 from '../components/Register/Passwor2'

function Register(props) {
  const [msg, setMsg] = useState('')

  const [username, setUsername] = useState('')
  const [nameMsg, setNameMsg] = useState('Adj meg egy felhasználónevet!')

  const [email, setEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState('Adj meg egy emailt!')

  const [password, setPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('Adj meg egy jelszót!')

  const [passwor2, setPasswor2] = useState('')
  const [passwor2Msg, setPasswor2Msg] = useState('Add meg újra a jelszót!')

  const Register = (e) => {
    e.preventDefault()
    if (nameMsg !== '' || emailMsg !== '' || passwor2Msg !== '' || passwor2Msg !== '') return

    axios.post('http://localhost:2000/register', { username, password, email, }).then(res => {
      setMsg(res.data.message)
      setTimeout(() => props.history('/login'), 3000)
    }).catch(err => {
      const { errors } = err.response.data

      setPassword('')
      setPasswordMsg('Adj meg egy jelszót!')
      setPasswor2('')
      setPasswor2Msg('Adj meg egy jelszót!')
      if (errors.username) setNameMsg(errors.username)
      if (errors.email) setEmailMsg(errors.email)
      if (errors.password) setPasswordMsg(errors.password)
    })
  }

  return (
    <form className='w-screen flex flex-col items-center'>
      <h3 className='text-center text-3xl w-72 pb-3 mb-6 border-b-2 border-slate-500'>Register</h3>

      {msg === '' ? <></> : <div className='text-center text-sm text-green-200 bg-green-700 bg-opacity-20 px-3 py-1 border-2 border-green-600 rounded-md w-84 mb-2'>{msg}</div>}

      <div className="form flex flex-col items-center">
        <Username username={username} setUsername={setUsername} nameMsg={nameMsg} setNameMsg={setNameMsg} />
        <Email email={email} setEmail={setEmail} emailMsg={emailMsg} setEmailMsg={setEmailMsg} />
        <Password password={password} setPassword={setPassword} passwordMsg={passwordMsg} setPasswordMsg={setPasswordMsg} passwor2={passwor2} setPasswor2Msg={setPasswor2Msg} />
        <Passwor2 passwor2={passwor2} setPasswor2={setPasswor2} passwor2Msg={passwor2Msg} setPasswor2Msg={setPasswor2Msg} password={password} />
        
        <button className={`w-72 mt-10 py-2 rounded-xl bg-slate-500 ${nameMsg === '' && emailMsg === '' && passwordMsg === '' && passwor2Msg === '' ? 'hover:bg-slate-600' : 'cursor-not-allowed'} transition-colors`} onClick={Register}>Register</button>
      </div>

      <div className="flex">
        <Link className='mx-1 opacity-40 hover:opacity-60 transition-colors' to={'/'}>Home</Link>
        <Link className='mx-1 opacity-40 hover:opacity-60 transition-colors' to={'/login'}>Login</Link>
      </div>
    </form>
  )
}

export default Register