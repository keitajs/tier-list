import { useRef, useState } from 'react'
import { register, sendVerificationCode, verifyEmail } from '../../user'
import Email from './Register/Email'
import Code from './Register/Code'
import Username from './Register/Username'
import Password from './Register/Password'
import Passwor2 from './Register/Passwor2'
import SuccessMsg from '../Form/SuccessMsg'

function Register(props) {
  const [step, setStep] = useState(0)
  const [msg, setMsg] = useState('')
  const [text, setText] = useState('')

  const [email, setEmail] = useState('')
  const [emailId, setEmailId] = useState(0)
  const [code, setCode] = useState(new Array(6).fill(''))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwor2, setPasswor2] = useState('')

  const [newCode, setNewCode] = useState(0)
  const newCodeRef = useRef(null)

  const [errors, setErrors] = useState({ email: 'Adj meg egy emailt!' })
  const setError = (field, value) => setErrors({ ...errors, [field]: value })

  const handleErrors = (errors) => {
    setPassword('')
    setPasswor2('')
    setErrors(errors)
    setError('password', errors.password ? errors.password : 'Adj meg egy jelszót!')
    setError('passwor2', 'Adj meg egy jelszót!')
  }

  const getNewCode = async () => {
    const data = await sendVerificationCode(email)
    if (data.errors) return console.log(data.errors)

    startNewCodeTimer()
  }

  const startNewCodeTimer = () => {
    if (newCodeRef.current !== null) return
    setNewCode(60)

    newCodeRef.current = setInterval(() => {
      setNewCode(newCode => {
        if (newCode > 1) return newCode - 1
        clearInterval(newCodeRef.current)
        newCodeRef.current = null
        return 0
      })
    }, 1000)
  }

  const nextStep = async () => {
    // Emailben kapott kód beírása
    if (step === 0) {
      const data = await sendVerificationCode(email)
      if (data.errors) return setErrors(data.errors)
      
      startNewCodeTimer()
      setErrors({ code: 'Írd be az üzenetben kapott kódot!' })
      return setStep(step + 1)
    }

    // Felhasználónév és jelszó megadása
    if (step === 1) {
      const data = await verifyEmail(email, code.join(''))
      if (data.errors) return setErrors(data.errors)

      setEmailId(data.emailId)
      setErrors({
        username: 'Adj meg egy felhasználónevet!',
        password: 'Adj meg egy jelszót!',
        passwor2: 'Add meg újra a jelszót!'
      })
      return setStep(step + 1)
    }

    // Regisztráció
    if (step === 2) {
      if (Object.values(errors).find(x => !!x)) return

      const data = await register(username, password, emailId)
      if (data.errors) return handleErrors(data.errors)

      setMsg(data.message)
      setText('Másodperceken belül átirányítunk a bejelentkezéshez')
      setTimeout(() => props.setActive(1), 2500)
    }
  }

  return (
    <div className={`absolute flex flex-col items-center mr-0 lg:mr-12 px-12 py-12 lg:py-16 rounded-3xl bg-neutral-900/50 ${props.active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <h3 className='text-center text-3xl font-bold tracking-wide w-full lg:w-72 pb-2 mb-2 lg:mb-10 border-b-[3px] border-blue-500'>REGISZTRÁCIÓ</h3>

      <div className="form flex flex-col items-center max-w-64">
        {step === 0 ?
        <>
          <Email email={email} setEmail={setEmail} emailMsg={errors.email} setEmailMsg={(e) => setError('email', e)} />
        </>
        : step === 1 ?
        <>
          <Email email={email} setEmail={setEmail} emailMsg={errors.email} setEmailMsg={(e) => setError('email', e)} disabled={true} />
          <Code code={code} setCode={setCode} error={errors.code} setError={(e) => setError('code', e)} />
        </>
        :
        <>
          <Username username={username} setUsername={setUsername} nameMsg={errors.username} setNameMsg={(e) => setError('username', e)} />
          <Password password={password} passwor2={passwor2} setPassword={setPassword} passwordMsg={errors.password} setPasswordMsg={(e) => setError('password', e)} setPasswor2Msg={(e) => setError('passwor2', e)} active={props.active} />
          <Passwor2 passwor2={passwor2} password={password} setPasswor2={setPasswor2} passwor2Msg={errors.passwor2} setPasswor2Msg={(e) => setError('passwor2', e)} active={props.active} />
        </>}

        <p className='mt-6 opacity-60 text-sm'>
          <b>Tipp: </b>
          {step === 0 ?
          <>
            A regisztrációhoz szükséges egy email cím, amelybe be tudsz jelentkezni.
          </>
          : step === 1 ? 
          <>
            A megadott címre küldtünk egy hitelesítő kódot.
            Ha nem kaptad meg, 
            {" "}{newCode === 0 ? <b onClick={getNewCode} className='cursor-pointer hover:underline'>ide kattintva</b> : <><b>{newCode}</b> másodperc múlva</>}{" "}
            kérhetsz egy újat.
          </>
          :
          <>
            A regisztráció véglegesítéséhez válassz magadnak egy felhasználónevet és jelszót.
          </>
          }
        </p>

        <button className={`w-full mt-4 lg:mt-16 py-1.5 text-lg rounded-lg bg-blue-500 ${!Object.values(errors).find(x => !!x) ? 'hover:bg-blue-400' : 'cursor-not-allowed'} transition-colors`} onClick={nextStep}>{step === 2 ? 'Regisztráció befejezése' : 'Tovább'}</button>
        <button onClick={() => props.setActive(1)} className='inline lg:hidden mt-2.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
        <button onClick={() => props.setActive(0)} className='inline lg:hidden mt-0.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Vissza a főoldalra</button>
      </div>
      
      {msg === '' ? <></> : <SuccessMsg msg={msg} text={text} />}
    </div>
  )
}

export default Register