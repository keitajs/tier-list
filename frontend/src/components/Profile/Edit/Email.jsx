import { useEffect, useState, useRef } from 'react'
import { updateEmail, sendVerificationCode, verifyEmail } from '../../../user'
import Email from '../../ui/Email'
import Code from '../../ui/Code'
import Password from '../../ui/Password'
import Button from '../../ui/Button'

export default function EmailForm({ hide, currentEmail, setUser, setEdit }) {
  const [step, setStep] = useState(0)

  const [email, setEmail] = useState('')
  const [code, setCode] = useState(new Array(6).fill(''))
  const [password, setPassword] = useState('')

  const [newCode, setNewCode] = useState(0)
  const newCodeRef = useRef(null)

  const [errors, setErrors] = useState({})
  const setError = (field, value) => setErrors(errors => ({ ...errors, [field]: value }))

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
      return setStep(step + 1)
    }

    // Kód hitelesítése és email módosítása
    if (step === 1) {
      const data = await verifyEmail(email, code.join(''))
      if (data.errors) return setErrors(data.errors)

      const result = await updateEmail(data.emailId, password)
      if (result.errors) return setErrors(result.errors)

      setEdit(null)
      setUser(user => {
        user.email = email
        return { ...user }
      })
    }
  }

  useEffect(() => {
    if (email === currentEmail) setError('email', 'Jelenleg is ez az email címed!')
  }, [email, currentEmail])

  // Megjelenéskor mezők ürítése
  useEffect(() => {
    if (!hide) {
      setStep(0)
      setEmail('')
      setCode(new Array(6).fill(''))
      setPassword('')
      setError('code', '')
      setError('password', '')
    }
  }, [hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Email módosítás
        </div>

        {step === 0 ?
        <>
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} validation={true} />
        </>
        :
        <>
          <Email value={email} setValue={setEmail} error={errors.email} setError={(e) => setError('email', e)} disabled={true} />
          <Code value={code} setValue={setCode} error={errors.code} setError={(e) => setError('code', e)} />
          <Password value={password} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} />
        </>}

        <p className='w-64 mt-6 opacity-60 text-sm'>
          <b>Tipp: </b>
          {step === 0 ?
          <>
            Add meg az új email címed, amire küldeni fogjuk a hitelesítő kódot.
          </>
          :
          <>
            A megadott címre küldtünk egy hitelesítő kódot.
            Ha nem kaptad meg, 
            {" "}{newCode === 0 ? <b onClick={getNewCode} className='cursor-pointer hover:underline'>ide kattintva</b> : <><b>{newCode}</b> másodperc múlva</>}{" "}
            kérhetsz egy újat.
          </>
          }
        </p>

        <div className='flex gap-2 mt-7'>
          <Button onClick={nextStep} color={step !== 0 && 'success'} disabled={Object.values(errors).find(x => !!x)}>{step === 0 ? 'Tovább' : 'Módosítás'}</Button>
          <Button onClick={() => setEdit(null)} color='danger'>Mégsem</Button>
        </div>
      </div>
    </div>
  )
}