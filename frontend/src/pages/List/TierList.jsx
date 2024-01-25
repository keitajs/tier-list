import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToWindowEdges, restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Category from '../../components/List/TierList/Category'
import Characters from '../../components/List/TierList/Characters'
import Item from '../../components/List/TierList/Item'

function List(props) {
  const [title, setTitle] = useState('Betöltés...')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  const [activeItem, setActiveItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryIds = useMemo(() => categories.map(category => category.id), [categories])
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
      return setItems((items) => {
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
      return setItems((items) => {
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
      const activeItem = items.find(item => item.id === active.id)
      const firstItem = items.find(item => activeItem.categoryId === item.categoryId)
      const position = items.findIndex(item => item.id === activeItem.id) - items.findIndex(item => item.id === firstItem.id) + 1
      axios.patch(`http://localhost:2000/lists/${props.selectedList}/characters/${parseInt(active.id)}/move`, { position, categoryId: parseInt(activeItem.categoryId) })
    }
    else
    if (active.data.current?.type === "Category") {
      if (active.id === over.id) return
      
      // AXIOS MENTÉS
      console.log('category drag end')
      setCategories((categories) => {
        const activeIndex = categories.findIndex(category => category.id === active.id)
        const overIndex = categories.findIndex(category => category.id === over.id)
        return arrayMove(categories, activeIndex, overIndex)
      })
    }
  }

  const createCategory = () => {
    setCategories(categories => { return [...categories, { id: `cat-${categories.length + 1}`, name: 'TEST', color: '#ffb6c1' }] })
  }

  const getTierList = async (id) => {
    const { data: list } = await axios.get(`http://localhost:2000/user/lists/${id}`)

    setTitle(list.name)
    setCategories(list.categories.filter(category => category.position).map(category => { return { id: `${category.id}cat`, name: category.name, color: category.color } }))
    setItems([].concat(...list.categories.map(category => category.characters.map(character => { return { ...character, categoryId: `${category.id}${category.position ? 'cat' : 'characters'}`, } }))))
  }

  useEffect(() => {
    if (props.selectedList === null) return props.history('/list')

    getTierList(props.selectedList).catch(err => console.log(err))
  }, [props, props.selectedList])

  return (
    <div className='select-none w-full mx-auto'>
      <h1 className='mb-8 px-3 pb-2 text-2xl border-b-2 border-blue-500'>{title}</h1>

      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
          <div className='rounded-2xl'>
            {categories.map(category => <Category items={items.filter(item => item.categoryId === category.id)} setItems={setItems} key={category.id} id={category.id} name={category.name} color={category.color} selectedList={props.selectedList} />)}
          </div>
          <button onClick={createCategory} className='lg:text-base text-sm lg:mx-8 mx-6 my-1 px-4 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors'>
            <FontAwesomeIcon icon={faPlusCircle} className='mr-1' /> Kategória hozzáadás
          </button>
          <div className='mt-8 rounded-2xl'>
            <Characters items={items.filter(item => item.categoryId.endsWith('characters'))} setItems={setItems} key={'characters'} id={items.find(item => item.categoryId.endsWith('characters'))?.categoryId} selectedList={props.selectedList} />
          </div>
        </SortableContext>

        <DragOverlay modifiers={activeCategory ? [restrictToParentElement, restrictToVerticalAxis] : []}>
          {activeItem ? <Item key={activeItem.id} id={activeItem.id} character={activeItem.character} anime={activeItem.anime} /> : <></>}
          {activeCategory ? <Category items={items.filter(item => item.categoryId === activeCategory.id)} key={activeCategory.id} id={activeCategory.id} name={activeCategory.name} color={activeCategory.color} /> : <></>}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default List