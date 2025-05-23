import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { socket } from '../../socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrash, faXmark, faFileArrowUp, faFileExcel } from '@fortawesome/free-solid-svg-icons'

function UpdateCharacter(props) {
  const [name, setName] = useState(props.character.name)
  const [url, setUrl] = useState(props.character?.url ? props.character.url : '')
  const [image, setImage] = useState(props.character.image.startsWith('http') ? props.character.image : `${axios.defaults.baseURL}/characters/images/${props.character.image}`)
  const [title, setTitle] = useState(props?.anime?.title ? props.anime.title : '')
  const [animeUrl, setAnimeUrl] = useState(props?.anime?.url ? props.anime.url : '')
  const [active, setActive] = useState(true)
  const [file, setFile] = useState('')
  const fileInput = useRef(null)

  const [errors, setErrors] = useState({})

  // Karakter módosítás
  const updateCharacter = async () => {
    if (Object.values(errors).find(x => !!x)) return

    try {
      const formData = new FormData()
      formData.append('character', JSON.stringify({ name, url }))
      formData.append('anime', JSON.stringify({ title, url: animeUrl }))
      formData.append('image', image)

      const { data } = await axios.patch(`/lists/${props.selectedList}/characters/${props.id}/update`, formData)

      props.setItems(items => {
        const item = items.find(x => x.id === props.id)
        item.name = name
        item.url = url
        item.image = data.image
        item.anime = data.anime
        return items.slice()
      })
      props.setEdit(false)

      socket.emit('character-update', { id: props.id, name, url, ...data })
    } catch (err) {
      if (err?.response?.data) return setErrors(errors => ({ ...errors, image: err.response.data.message }))
      alert('Server error')
      console.log(err)
    }
  }

  // Karakter törlés
  const removeCharacter = async () => {
    try {
      await axios.delete(`/lists/${props.selectedList}/characters/${parseInt(props.id)}/remove`)

      props.setItems(items => {
        items.splice(items.findIndex(item => item.id === props.id), 1)
        return items.slice()
      })

      socket.emit('character-delete', props.id)
    } catch (err) {
      if (err.response.data.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  // Képfeltöltés és törlés
  const fileUpload = () => {
    if (file) {
      setFile('')
      setImage('')
    } else {
      fileInput.current.click()
    }
  }

  // Hibák kezelése
  const handleErrors = (object, options) => {
    const keys = Object.keys(object)
    const key = keys[0]
    const value = object[key]

    if (options?.allowEmpty && !value) return setErrors(errors => { return {...errors, [key]: '' } })
    if (!value) return setErrors(errors => { return {...errors, [key]: 'Üres mező!' } })
    if (options?.url) try { new URL(value) } catch { return setErrors(errors => { return {...errors, [key]: 'Nem megfelelő URL formátum!' } })}
    if (!options?.image) setErrors(errors => { return {...errors, [key]: '' } })
  }

  const onImageLoad = (e) => {
    if (!file && !image || errors.image === 'Nincs fájl feltöltve!' || errors.image === 'A fájl nagyobb mint 5 MB!' || errors.image === 'A fájl nem kép!') return
    setErrors(errors => ({...errors, image: '' }))
  }

  const onImageError = (e) => {
    if (!image) return
    setErrors(errors => ({...errors, image: "Az URL-en nincs elérhető kép!" }))
  }

  useEffect(() => handleErrors({ name }), [name])
  useEffect(() => handleErrors({ url }, { url: true, allowEmpty: true }), [url])
  useEffect(() => handleErrors({ image }, { image: true }), [image])
  useEffect(() => handleErrors({ animeUrl }, { url: true, allowEmpty: true }), [animeUrl])

  return (
    <div className='flex flex-col justify-between h-full py-0.5'>
      <div>
        {active ? 
        <div className='flex flex-col gap-1'>
          <div className='relative flex flex-col w-5/6'>
            <input type="text" value={name} placeholder='Név' onChange={e => setName(e.target.value)} className='w-full px-2 py-0.5 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className={`absolute top-0 bottom-0 right-2 flex items-center text-xl text-rose-600 ${errors.name ? 'opacity-100' : 'opacity-0'} transition-opacity`}><FontAwesomeIcon icon={faXmark} /></div>
          </div>

          <div className='relative flex flex-col w-5/6'>
            <input type="text" value={url} placeholder='URL' onChange={e => setUrl(e.target.value)} className='w-full px-2 py-0.5 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className={`absolute top-0 bottom-0 right-2 flex items-center text-xl text-rose-600 ${errors.url ? 'opacity-100' : 'opacity-0'} transition-opacity`}><FontAwesomeIcon icon={faXmark} /></div>
          </div>

          <div className='flex flex-col w-5/6'>
            <div className='relative flex items-center'>
              <img src={file ? URL.createObjectURL(image) : image} onLoad={onImageLoad} onError={onImageError} alt="" className='hidden' />

              <input type="text" value={file ? image.name : image} placeholder='Kép' onChange={e => setImage(e.target.value)} disabled={file} className='w-full px-2 py-0.5 pr-9 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
              <input type="file" ref={fileInput} value={file} onChange={(e) => {setFile(e.target.value); setImage(e.target.files[0])}} accept='.jpg, .jpeg, .png, .webp, .avif, .gif, .svg' className='hidden' />
              
              <div className={`absolute top-0 bottom-0 right-8 flex items-center text-xl text-rose-600 ${errors.image ? 'opacity-100' : 'opacity-0'} transition-opacity`}><FontAwesomeIcon icon={faXmark} /></div>
              
              <button onClick={fileUpload} className='absolute right-0 h-full aspect-square flex items-center justify-center rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors'>
                <FontAwesomeIcon icon={file ? faFileExcel : faFileArrowUp} />
              </button>
            </div>
          </div>

          <div className='absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center tracking-wider text-sm'><div className='rotate-90'>Karakter</div></div>
        </div>
        : 
        <div className='flex flex-col gap-1'>
          <div className='relative flex flex-col w-5/6'>
            <input type="text" value={title} placeholder='Cím' onChange={e => setTitle(e.target.value)} className='w-full px-2 py-0.5 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className={`absolute top-0 bottom-0 right-2 flex items-center text-xl text-rose-600 ${errors.title ? 'opacity-100' : 'opacity-0'} transition-opacity`}><FontAwesomeIcon icon={faXmark} /></div>
          </div>

          <div className='relative flex flex-col w-5/6'>
            <input type="text" value={animeUrl} placeholder='URL' onChange={e => setAnimeUrl(e.target.value)} className='w-full px-2 py-0.5 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
            <div className={`absolute top-0 bottom-0 right-2 flex items-center text-xl text-rose-600 ${errors.animeUrl ? 'opacity-100' : 'opacity-0'} transition-opacity`}><FontAwesomeIcon icon={faXmark} /></div>
          </div>

          <div className='absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center tracking-wider text-sm'><div className='rotate-90'>Anime</div></div>
        </div>
        }
      </div>
      
      <div className='flex justify-between'>
        <div className='flex gap-0.5'>
          <button onClick={updateCharacter} className='flex items-center w-5 max-w-max hover:w-32 overflow-hidden text-emerald-600/50 hover:text-emerald-500/75 transition-all'>
            <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faSave} className='w-5 h-5' /></div>
            <div className='text-xs ml-0.5'>Mentés</div>
          </button>
          <button onClick={removeCharacter} className='flex items-center w-5 max-w-max hover:w-32 overflow-hidden text-rose-600/50 hover:text-rose-500/75 transition-all'>
            <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faTrash} className='w-5 h-4' /></div>
            <div className='text-xs'>Törlés</div>
          </button>
        </div>

        <div className='relative flex w-32 text-sm rounded-md bg-neutral-700'>
          <div className={`absolute ${active ? 'left-0' : 'left-1/2'} w-1/2 h-full rounded-lg bg-blue-500 transition-all`}></div>
          <button onClick={() => setActive(true)} className={`z-10 w-1/2 rounded-md hover:bg-neutral ${!active ? 'hover:bg-neutral-600/60' : ''} transition-all`}>Karakter</button>
          <button onClick={() => setActive(false)} className={`z-10 w-1/2 rounded-md hover:bg-neutral ${active ? 'hover:bg-neutral-600/60' : ''} transition-all`}>Anime</button>
        </div>
      </div>

      <button onClick={() => props.setEdit(false)} className='absolute top-1 right-2 text-rose-600/50 hover:text-rose-500/75 transition-all'>
        <FontAwesomeIcon icon={faXmark} className='h-6' />
      </button>
    </div>
  )
}

export default UpdateCharacter