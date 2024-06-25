import { useRef, useState, useEffect } from 'react'
import { register, sendVerificationCode, verifyEmail } from '../../user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Email from '../ui/Email'
import Code from '../ui/Code'
import Username from '../ui/Username'
import Password from '../ui/Password'
import Button from '../ui/Button'
import SuccessMsg from './SuccessMsg'

export default function Register({ active, setActive }) {
  const [step, setStep] = useState(0)
  const [msg, setMsg] = useState('')
  const [text, setText] = useState('')

  const [email, setEmail] = useState('')
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
    setTimeout(() => setErrors(e => ({ ...e, ...errors })), 0)
  }

  const hasErrors = () => {
    let error = false

    Object.keys(errors).forEach(key => {
      if (key === 'message') return
      if (errors[key]) error = true
    })

    return error
  }

  const getNewCode = async () => {
    const data = await sendVerificationCode(email)
    if (data.errors) return console.log(data.errors)

    startNewCodeTimer()
  }

  const startNewCodeTimer = () => {
    if (newCodeRef.current !== null) clearInterval(newCodeRef.current)
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

  const backStep = async (s) => {
    if (s >= step) return
    const newStep = s && step - 1

    setErrors({})
    setStep(newStep)
    if (newStep !== 0) setEmail('')
    setCode(new Array(6).fill(''))
    setUsername('')
    setPassword('')
    setPasswor2('')
  }

  const nextStep = async () => {
    if (hasErrors()) return

    // Emailben kapott kód beírása
    if (step === 0) {
      const data = await sendVerificationCode(email)
      if (data.errors) return setErrors(data.errors)
      
      startNewCodeTimer()
      return setStep(1)
    }

    // Felhasználónév és jelszó megadása
    if (step === 1) {
      const data = await verifyEmail(email, code.join(''))
      if (data.errors) return setErrors(data.errors)

      return setStep(2)
    }

    // Regisztráció
    if (step === 2) {
      const data = await register(username, password)
      if (data.errors) return handleErrors(data.errors)

      setMsg(data.message)
      setText('Másodperceken belül átirányítunk a bejelentkezéshez')
      setTimeout(() => setActive(1), 2500)
    }
  }

  useEffect(() => {
    if (active) {
      setMsg('')
      setText('')
      setEmail('')
      backStep(0)
    }
  }, [active])

  return (
    <div className={`absolute flex flex-col items-center mr-0 lg:mr-12 px-12 py-12 lg:py-16 rounded-3xl bg-neutral-900/50 ${active ? '' : 'opacity-0 pointer-events-none select-none translate-y-4'} transition-all`}>
      <h3 className='text-center text-3xl font-bold tracking-wide w-full lg:w-72 pb-2 mb-2 lg:mb-10 border-b-[3px] border-blue-500'>REGISZTRÁCIÓ</h3>

      <div className="form flex flex-col items-center max-w-64">
        {step === 0 ?
        <>
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} validation={true} />
        </>
        : step === 1 ?
        <>
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} disabled={true} className='pr-12'>
            <button onClick={backStep} className='flex items-center justify-center absolute top-0 right-0 h-full w-auto aspect-square rounded-e-lg bg-neutral-600 hover:bg-neutral-500 transition-colors'>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </Email>
          <Code value={code} setValue={setCode} error={errors.code} setError={(e) => setError('code', e)} className='mt-1.5 lg:mt-6' />
        </>
        :
        <>
          <Username value={username} setValue={setUsername} error={errors.username} setError={(e) => setError('username', e)} validation={true} />
          <Password name='pass1' type='pwc' value={password} value2={passwor2} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} setError2={(e) => setError('passwor2', e)} reset={active} margin='mt-1.5 lg:mt-6' />
          <Password label='Jelszó újra' name='pass2' type='pc' value={passwor2} value2={password} setValue={setPasswor2} error={errors.passwor2} setError={(e) => setError('passwor2', e)} reset={active} margin='mt-1.5 lg:mt-6' />
        </>}

        {errors?.message ? 
          <p className='mt-6 text-sm text-rose-600'>
            {errors.message}
          </p>
        :
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
        }

        <Button onClick={nextStep} text='lg' className='mt-4 lg:mt-16' disabled={hasErrors()}>{step === 2 ? 'Regisztráció befejezése' : 'Tovább'}</Button>
        <button onClick={() => setActive(1)} className='inline lg:hidden mt-2.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Már van felhasználód? Jelentkezz be itt.</button>
        <button onClick={() => setActive(0)} className='inline lg:hidden mt-0.5 text-sm opacity-60 hover:opacity-75 transition-opacity'>Vissza a főoldalra</button>
      </div>
      
      {msg === '' ? <></> : <SuccessMsg msg={msg} text={text} />}
    </div>
  )
}