import React, { useState } from 'react'
import axios from 'axios'

import Username from './Login/Username'
import Password from './Login/Password'
import SuccessMsg from '../Form/SuccessMsg'

function Login(props) {
  const [msg, setMsg] = useState('')

  const [username, setUsername] = useState('')
  const [nameMsg, setNameMsg] = useState('Adj meg egy felhasználónevet!')

  const [password, setPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('Adj meg egy jelszót!')

  const Login = (e) => {
    if (nameMsg !== '' || passwordMsg !== '') return

    axios.post('http://localhost:2000/login', { username, password }).then(res => {
      setMsg(res.data.message)
      setTimeout(() => props.history('/list'), 2500)
    }).catch(err => {
      const { errors } = err.response.data

      setPassword('')
      setPasswordMsg('Adj meg egy jelszót!')
      if (errors.username) setNameMsg(errors.username)
      if (errors.password) setPasswordMsg(errors.password)
    })
  }

  return (
    <div className={`absolute flex flex-col items-center mr-12 px-12 py-16 rounded-3xl bg-neutral-900 bg-opacity-50 ${props.active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <h3 className='text-center text-3xl font-bold tracking-wide w-72 pb-2 mb-10 border-b-[3px] border-blue-500'>BEJELENTKEZÉS</h3>

      <div className="form flex flex-col items-center">
        <Username username={username} setUsername={setUsername} nameMsg={nameMsg} setNameMsg={setNameMsg} />
        <Password password={password} setPassword={setPassword} passwordMsg={passwordMsg} setPasswordMsg={setPasswordMsg} active={props.active} />

        <button className={`w-full mt-16 py-1.5 text-lg rounded-lg bg-blue-500 ${nameMsg === '' && passwordMsg === '' ? 'hover:bg-blue-400' : 'cursor-not-allowed'} transition-colors`} onClick={Login}>Bejelentkezés</button>
      </div>

      {msg === '' ? <></> : <SuccessMsg msg={msg} text={'Másodperceken belül átirányítunk a listáidhoz'} />}
    </div>
  )
}

export default Login