import React, { useState, useMemo } from 'react'
import axios from 'axios'
import { socket } from '../../../socket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToWindowEdges, restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Category from './Category'
import Characters from './Characters'
import Item from './Item'
import NewCategory from './NewCategory'

function List({ selectedList, items, setItems, categories, setCategories, permission }) {
  const [create, setCreate] = useState(false)

  // Mozgatáshoz szükséges adatok
  const [activeItem, setActiveItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryIds = useMemo(() => categories.map(category => category.id), [categories])
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Karakter / Kategória mozgatás kezdete
  const onDragStart = ({ active }) => {
    if (!permission.move) return
    if (active.data.current?.type === "Item") {
      socket.emit('character-move-start', active.id)
      return setActiveItem(active.data.current.item)
    }
    if (active.data.current?.type === "Category") {
      socket.emit('category-move-start', active.id)
      return setActiveCategory(active.data.current.category)
    }
  }

  // Karakter / Kategória ráhúzás egy másik elemre
  const onDragOver = ({ active, over }) => {
    if (!permission.move) return
    if (!over) return
    if (active.id === over.id) return
    if (active.data.current?.type !== "Item") return

    // Karakter áthelyezés
    if (over.data.current?.type === "Item") {
      return setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        const overIndex = items.findIndex((t) => t.id === over.id)

        if (items[activeIndex].categoryId !== items[overIndex].categoryId) {
          items[activeIndex].categoryId = items[overIndex].categoryId
          return arrayMove(items, activeIndex, overIndex - 1)
        }
        return arrayMove(items, activeIndex, overIndex)
      })
    }

    // Kategória áthelyezés
    if (over.data.current?.type === "Category") {
      return setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        items[activeIndex].categoryId = over.id
        return arrayMove(items, activeIndex, items.length)
      })
    }
  }

  // Karakter / Kategória mozgatás vége
  const onDragEnd = ({ active, over }) => {
    if (!permission.move) return
    setActiveItem(null)
    setActiveCategory(null)
    
    if (!over) return

    // Karakter mozgatás mentése 
    if (active.data.current?.type === "Item") {
      const activeItem = items.find(item => item.id === active.id)
      const firstItem = items.find(item => activeItem.categoryId === item.categoryId)
      const position = items.findIndex(item => item.id === activeItem.id) - items.findIndex(item => item.id === firstItem.id) + 1
      const categoryId = parseInt(activeItem.categoryId)

      socket.emit('character-move-end', active.id, categoryId, position)
      return axios.patch(`/lists/${selectedList}/characters/${parseInt(active.id)}/move`, { position, categoryId })
    }

    // Kategória mozgatás mentése
    if (active.data.current?.type === "Category") {
      if (active.id === over.id) return socket.emit('category-move-end', active.id, false)
      
      return setCategories((categories) => {
        const activeIndex = categories.findIndex(category => category.id === active.id)
        const overIndex = categories.findIndex(category => category.id === over.id)
        axios.patch(`/lists/${selectedList}/categories/${parseInt(active.id)}/move`, { position: overIndex })

        socket.emit('category-move-end', active.id, overIndex)
        return arrayMove(categories, activeIndex, overIndex)
      })
    }
  }

  return (
    <>
      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
          <div className='rounded-2xl'>
            {categories.filter(category => category.name).map(category => <Category key={category.id} permission={permission} id={category.id} name={category.name} color={category.color} category={category} items={items.filter(item => item.categoryId === category.id)} setItems={setItems} setCategories={setCategories} selectedList={selectedList} />)}
          </div>

          {permission.edit ?
            <button onClick={() => setCreate(true)} className='lg:text-base text-sm lg:mx-8 mx-6 my-1 px-4 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors'>
              <FontAwesomeIcon icon={faPlusCircle} className='mr-1' /> Kategória hozzáadás
            </button>
          : <></>}

          <div className='mt-8 rounded-2xl'>
            {categories.filter(category => !category.name).map(category => <Characters key={category.id} permission={permission} id={category.id} name={category.name} color={category.color} items={items.filter(item => item.categoryId === category.id)} setItems={setItems} selectedList={selectedList} />)}
          </div>
        </SortableContext>

        {permission.move ?
          <DragOverlay modifiers={activeCategory ? [restrictToParentElement, restrictToVerticalAxis] : []}>
            {activeItem ? <Item key={activeItem.id} id={activeItem.id} character={activeItem.character} anime={activeItem.anime} /> : <></>}
            {activeCategory ? <Category items={items.filter(item => item.categoryId === activeCategory.id)} key={activeCategory.id} id={activeCategory.id} name={activeCategory.name} color={activeCategory.color} /> : <></>}
          </DragOverlay>
        : <></>}
      </DndContext>

      <NewCategory show={create} setShow={setCreate} setCategories={setCategories} selectedList={selectedList} />
    </>
  )
}

export default List