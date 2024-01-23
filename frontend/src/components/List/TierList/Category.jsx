import React, { useMemo } from 'react'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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

  return (
    <div ref={setNodeRef} className={`flex my-1 rounded-2xl odd:bg-neutral-900/85 even:bg-neutral-900/100 ${isDragging ? 'cursor-grabbing opacity-25' : 'cursor-auto'}`} style={style}>
      <div {...attributes} {...listeners} className='relative cursor-grab lg:w-8 w-6 lg:min-w-8 min-w-6 lg:max-w-8 max-w-6 lg:min-h-32 md:min-h-28 min-h-24 rounded-s-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors after:content-[""] after:absolute after:top-1/4 lg:after:left-2.5 after:left-2 after:h-1/2 after:w-[1px] after:bg-neutral-300 before:content-[""] before:absolute before:top-1/4 lg:before:right-2.5 before:right-2 before:h-1/2 before:w-[1px] before:bg-neutral-300'></div>
      <div className='flex items-center justify-center lg:w-32 md:w-28 w-24 lg:min-w-32 md:min-w-28 min-w-24 lg:max-w-32 md:max-w-28 max-w-24 lg:min-h-32 md:min-h-28 min-h-24 bg-[--color]' style={{'--color': props.color}}>
        {props.name}
      </div>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} id={item.id} character={{ name: item.name, url: item.url, img: item.image }} anime={{ id: item.anime.id, title: item.anime.title, url: item.anime.url }} />)}
        </SortableContext>
      </div>
    </div>
  )
}

export default Category