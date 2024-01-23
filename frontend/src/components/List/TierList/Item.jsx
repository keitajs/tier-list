import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faArrowUpRightFromSquare, faEdit, faTrash, faClose } from '@fortawesome/free-solid-svg-icons'

function Item(props) {
  const [opened, setOpened] = useState(false)
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: props.id,
    data: { type: "Item", item: { id: props.id, character: props.character, anime: props.anime } },
    disabled: opened
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  const openItem = (e) => {
    if (!isDragging && ((e === 'context' && !isMobile) || (e === 'onclick' && isMobile))) return setOpened(!opened)
  }

  return (
    <div ref={setNodeRef} className='flex rounded-2xl overflow-hidden' style={style}>
      <div {...attributes} {...listeners} onClick={() => openItem('onclick')} onContextMenu={() => openItem('context')} className={`flex items-center justify-center lg:h-32 md:h-28 h-24 aspect-[3/4] ml-0.5 overflow-hidden relative after:content-[""] after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-transparent hover:after:border-neutral-400 after:transition-all ${isDragging ? 'cursor-grabbing opacity-50' : 'cursor-grab'} ${opened || isDragging ? 'hover:after:border-transparent rounded-s-2xl' : 'rounded-2xl'} transition-all`}>
        <img src={props.character.img} alt="" className='w-full h-full object-cover' />
      </div>
      <div className={`relative flex flex-col justify-between select-text ${opened ? 'w-64 px-2' : 'w-0 px-0'} lg:h-32 md:h-28 h-24 py-1 bg-neutral-700/60 rounded-e-2xl transition-all overflow-hidden`}>
        <div className='flex flex-col'>
          <p className='flex justify-between whitespace-nowrap truncate text-xl'>
            {props.character.name}
            <FontAwesomeIcon icon={faClose} onClick={() => setOpened(false)} className='h-6 text-red-500 opacity-75 hover:opacity-100 cursor-pointer transition-opacity' />
          </p>
          <p className='whitespace-nowrap text-lg leading-5 truncate opacity-50'>{props.anime.title}</p>
          <div className='flex gap-1.5 mt-1'>
            <Link to={props.character.url} target='_blank' className='opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></Link>
            <Link to={props.anime.url} target='_blank' className='opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faLink} /></Link>
          </div>
        </div>

        <div className='flex justify-end gap-1.5'>
          <button className='text-emerald-500 opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faEdit} /></button>
          <button className='text-red-500 opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faTrash} /></button>
        </div>
      </div>
    </div>
  )
}

export default Item