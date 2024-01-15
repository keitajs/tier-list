import React, { useState } from 'react'
import axios from 'axios'

import Username from './Register/Username'
import Email from './Register/Email'
import Password from './Register/Password'
import Passwor2 from './Register/Passwor2'
import SuccessMsg from '../Form/SuccessMsg'

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
    if (nameMsg !== '' || emailMsg !== '' || passwor2Msg !== '' || passwor2Msg !== '') return

    axios.post('http://localhost:2000/register', { username, password, email, }).then(res => {
      setMsg(res.data.message)
      setTimeout(() => props.setActive(1), 2500)
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
    <div className={`absolute flex flex-col items-center mr-12 px-12 py-16 rounded-3xl bg-neutral-900/50 ${props.active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <h3 className='text-center text-3xl font-bold tracking-wide w-72 pb-2 mb-10 border-b-[3px] border-blue-500'>REGISZTRÁCIÓ</h3>

      <div className="form flex flex-col items-center">
        <Username username={username} setUsername={setUsername} nameMsg={nameMsg} setNameMsg={setNameMsg} />
        <Email email={email} setEmail={setEmail} emailMsg={emailMsg} setEmailMsg={setEmailMsg} />
        <Password password={password} setPassword={setPassword} passwordMsg={passwordMsg} setPasswordMsg={setPasswordMsg} passwor2={passwor2} setPasswor2Msg={setPasswor2Msg} active={props.active} />
        <Passwor2 passwor2={passwor2} setPasswor2={setPasswor2} passwor2Msg={passwor2Msg} setPasswor2Msg={setPasswor2Msg} password={password} active={props.active} />

        <button className={`w-full mt-16 py-1.5 text-lg rounded-lg bg-blue-500 ${nameMsg === '' && emailMsg === '' && passwordMsg === '' && passwor2Msg === '' ? 'hover:bg-blue-400' : 'cursor-not-allowed'} transition-colors`} onClick={Register}>Regisztráció</button>
      </div>
      
      {msg === '' ? <></> : <SuccessMsg msg={msg} text={'Másodperceken belül átirányítunk a bejelentkezéshez'} />}
    </div>
  )
}

export default Register