import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faRotateRight, faShare } from '@fortawesome/free-solid-svg-icons'
import { useSensors, useSensor, MouseSensor, TouchSensor, KeyboardSensor, DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToWindowEdges, restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Category from '../../components/List/TierList/Category'
import Characters from '../../components/List/TierList/Characters'
import Item from '../../components/List/TierList/Item'
import NewCategory from '../../components/List/TierList/NewCategory'

function TierList(props) {
  const [title, setTitle] = useState('Betöltés...')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [permission, setPermission] = useState({ move: true, edit: true, admin: true })
  const [create, setCreate] = useState(false)

  const [activeItem, setActiveItem] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryIds = useMemo(() => categories.map(category => category.id), [categories])
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragStart = ({ active }) => {
    if (!permission.move) return
    if (active.data.current?.type === "Item") return setActiveItem(active.data.current.item)
    if (active.data.current?.type === "Category") return setActiveCategory(active.data.current.category)
  }

  const onDragOver = ({ active, over }) => {
    if (!permission.move) return
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
    }

    if (over.data.current?.type === "Category") {
      return setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        items[activeIndex].categoryId = over.id
        return arrayMove(items, activeIndex, items.length)
      })
    }
  }

  const onDragEnd = ({ active, over }) => {
    if (!permission.move) return
    setActiveItem(null)
    setActiveCategory(null)
    
    if (!over) return

    if (active.data.current?.type === "Item") {
      const activeItem = items.find(item => item.id === active.id)
      const firstItem = items.find(item => activeItem.categoryId === item.categoryId)
      const position = items.findIndex(item => item.id === activeItem.id) - items.findIndex(item => item.id === firstItem.id) + 1
      return axios.patch(`http://localhost:2000/lists/${props.selectedList}/characters/${parseInt(active.id)}/move`, { position, categoryId: parseInt(activeItem.categoryId) })
    }

    if (active.data.current?.type === "Category") {
      if (active.id === over.id) return
      
      return setCategories((categories) => {
        const activeIndex = categories.findIndex(category => category.id === active.id)
        const overIndex = categories.findIndex(category => category.id === over.id)
        axios.patch(`http://localhost:2000/lists/${props.selectedList}/categories/${parseInt(active.id)}/move`, { position: overIndex })
        return arrayMove(categories, activeIndex, overIndex)
      })
    }
  }

  const getTierList = async (id) => {
    const { data: { list, permission } } = await axios.get(`http://localhost:2000/user/lists/${id}`)

    setTitle(list.name)
    setCategories(list.categories.map(category => { return { id: `${category.id}cat`, name: category.name, color: category.color } }))
    setItems([].concat(...list.categories.map(category => category.characters.map(character => { return { ...character, categoryId: `${category.id}cat`, } }))))

    if (permission) setPermission({ move: permission.value >= 2, edit: permission.value === 3, admin: false })
  }

  useEffect(() => {
    if (props.selectedList === null) return props.history('/list')

    getTierList(props.selectedList).catch(err => props.history('/list'))
  }, [props, props.selectedList])

  return (
    <div className='select-none w-full mx-auto'>
      <h1 className='flex items-center justify-between mb-8 px-3 pb-2 text-2xl border-b-2 border-blue-500'>
        {title}
        <div className='flex items-center gap-3'>
          <FontAwesomeIcon id='reload' icon={faRotateRight} className='cursor-pointer h-5 opacity-50 hover:opacity-75 transition-opacity' onClick={() => props.history(`/list?id=${props.selectedList}`)} />
          <FontAwesomeIcon id='share' icon={faShare} className='cursor-pointer h-5 opacity-50 hover:opacity-75 transition-opacity' onClick={() => window.navigator.clipboard.writeText(window.location.origin + `/list?id=${props.selectedList}`)} />
          <Tooltip anchorSelect='#reload' place='bottom-end' className='!text-sm !rounded-lg !bg-neutral-950'>Frissítés</Tooltip>
          <Tooltip anchorSelect='#share' place='bottom-end' className='!text-sm !rounded-lg !bg-neutral-950'>Megosztás</Tooltip>
        </div>
      </h1>

      <DndContext sensors={sensors} modifiers={[restrictToWindowEdges]} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
          <div className='rounded-2xl'>
            {categories.filter(category => category.name).map(category => <Category key={category.id} permission={permission} id={category.id} name={category.name} color={category.color} items={items.filter(item => item.categoryId === category.id)} setItems={setItems} setCategories={setCategories} selectedList={props.selectedList} />)}
          </div>

          {permission.edit ?
            <button onClick={() => setCreate(true)} className='lg:text-base text-sm lg:mx-8 mx-6 my-1 px-4 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-900 transition-colors'>
              <FontAwesomeIcon icon={faPlusCircle} className='mr-1' /> Kategória hozzáadás
            </button>
          : <></>}

          <div className='mt-8 rounded-2xl'>
            {categories.filter(category => !category.name).map(category => <Characters key={category.id} permission={permission} id={category.id} name={category.name} color={category.color} items={items.filter(item => item.categoryId === category.id)} setItems={setItems} selectedList={props.selectedList} />)}
          </div>
        </SortableContext>

        {permission.move ?
          <DragOverlay modifiers={activeCategory ? [restrictToParentElement, restrictToVerticalAxis] : []}>
            {activeItem ? <Item key={activeItem.id} id={activeItem.id} character={activeItem.character} anime={activeItem.anime} /> : <></>}
            {activeCategory ? <Category items={items.filter(item => item.categoryId === activeCategory.id)} key={activeCategory.id} id={activeCategory.id} name={activeCategory.name} color={activeCategory.color} /> : <></>}
          </DragOverlay>
        : <></>}
      </DndContext>

      <NewCategory show={create} setShow={setCreate} setCategories={setCategories} selectedList={props.selectedList} />
    </div>
  )
}

export default TierList