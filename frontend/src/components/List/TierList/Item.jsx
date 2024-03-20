import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { isMobile } from 'react-device-detect'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faArrowUpRightFromSquare, faEdit, faClose } from '@fortawesome/free-solid-svg-icons'
import UpdateCharacter from './UpdateCharacter'

function Item(props) {
  const [opened, setOpened] = useState(false)
  const [edit, setEdit] = useState(false)
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: props.id,
    data: { type: "Item", item: { id: props.id, character: props.character, anime: props?.anime } },
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
    <div ref={props.permission?.move ? setNodeRef : null} className='flex rounded-2xl overflow-hidden' style={style}>
      <div {...attributes} {...listeners} onClick={() => openItem('onclick')} onContextMenu={() => openItem('context')} className={`flex items-center justify-center lg:h-32 md:h-28 h-24 aspect-[3/4] ml-0.5 bg-neutral-700/15 overflow-hidden relative after:content-[""] after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-transparent hover:after:border-neutral-400 after:transition-all ${props.permission?.move && isDragging ? 'cursor-grabbing opacity-50' : 'cursor-grab'} ${opened || isDragging ? 'hover:after:border-transparent rounded-s-2xl' : 'rounded-2xl'} transition-all`}>
        <img src={props.character.img.startsWith('http') ? props.character.img : `http://localhost:2000/characters/images/${props.character.img}`} alt="" className='w-full h-full object-cover' />
      </div>
      <div className={`relative flex flex-col justify-between select-text ${opened ? 'w-64 px-2' : 'w-0 px-0'} lg:h-32 md:h-28 h-24 py-1 bg-neutral-700/60 rounded-e-2xl transition-all overflow-hidden`}>
        {edit ? <UpdateCharacter id={props.id} character={props.character} anime={props?.anime} setEdit={setEdit} setItems={props.setItems} selectedList={props.selectedList} /> : <>
          <div className='flex flex-col'>
            <p className='flex justify-between whitespace-nowrap truncate text-xl'>
              {props.character.name}
              <FontAwesomeIcon icon={faClose} onClick={() => setOpened(false)} className='h-6 text-red-500 opacity-75 hover:opacity-100 cursor-pointer transition-opacity' />
            </p>
            <p className='whitespace-nowrap text-lg leading-5 truncate opacity-50'>{props?.anime?.title}</p>
          </div>
          
          <div className='flex items-center justify-between gap-1.5'>
            <div className='flex gap-1.5'>
              {props?.character?.url ? <Link id={`character-${props.character.id}`} to={props.character.url} target='_blank' className='opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></Link> : <></>}
              {props?.anime?.url ? <Link id={`anime-${props.anime.id}`} to={props.anime.url} target='_blank' className='opacity-50 hover:opacity-75 transition-opacity'><FontAwesomeIcon icon={faLink} /></Link> : <></>}
            </div>

            {props.permission?.edit ?<button onClick={() => setEdit(true)} id={`edit-${props.character.id}`} className='opacity-25 hover:opacity-50 transition-opacity'><FontAwesomeIcon icon={faEdit} className='h-4' /></button>: <></>}
          </div>

          {props?.character?.url ? <Tooltip anchorSelect={`#character-${props.character.id}`} place='top-start' className='!px-2 !py-1 !text-sm !rounded-lg !bg-neutral-950'>Karakter</Tooltip> : <></>}
          {props?.anime?.url ? <Tooltip anchorSelect={`#anime-${props.anime.id}`} place='top-start' className='!px-2 !py-1 !text-sm !rounded-lg !bg-neutral-950'>Anime</Tooltip> : <></>}
          <Tooltip anchorSelect={`#edit-${props.character.id}`} place='top-end' className='!px-2 !py-1 !text-sm !rounded-lg !bg-neutral-950'>Szerkesztés</Tooltip>
        </>}
      </div>
    </div>
  )
}

export default Item