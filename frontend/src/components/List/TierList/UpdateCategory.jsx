import React, { useState } from 'react'
import axios from 'axios'
import { socket } from '../../../socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'

function UpdateCategory(props) {
  const [name, setName] = useState(props.name)
  const [color, setColor] = useState(props.color)

  const updateCategory = async () => {
    if (!name) return

    try {
      await axios.patch(`/lists/${props.selectedList}/categories/${parseInt(props.id)}/update`, { name, color })

      props.setEdit(false)
      props.setCategories(categories => {
        const category = categories.find(category => category.id === props.id)
        category.name = name
        category.color = color
        return categories.slice()
      })

      socket.emit('category-update', { id: props.id, name, color })
    } catch (err) {
      if (err?.response?.data?.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  const removeCategory = async () => {
    try {
      await axios.delete(`/lists/${props.selectedList}/categories/${parseInt(props.id)}/remove`)

      props.setCategories(categories => {
        categories.splice(categories.findIndex(category => category.id === props.id), 1)
        return categories.slice()
      })

      socket.emit('category-delete', props.id)
    } catch (err) {
      if (err?.response?.data?.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  return (
    <div className='flex flex-col justify-between h-full py-2.5 bg-neutral-900'>
      <div className='mx-2'>
        <input type="text" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} className='w-full px-2 py-1 rounded-md bg-neutral-800 outline-none' />
      </div>
      <div className='overflow-hidden h-8 mx-2 rounded-md'>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className='w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4' />
      </div>
      <div className='flex items-center px-2 overflow-hidden'>
        <button onClick={updateCategory} className='flex items-center w-5 max-w-max hover:w-32 overflow-hidden text-emerald-600/50 hover:text-emerald-500/75 transition-all'>
          <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faSave} className='w-5 h-5' /></div>
          <div className='text-xs ml-0.5'>Mentés</div>
        </button>
        <button onClick={removeCategory} className='flex items-center w-5 max-w-max hover:w-32 overflow-hidden text-rose-600/50 hover:text-rose-500/75 transition-all'>
          <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faTrash} className='w-5 h-4' /></div>
          <div className='text-xs'>Törlés</div>
        </button>
        <button onClick={() => props.setEdit(false)} className='absolute right-2 flex items-center w-5 justify-end ml-auto max-w-max hover:w-32 overflow-hidden text-rose-600/50 hover:text-rose-500/75 transition-all'>
          <div className='text-xs'>Mégsem</div>
          <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faXmark} className='w-5 h-5' /></div>
        </button>
      </div>
    </div>
  )
}

export default UpdateCategory