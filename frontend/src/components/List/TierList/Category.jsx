import React, { useMemo, useState } from 'react'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Item from './Item'
import UpdateCategory from './UpdateCategory'

function Category(props) {
  const [edit, setEdit] = useState(false)
  const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
    id: props.id,
    data: { type: "Category", category: { id: props.id, name: props.name, color: props.color } }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  const itemIds = useMemo(() => props.items.map(item => item.id), [props.items])

  return (
    <div ref={props.permission?.move ? setNodeRef : null} className={`group/category flex my-1 rounded-2xl odd:bg-neutral-900/85 even:bg-neutral-900/100 ${props.permission?.move && isDragging ? 'cursor-grabbing opacity-25' : 'cursor-auto'}`} style={style}>
      <div {...attributes} {...listeners} className='relative cursor-grab lg:w-8 w-6 lg:min-w-8 min-w-6 lg:max-w-8 max-w-6 lg:min-h-32 md:min-h-28 min-h-24 rounded-s-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors after:content-[""] after:absolute after:top-1/4 lg:after:left-2.5 after:left-2 after:h-1/2 after:w-[1px] after:bg-neutral-300 before:content-[""] before:absolute before:top-1/4 lg:before:right-2.5 before:right-2 before:h-1/2 before:w-[1px] before:bg-neutral-300'></div>
      <div className='relative flex items-center justify-center lg:w-32 md:w-28 w-24 lg:min-w-32 md:min-w-28 min-w-24 lg:max-w-32 md:max-w-28 max-w-24 lg:min-h-32 md:min-h-28 min-h-24 bg-[--color]' style={{'--color': props.color}}>
        {edit ?
          <UpdateCategory id={props.id} selectedList={props.selectedList} setCategories={props.setCategories} name={props.name} color={props.color} setEdit={setEdit} />
        : <>
          {props.name}
          {props.permission?.edit ? <FontAwesomeIcon icon={faEdit} onClick={() => setEdit(true)} className='cursor-pointer absolute top-2 right-2 opacity-0 group-hover/category:opacity-40 hover:!opacity-100 transition-opacity' /> : <></>}
        </>}
      </div>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} permission={props.permission} id={item.id} character={{ id: item.id, name: item.name, url: item.url, img: item.image }} anime={item?.anime} selectedList={props.selectedList} setItems={props.setItems} />)}
        </SortableContext>
      </div>
    </div>
  )
}

export default Category