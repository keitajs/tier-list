import { useEffect, useState } from 'react'
import { updatePassword } from '../../../user'
import Password from '../../ui/Password'
import Button from '../../ui/Button'

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
        <div className='flex items-center justify-center px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jelszó módosítás
        </div>

        <Password name='pass1' type={'pwc'} value={password} value2={passwor2} setValue={setPassword} error={errors.password} setError={(e) => setError('password', e)} setError2={(e) => setError('passwor2', e)} reset={hide} mainClass={'mt-6'} />
        <Password label='Jelszó újra' name={'pass2'} type={'pc'} value={passwor2} value2={password} setValue={setPasswor2} error={errors.passwor2} setError={(e) => setError('passwor2', e)} reset={hide} mainClass={'mt-6'} />
        <Password label='Jelenlegi jelszó' value={currentPassword} setValue={setCurrentPassword} error={errors.currentPassword} setError={(e) => setError('currentPassword', e)} reset={hide} mainClass={'mt-6'} />

        <div className='flex gap-2 mt-7'>
          <Button onClick={update} color='success' disabled={Object.values(errors).find(x => !!x)}>Módosítás</Button>
          <Button onClick={() => setEdit(null)} color='danger'>Mégsem</Button>
        </div>
      </div>
    </div>
  )
}