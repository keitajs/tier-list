import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp, faFileExcel } from '@fortawesome/free-solid-svg-icons'

function Avatar(props) {
  const [file, setFile] = useState('')
  const [image, setImage] = useState('')
  const fileInput = useRef(null)

  const update = async() => {
    if (!file || !image) return

    try {
      const formData = new FormData()
      formData.append('avatar', image)

      const { data } = await axios.patch('http://localhost:2000/user/avatar', formData)

      props.setEdit(null)
      props.setUser(user => {
        user.avatar = data.file
        return user
      })
    } catch (err) {
      if (err?.response?.data?.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  const fileUpload = () => {
    if (file) {
      setImage('')
      setFile('')
    } else {
      fileInput.current.click()
    }
  }

  useEffect(() => {
    if (!props.hide) {
      setFile('')
      setImage('')
    }
  }, [props.hide])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/60 ${props.hide ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-center mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Profilkép módosítás
        </div>

        <div className='relative flex items-center justify-center w-64 aspect-square rounded-xl bg-neutral-700/50 overflow-hidden'>
          <img src={file ? URL.createObjectURL(image) : image} alt="" className={`w-full h-full object-cover ${!image ? 'opacity-0' : 'opacity-100'}`} />
        </div>

        <div className='flex flex-col text-lg mt-2.5'>
          <input type="file" ref={fileInput} value={file} onChange={(e) => {setFile(e.target.value); setImage(e.target.files[0])}} accept='.jpg, .jpeg, .png, .webp, .avif, .gif, .svg' className='hidden' />
          <button onClick={fileUpload} className='flex items-center justify-between gap-3 px-2.5 py-0.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors'>
            Feltöltés <FontAwesomeIcon icon={file ? faFileExcel : faFileArrowUp} />
          </button>
        </div>

        <div className='flex gap-2 mt-5'>
          <button onClick={update} className='w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Módosítás</button>
          <button onClick={() => props.setEdit(null)} className='w-full py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
        </div>
      </div>
    </div>
  )
}

export default Avatar