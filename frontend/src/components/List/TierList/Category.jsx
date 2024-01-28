import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSave, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import Item from './Item'

function Category(props) {
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: props.id,
    data: { type: "Category", category: { id: props.id, name: props.name, color: props.color } }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  const itemIds = useMemo(() => props.items.map(item => item.id), [props.items])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [edit, setEdit] = useState(false)

  const updateCategory = async () => {
    try {
      await axios.patch(`http://localhost:2000/lists/${props.selectedList}/categories/${parseInt(props.id)}/update`, { name, color })

      setEdit(false)
      props.setCategories(categories => {
        const category = categories.find(category => category.id === props.id)
        category.name = name
        category.color = color
        return categories.slice()
      })
    } catch (err) {
      if (err.response.data.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  const removeCategory = async () => {
    try {
      await axios.delete(`http://localhost:2000/lists/${props.selectedList}/categories/${parseInt(props.id)}/remove`)

      props.setCategories(categories => {
        categories.splice(categories.findIndex(category => category.id === props.id), 1)
        return categories.slice()
      })
    } catch (err) {
      if (err.response.data.message) return alert(err.response.data.message)
      alert('Server error')
      console.log(err)
    }
  }

  useEffect(() => {
    if (edit) {
      setName(props.name)
      setColor(props.color)
    }
  }, [edit, props.name, props.color])

  return (
    <div ref={props.permission?.move ? setNodeRef : null} className={`group/category flex my-1 rounded-2xl odd:bg-neutral-900/85 even:bg-neutral-900/100 ${props.permission?.move && isDragging ? 'cursor-grabbing opacity-25' : 'cursor-auto'}`} style={style}>
      <div {...attributes} {...listeners} className='relative cursor-grab lg:w-8 w-6 lg:min-w-8 min-w-6 lg:max-w-8 max-w-6 lg:min-h-32 md:min-h-28 min-h-24 rounded-s-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors after:content-[""] after:absolute after:top-1/4 lg:after:left-2.5 after:left-2 after:h-1/2 after:w-[1px] after:bg-neutral-300 before:content-[""] before:absolute before:top-1/4 lg:before:right-2.5 before:right-2 before:h-1/2 before:w-[1px] before:bg-neutral-300'></div>
      <div className='relative flex items-center justify-center lg:w-32 md:w-28 w-24 lg:min-w-32 md:min-w-28 min-w-24 lg:max-w-32 md:max-w-28 max-w-24 lg:min-h-32 md:min-h-28 min-h-24 bg-[--color]' style={{'--color': props.color}}>
        {edit ? <>
          <div className='flex flex-col justify-between h-full py-2.5 bg-neutral-900'>
            <div className='mx-2'>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full px-2 py-1 rounded-md bg-neutral-800 outline-none' />
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
              <button onClick={() => setEdit(false)} className='absolute right-2 flex items-center w-5 justify-end ml-auto max-w-max hover:w-32 overflow-hidden text-rose-600/50 hover:text-rose-500/75 transition-all'>
                <div className='text-xs'>Mégsem</div>
                <div className='flex items-center justify-center w-5'><FontAwesomeIcon icon={faXmark} className='w-5 h-5' /></div>
              </button>
            </div>
          </div>
        </> : <>
          {props.name}
          {props.permission?.edit ? <FontAwesomeIcon icon={faEdit} onClick={() => setEdit(true)} className='cursor-pointer absolute top-2 right-2 opacity-0 group-hover/category:opacity-40 hover:!opacity-100 transition-opacity' /> : <></>}
        </>}
      </div>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} permission={props.permission} id={item.id} character={{ name: item.name, url: item.url, img: item.image }} anime={{ id: item.anime.id, title: item.anime.title, url: item.anime.url }} selectedList={props.selectedList} setItems={props.setItems} />)}
        </SortableContext>
      </div>
    </div>
  )
}

export default Category