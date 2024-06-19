import { useRef, useState } from 'react'
import { register, sendVerificationCode, verifyEmail } from '../../user'
import Email from '../ui/Email'
import Code from '../ui/Code'
import Username from '../ui/Username'
import Password from '../ui/Password'
import Button from '../ui/Button'
import SuccessMsg from './SuccessMsg'

export default function Register(props) {
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

  const [errors, setErrors] = useState({})
  const setError = (field, value) => setErrors(errors => ({ ...errors, [field]: value }))

  const handleErrors = (errors) => {
    setPassword('')
    setPasswor2('')
    setTimeout(() => setErrors(errors), 0)
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
    if (Object.values(errors).find(x => !!x)) return

    // Emailben kapott kód beírása
    if (step === 0) {
      const data = await sendVerificationCode(email)
      if (data.errors) return setErrors(data.errors)
      
      startNewCodeTimer()
      return setStep(step + 1)
    }

    // Felhasználónév és jelszó megadása
    if (step === 1) {
      const data = await verifyEmail(email, code.join(''))
      if (data.errors) return setErrors(data.errors)

      setEmailId(data.emailId)
      return setStep(step + 1)
    }

    // Regisztráció
    if (step === 2) {
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
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} validation={true} />
        </>
        : step === 1 ?
        <>
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} disabled={true} />
          <Code value={code} setValue={setCode} error={errors.code} setError={(e) => setError('code', e)} />
        </>
        :
        <>
          <Username value={username} setValue={setUsername} error={errors.username} setError={(e) => setError('username', e)} validation={true} />
          <Password name='pass1' type='pwc' value={password} value2={passwor2} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} setError2={(e) => setError('passwor2', e)} reset={props.active} />
          <Password label='Jelszó újra' name='pass2' type='pc' value={passwor2} value2={password} setValue={setPasswor2} error={errors.passwor2} setError={(e) => setError('passwor2', e)} reset={props.active} />
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

        <Button onClick={nextStep} text='lg' className='mt-4 lg:mt-16' disabled={Object.values(errors).find(x => !!x)}>{step === 2 ? 'Regisztráció befejezése' : 'Tovább'}</Button>
        <button onClick={() => props.setActive(1)} className='inline lg:hidden mt-2.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
        <button onClick={() => props.setActive(0)} className='inline lg:hidden mt-0.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Vissza a főoldalra</button>
      </div>
      
      {msg === '' ? <></> : <SuccessMsg msg={msg} text={text} />}
    </div>
  )
}