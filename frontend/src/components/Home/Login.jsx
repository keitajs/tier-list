import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { login } from '../../user'
import Username from '../ui/Username'
import Password from '../ui/Password'
import Button from '../ui/Button'
import SuccessMsg from '../Form/SuccessMsg'

function Login(props) {
  const [searchParams] = useSearchParams()
  const [msg, setMsg] = useState('')
  const [text, setText] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({})
  const setError = (field, value) => setErrors(errors => ({ ...errors, [field]: value }))

  const handleErrors = (errors) => {
    setPassword('')
    setTimeout(() => setErrors(errors), 0)
  }

  const Login = async (e) => {
    if (Object.values(errors).find(x => !!x)) return

    const data = await login(username, password)
    if (data.errors) return handleErrors(data.errors)

    const redirectURI = searchParams.get('redirect')

    setMsg(data.message)
    setText(`Másodperceken belül átirányítunk ${redirectURI ? 'az előző oldalra' : 'a listáidhoz'}`)
    setTimeout(() => props.history(redirectURI ? redirectURI : '/list'), 2500)
  }

  return (
    <div className={`absolute flex flex-col items-center mr-0 lg:mr-12 px-12 py-12 lg:py-16 rounded-3xl bg-neutral-900/50 ${props.active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <h3 className='text-center text-3xl font-bold tracking-wide w-full lg:w-72 pb-2 mb-2 lg:mb-10 border-b-[3px] border-blue-500'>BEJELENTKEZÉS</h3>

      <div className="form flex flex-col items-center">
        <Username label='Felhasználónév vagy email' value={username} setValue={setUsername} error={errors.username} setError={(e) => setError('username', e)} validation={false} errors={{ empty: 'Add meg felhasználóneved vagy email címed!' }} />
        <Password value={password} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} reset={props.active} />

        <Button onClick={Login} text='lg' className='mt-4 lg:mt-16' disabled={Object.values(errors).find(x => !!x)}>Bejelentkezés</Button>
        <button onClick={() => props.setActive(2)} className='inline lg:hidden mt-2.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Még nincs felhasználód? Regisztrálj most!</button>
        <button onClick={() => props.setActive(0)} className='inline lg:hidden mt-0.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Vissza a főoldalra</button>
      </div>

      {msg === '' ? <></> : <SuccessMsg msg={msg} text={text} />}
    </div>
  )
}

export default Login