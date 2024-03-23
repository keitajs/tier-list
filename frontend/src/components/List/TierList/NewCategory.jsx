import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function NewCategory(props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [errors, setErrors] = useState({})

  const createCategory = async () => {
    if (Object.values(errors).find(x => !!x)) return

    try {
      const { data } = await axios.post(`http://localhost:2000/lists/${props.selectedList}/categories/create`, { name, color })

      props.setCategories(categories => [...categories, data])
      props.setShow(false)
    } catch (err) {
      if (err?.response?.data?.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  const isLight = (color) => {
    const c = color.substring(1)
    const rgb = parseInt(c, 16)
    const red = (rgb >> 16) & 0xff
    const green = (rgb >>  8) & 0xff
    const blue = (rgb >>  0) & 0xff
    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    return luma < 150
  }

  useEffect(() => {
    if (!name) return setErrors(errors => { return {...errors, name: 'Üres mező!' } })
    setErrors(errors => { return {...errors, name: false } })
  }, [name])

  useEffect(() => {
    setName('')
    setColor('#3b82f6')
  }, [props.show])

  return (
    <div className={`z-40 fixed inset-0 flex items-center justify-center bg-neutral-950/50 ${props.show ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-all`}>
      <div className='p-4 rounded-2xl bg-neutral-800'>
        <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          <div className='text-xl'>Új kategória</div>
        </div>

        <div className='flex gap-4'>
          <div className='flex flex-col justify-between gap-4'>
            <div className={`flex items-center justify-center w-36 aspect-square rounded-xl text-base overflow-hidden ${isLight(color) ? 'text-white' : 'text-black'}`} style={{background: color}}>{name}</div>
            <div className='flex flex-col gap-2'>
              <button onClick={createCategory} className='py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors'>Létrehozás</button>
              <button onClick={() => props.setShow(false)} className='py-1 rounded-lg bg-rose-600 hover:bg-rose-500 transition-colors'>Mégsem</button>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='relative flex flex-col gap-2 rounded-xl p-2.5 pt-2 pr-32 text-lg bg-neutral-900/35'>
              <div className='flex flex-col'>
                <label htmlFor="name" className='ml-1'>Cím <span id='required' className='text-rose-600'>*</span> <span className='text-base ml-0.5 text-rose-600'>{errors.name}</span></label>
                <div className='relative'>
                  <input type="text" value={name} maxLength={32} onChange={e => setName(e.target.value)} name='name' id='name' className='w-72 px-2 py-1 pr-8 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 outline-none' />
                  <div className='absolute top-1/2 right-2 -translate-y-1/2 flex items-center'><FontAwesomeIcon icon={errors.name ? faXmark : faCheck} className={errors.name ? 'text-rose-500 h-5 input-error-anim' : 'text-emerald-500 h-5 input-check-anim'} /></div>
                </div>
              </div>

              <div className='flex flex-col'>
                <label htmlFor="color" className='ml-1'>Szín <span id='required' className='text-rose-600'>*</span></label>
                <div className='w-72 h-7 text-base placeholder:text-white/25 rounded-lg bg-neutral-700/50 overflow-hidden'>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} name='color' id='color' className='w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 outline-none' />
                </div>
              </div>

              <div className='absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center tracking-wider'><div className='rotate-90'>Kategória</div></div>
            </div>
          </div>

          <Tooltip anchorSelect='#required' place='right' className='!text-sm !rounded-lg !bg-neutral-950'>Kötelező mező</Tooltip>
        </div>
      </div>
    </div>
  )
}

export default NewCategory