import React, { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToWindowEdges, restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Category from '../../components/List/TierList/Category'
import Characters from '../../components/List/TierList/Characters'
import Item from '../../components/List/TierList/Item'

function List(props) {
  const [activeItem, setActiveItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryIds = useMemo(() => props.categories.map(category => category.id), [props.categories])
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragStart = ({ active }) => {
    if (active.data.current?.type === "Item") return setActiveItem(active.data.current.item)
    if (active.data.current?.type === "Category") return setActiveCategory(active.data.current.category)
  }

  const onDragOver = ({ active, over }) => {
    if (!over) return
    if (active.id === over.id) return
    if (active.data.current?.type !== "Item") return

    if (over.data.current?.type === "Item") {
      return props.setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        const overIndex = items.findIndex((t) => t.id === over.id)

        if (items[activeIndex].categoryId !== items[overIndex].categoryId) {
          items[activeIndex].categoryId = items[overIndex].categoryId
          return arrayMove(items, activeIndex, overIndex - 1)
        }
        return arrayMove(items, activeIndex, overIndex)
      })
    } else
    if (over.data.current?.type === "Category") {
      return props.setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        items[activeIndex].categoryId = over.id
        return arrayMove(items, activeIndex, items.length)
      })
    }
  }

  const onDragEnd = ({ active, over }) => {
    setActiveItem(null)
    setActiveCategory(null)

    if (!over) return
    if (active.data.current?.type === "Item") {

      // AXIOS MENTÉS
      console.log('item drag end')
    } else
    if (active.data.current?.type === "Category") {
      if (active.id === over.id) return
      
      // AXIOS MENTÉS
      console.log('category drag end')
      props.setCategories((categories) => {
        const activeIndex = categories.findIndex(category => category.id === active.id)
        const overIndex = categories.findIndex(category => category.id === over.id)
        return arrayMove(categories, activeIndex, overIndex)
      })
    }
  }

  const createCategory = () => {
    props.setCategories(categories => { return [...categories, { id: `cat-${categories.length + 1}`, name: 'TEST', color: '#ffb6c1' }] })
  }

  return (
    <div className='select-none w-full mx-auto'>
      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
          <div className='rounded-2xl'>
            {props.categories.map(category => <Category items={props.items.filter(item => item.categoryId === category.id)} key={category.id} id={category.id} name={category.name} color={category.color} />)}
          </div>
          <button onClick={createCategory} className='lg:text-base text-sm lg:mx-8 mx-6 my-1 px-4 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors'>
            <FontAwesomeIcon icon={faPlusCircle} className='mr-1' /> Kategória hozzáadás
          </button>
          <div className='mt-8 rounded-2xl'>
            {<Characters items={props.items.filter(item => item.categoryId === 'characters')} setItems={props.setItems} key={'characters'} id={'characters'} />}
          </div>
        </SortableContext>

        <DragOverlay modifiers={activeCategory ? [restrictToParentElement, restrictToVerticalAxis] : []}>
          {activeItem ? <Item key={activeItem.id} id={activeItem.id} character={activeItem.character} anime={activeItem.anime} /> : <></>}
          {activeCategory ? <Category items={props.items.filter(item => item.categoryId === activeCategory.id)} key={activeCategory.id} id={activeCategory.id} name={activeCategory.name} color={activeCategory.color} /> : <></>}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default List