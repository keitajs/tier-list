import { useEffect, useState } from 'react'
import { updatePassword } from '../../../user'
import Password from '../../ui/Password'

export default function PasswordForm({ hide, setEdit }) {
  const [password, setPassword] = useState('')
  const [passwor2, setPasswor2] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const [errors, setErrors] = useState({})
  const setError = (field, value) => setErrors(errors => ({ ...errors, [field]: value }))

  // Jelszó módosítás
  const update = async () => {
    if (Object.values(errors).find(x => !!x)) return

    const result = await updatePassword(password, currentPassword)
    if (result.errors) return setErrors(result.errors)

    setEdit(null)
  }

  // Megjelenéskor mezők ürítése
  useEffect(() => {
    if (!hide) {
      setPassword('')
      setPasswor2('')
      setCurrentPassword('')
    }
  }, [hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jelszó módosítás
        </div>

        <Password name='pass1' type={'pwc'} value={password} value2={passwor2} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} setError2={(e) => setError('passwor2', e)} reset={hide} />
        <Password label='Jelszó újra' name={'pass2'} type={'pc'} value={passwor2} value2={password} setValue={setPasswor2} error={errors.passwor2} setError={(e) => setError('passwor2', e)} reset={hide} />
        <Password label='Jelenlegi jelszó' value={currentPassword} setValue={setCurrentPassword} error={errors.currentPassword} setError={(e) => setError('currentPassword', e)} reset={hide} />

        <div className='flex gap-2 mt-7'>
          <button onClick={update} className='w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => setEdit(null)} className='w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}