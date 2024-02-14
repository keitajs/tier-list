import React, { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import Item from './Item'
import NewCharacter from './NewCharacter'

function Characters(props) {
  const [create, setCreate] = useState(false)
  const {setNodeRef} = useSortable({
    id: props.id,
    data: { type: "Category", category: { id: props.id, name: props.name, color: props.color } },
    disabled: true
  })
  const itemIds = useMemo(() => props.items.map(item => item.id), [props.items])

  return (
    <div ref={setNodeRef} className='flex bg-neutral-900/85 rounded-2xl'>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} permission={props.permission} id={item.id} character={{ name: item.name, url: item.url, img: item.image }} anime={{ id: item.anime.id, title: item.anime.title, url: item.anime.url }} selectedList={props.selectedList} setItems={props.setItems} />)}
        </SortableContext>
        {props.permission?.edit ?
          <button onClick={() => setCreate(true)} className='group flex flex-col items-center justify-center lg:h-32 md:h-28 h-24 aspect-[3/4] ml-0.5 rounded-2xl border-2 border-neutral-900 hover:border-neutral-400 bg-neutral-900 transition-all'>
            <p className='flex items-center justify-center w-full lg:h-9 h-8 bg-neutral-900 z-10'><FontAwesomeIcon icon={faAdd} className='h-7' /></p>
            <p className='lg:text-sm text-xs lg:-mt-9 -mt-8 lg:group-hover:mt-2 group-hover:mt-1 overflow-hidden transition-all'>Karakter hozzáadás</p>
          </button>
        : <></>}
      </div>

      <NewCharacter id={props.id} show={create} setShow={setCreate} setItems={props.setItems} selectedList={props.selectedList} />
    </div>
  )
}

export default Characters