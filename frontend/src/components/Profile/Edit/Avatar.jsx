import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { updateAvatar, deleteAvatar } from '../../../user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp, faFileExcel, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function AvatarForm({ hide, avatar, setUser, setEdit }) {
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const fileInput = useRef(null)

  // Profilkép módosítás / eltávolítása
  const update = async ({ remove }) => {
    if (!remove && (!file || !image)) return

    const result = (remove ? await deleteAvatar() : await updateAvatar(image))
    if (result.errors) return setError(result.errors?.avatar)

    setEdit(null)
    setUser(user => {
      user.avatar = result.file
      return { ...user }
    })
  }

  const remove = () => update({ remove: true })

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
          <button onClick={fileUpload} className='flex items-center justify-between gap-3 w-64 px-3.5 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors'>
            Feltöltés {file ? 'törlése' : ''} <FontAwesomeIcon icon={file ? faFileExcel : faFileArrowUp} />
          </button>

          <button onClick={remove} className='flex items-center justify-between gap-3 w-64 px-3.5 py-1.5 rounded-lg bg-neutral-700 hover:bg-rose-700 transition-colors'>
            Törlés <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>

        {error ? <p className='w-64 mt-4 text-center text-rose-600'>{error}</p> : <></>}

        <div className='flex gap-2 mt-5'>
          <button onClick={update} className='w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => setEdit(null)} className='w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}