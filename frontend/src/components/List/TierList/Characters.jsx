import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import Item from './Item'

function Characters(props) {
  const {setNodeRef} = useSortable({
    id: props.id,
    data: { type: "Category", category: { id: props.id, name: props.name, color: props.color } },
    disabled: true
  })
  const itemIds = useMemo(() => props.items.map(item => item.id), [props.items])

  const createItem = () => {
    // AXIOS CHARACTER LÉTREHOZÁS / LEKÉRDEZÉS
    props.setItems(items => { return [...items, {
      id: items.length + 1,
      categoryId: "characters",
      name: 'Bocchi',
      url: 'https://myanimelist.net/character/206276/Hitori_Gotou',
      img: 'https://cdn.myanimelist.net/images/characters/8/491455.jpg',
      anime: {
        id: 1,
        name: 'Bocchi the Rock!',
        url: 'https://myanimelist.net/anime/47917/Bocchi_the_Rock'
      }
    }] })
  }

  return (
    <div ref={setNodeRef} className='flex bg-neutral-900 odd:bg-opacity-85 even:bg-opacity-100 rounded-2xl'>
      <div className='flex flex-wrap w-full lg:min-h-32 md:min-h-28 min-h-24'>
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          {props.items.map(item => <Item key={item.id} id={item.id} character={{ name: item.name, url: item.url, img: item.img }} anime={{ id: item.anime.id, name: item.anime.name, url: item.anime.url }} />)}
          <button onClick={createItem} className='group flex flex-col items-center justify-center lg:h-32 md:h-28 h-24 aspect-[3/4] ml-0.5 rounded-2xl border-2 border-neutral-900 hover:border-neutral-400 bg-neutral-900 transition-all'>
            <p className='flex items-center justify-center w-full lg:h-9 h-8 bg-neutral-900 z-10'><FontAwesomeIcon icon={faAdd} className='h-7' /></p>
            <p className='lg:text-sm text-xs lg:-mt-9 -mt-8 lg:group-hover:mt-2 group-hover:mt-1 overflow-hidden transition-all'>Karakter hozzáadás</p>
          </button>
        </SortableContext>
      </div>
    </div>
  )
}

export default Characters