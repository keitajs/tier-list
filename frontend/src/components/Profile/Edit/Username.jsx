import { useEffect, useState } from 'react'
import { updateUsername } from '../../../user'
import Username from '../../ui/Username'
import Button from '../../ui/Button'

export default function UsernameForm({ hide, currentUsername, setUser, setEdit }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  // Felhasználónév módosítás
  const update = async () => {
    if (error) return

    const result = await updateUsername(username)
    if (result.errors) return setError(result.errors?.username)

    setEdit(null)
    setUser(user => {
      user.username = username
      return { ...user }
    })
  }

  // Input mező változásának kezelése
  useEffect(() => {
    if (username === currentUsername) return setError('Jelenleg is ez a neved!')
  }, [username, currentUsername])

  // Megjelenéskor mezők ürítése
  useEffect(() => {
    if (!hide) setUsername('')
  }, [hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Felhasználónév módosítás
        </div>

        <Username label='Új felhasználónév' value={username} setValue={setUsername} error={error} setError={setError} validation={true} />

        <div className='flex gap-2 mt-7'>
          <Button onClick={update} color='success' disabled={error}>Módosítás</Button>
          <Button onClick={() => setEdit(null)} color='danger'>Mégsem</Button>
        </div>
      </div>
    </div>
  )
}