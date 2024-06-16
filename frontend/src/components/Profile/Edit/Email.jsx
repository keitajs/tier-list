import { useEffect, useState, useRef } from 'react'
import { updateEmail, sendVerificationCode, verifyEmail } from '../../../user'
import Email from '../../ui/Email'
import Code from '../../ui/Code'
import Password from '../../ui/Password'

export default function EmailForm(props) {
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

      props.setEdit(null)
      props.setUser(user => {
        user.email = email
        return { ...user }
      })
    }
  }

  // Jelenlegi email címmel való megegyezés ellenőrzése
  useEffect(() => {
    if (email === props.user.email) setError('email', 'Jelenleg is ez az email címed!')
  }, [email])

  // Megjelenéskor mezők ürítése
  useEffect(() => {
    if (!props.hide) {
      setStep(0)
      setEmail('')
      setCode(new Array(6).fill(''))
      setPassword('')
      setError('code', '')
      setError('password', '')
    }
  }, [props.hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${props.hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
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

        <div className='flex gap-2 mt-8'>
          <button onClick={nextStep} className={`w-full py-1.5 rounded-lg ${step === 0 ? 'bg-blue-500' : 'bg-emerald-600'} ${!Object.values(errors).find(x => !!x) ? (step === 0 ? 'hover:bg-blue-400' : 'hover:bg-emerald-500') : 'cursor-not-allowed'} transition-colors`}>{step === 0 ? 'Tovább' : 'Módosítás'}</button>
          <button onClick={() => props.setEdit(null)} className='w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}