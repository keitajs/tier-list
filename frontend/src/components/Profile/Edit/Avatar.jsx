import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { updateAvatar, deleteAvatar } from '../../../user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp, faFileExcel, faTrash } from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'

export default function AvatarForm({ hide, avatar, setUser, setEdit }) {
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const fileInput = useRef(null)

  // Profilkép módosítás / eltávolítása
  const update = async (remove) => {
    if (!remove && (!file || !image)) return

    const result = (remove ? await deleteAvatar() : await updateAvatar(image))
    if (result.errors) return setError(result.errors?.avatar)

    setEdit(null)
    setUser(user => {
      user.avatar = result.file
      return { ...user }
    })
  }

  const remove = async () => await update(true)

  // Képfeltöltés és törlés
  const fileUpload = () => {
    if (file) {
      setImage(avatar)
      setFile('')
    } else {
      fileInput.current.click()
    }
  }

  // Megjelenéskor mezők ürítése
  useEffect(() => {
    if (!hide) {
      setFile('')
      setImage(avatar)
      setError('')
    }
  }, [hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Profilkép módosítás
        </div>

        <div className='relative flex items-center justify-center w-64 h-auto aspect-square rounded-xl bg-neutral-700/50 overflow-hidden'>
          <img src={file ? URL.createObjectURL(image) : image ? `${axios.defaults.baseURL}/user/images/${image}` : ''} alt="" className={`w-full h-full object-cover ${!image ? 'opacity-0' : 'opacity-100'}`} />
        </div>

        <div className='flex flex-col gap-2 text-lg mt-2.5'>
          <input type="file" ref={fileInput} value={file} onChange={(e) => {setFile(e.target.value); setImage(e.target.files[0])}} accept='.jpg, .jpeg, .png, .webp, .avif, .gif, .svg' className='hidden' />
          <Button onClick={fileUpload} color={'bg-neutral-700'} hover={'hover:bg-neutral-600'}>
            <div className='flex items-center justify-between gap-3 w-full px-3.5'>
              Feltöltés {file ? 'törlése' : ''}
              <FontAwesomeIcon icon={file ? faFileExcel : faFileArrowUp} />
            </div>
          </Button>

          <Button onClick={remove} color={'bg-neutral-700'} hover={'hover:bg-rose-700'}>
            <div className='flex items-center justify-between gap-3 w-full px-3.5'>
              Törlés
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </Button>
        </div>

        {error ? <p className='w-64 mt-4 text-center text-rose-600'>{error}</p> : <></>}

        <div className='flex gap-2 mt-5'>
          <Button onClick={update} color='success' disabled={!file || !image || error}>Módosítás</Button>
          <Button onClick={() => setEdit(null)} color='danger'>Mégsem</Button>
        </div>
      </div>
    </div>
  )
}