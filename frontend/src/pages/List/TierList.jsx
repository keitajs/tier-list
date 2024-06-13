import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { socket } from '../../socket'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faShare } from '@fortawesome/free-solid-svg-icons'
import { arrayMove } from "@dnd-kit/sortable"
import List from '../../components/List/TierList/List'

function TierList({ selectedList, setSelectedList, history }) {
  const [searchParams] = useSearchParams()

  // Socket IO felhasználók
  const [socketUsers, setSocketUsers] = useState([])

  // Lista adatok
  const [title, setTitle] = useState('Betöltés...')
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [permission, setPermission] = useState({ move: true, edit: true, admin: true })

  // Tier List adatok lekérése
  const getTierList = async (id) => {
    const { data: { list, permission } } = await axios.get(`/user/lists/${id}`)

    setTitle(list.name)
    setCategories(list.categories.map(category => { return { id: `${category.id}cat`, name: category.name, color: category.color } }))
    setItems([].concat(...list.categories.map(category => category.characters.map(character => { return { ...character, categoryId: `${category.id}cat`, } }))))

    if (permission) setPermission({ move: permission.value >= 2, edit: permission.value === 3, admin: false })

    document.title = `${list.name} - Listák | Tier List`
  }

  useEffect(() => {
    // * Socket IO függvények
    // Csatlakozáskor belép a lista szobájába
    const onConnect = () => {
      socket.emit('list-join', selectedList)
    }

    // Felhasználó belépés
    const userJoin = (user) => {
      setSocketUsers(socketUsers => socketUsers.concat(user))
    }

    // Felhasználó kilépés
    const userLeave = (id) => {
      setSocketUsers(socketUsers => socketUsers.filter(user => user.id !== id))
    }

    // Karakter létrehozás
    const characterCreate = (data) => {
      setItems(items => [...items, data])
    }

    // Karakter módosítás
    const characterUpdate = (data) => {
      setItems(items => {
        const item = items.find(x => x.id === data.id)
        item.name = data.name
        item.url = data.url
        item.image = data.image
        item.anime = data.anime
        return items.slice()
      })
    }

    // Karakter törlés
    const characterDelete = (id) => {
      setItems(items => {
        items.splice(items.findIndex(item => item.id === id), 1)
        return items.slice()
      })
    }

    // Karakter mozgatás kezdése
    const characterMoveStart = (id, user) => {
      setItems(items => {
        const character = items.find(item => item.id === id)
        character.move = true
        character.user = user
        return [...items]
      })
    }

    // Karakter mozgatás vége
    const characterMoveEnd = (id, category, position) => {
      setItems((items) => {
        const activeIndex = items.findIndex(item => item.id === id)
        const catItemIndex = items.findIndex(item => item.categoryId === `${category}cat`)
        items[activeIndex].move = false
        items[activeIndex].categoryId = `${category}cat`
        return arrayMove(items, activeIndex, catItemIndex === -1 ? items.length : catItemIndex + position - 1)
      })
    }

    // Kategória létrehozás
    const categoryCreate = (data) => {
      setCategories(categories => [...categories, {...data, id: `${data.id}cat`}])
    }

    // Kategória módosítás
    const categoryUpdate = (data) => {
      setCategories(categories => {
        const category = categories.find(category => category.id === data.id)
        category.name = data.name
        category.color = data.color
        return categories.slice()
      })
    }

    // Kategória törlés
    const categoryDelete = (id) => {
      setCategories(categories => {
        categories.splice(categories.findIndex(category => category.id === id), 1)
        return categories.slice()
      })
    }

    // Kategória mozgatás kezdése
    const categoryMoveStart = (id, user) => {
      setCategories(categories => {
        const category = categories.find(category => category.id === id)
        category.move = true
        category.user = user
        return [...categories]
      })
    }

    // Kategória mozgatás vége
    const categoryMoveEnd = (id, position) => {
      setCategories(categories => {
        const activeIndex = categories.findIndex(category => category.id === id)
        categories[activeIndex].move = false
        return position ? arrayMove(categories, activeIndex, position) : [...categories]
      })
    }

    // * Socket IO eventek
    socket.connect()
    socket.on('connect', onConnect)

    socket.on('user-join', userJoin)
    socket.on('user-leave', userLeave)

    socket.on('character-create', characterCreate)
    socket.on('character-update', characterUpdate)
    socket.on('character-delete', characterDelete)
    socket.on('character-move-start', characterMoveStart)
    socket.on('character-move-end', characterMoveEnd)

    socket.on('category-create', categoryCreate)
    socket.on('category-update', categoryUpdate)
    socket.on('category-delete', categoryDelete)
    socket.on('category-move-start', categoryMoveStart)
    socket.on('category-move-end', categoryMoveEnd)

    return () => {
      socket.off('connect', onConnect)

      socket.off('user-join', userJoin)
      socket.off('user-leave', userLeave)

      socket.off('character-create', characterCreate)
      socket.off('character-update', characterUpdate)
      socket.off('character-delete', characterDelete)
      socket.off('character-move-start', characterMoveStart)
      socket.off('character-move-end', characterMoveEnd)

      socket.off('category-create', categoryCreate)
      socket.off('category-update', categoryUpdate)
      socket.off('category-delete', categoryDelete)
      socket.off('category-move-start', categoryMoveStart)
      socket.off('category-move-end', categoryMoveEnd)

      socket.emit('list-leave')
      socket.disconnect()
    }
  }, [selectedList])

  useEffect(() => {
    const listId = searchParams.get('id') || selectedList
    if (listId) setSelectedList(listId)

    getTierList(listId).catch(() => history('/list'))
  }, [searchParams])

  return (
    <div className='select-none w-full mx-auto'>
      <h1 className='flex items-center justify-between mb-1.5 px-3 pb-2 text-2xl border-b-2 border-blue-500'>
        {title}
        <div className='flex items-center gap-3'>
          <FontAwesomeIcon id='reload' icon={faRotateRight} className='cursor-pointer h-5 opacity-50 hover:opacity-75 transition-opacity' onClick={() => window.location.reload()} />
          <FontAwesomeIcon id='share' icon={faShare} className='cursor-pointer h-5 opacity-50 hover:opacity-75 transition-opacity' onClick={() => window.navigator.clipboard.writeText(window.location.origin + `/list/editor?id=${selectedList}`)} />
          <Tooltip anchorSelect='#reload' place='bottom-end' className='!text-sm !rounded-lg !bg-neutral-950'>Frissítés</Tooltip>
          <Tooltip anchorSelect='#share' place='bottom-end' className='!text-sm !rounded-lg !bg-neutral-950'>Megosztás</Tooltip>
        </div>
      </h1>

      <h3 className='flex items-center gap-2 flex-wrap mx-2 mb-8 opacity-80'>{socketUsers.map(user => <Link to={`/profile/${user.username}`} key={user.id} className='flex items-end'>{user.username}<span className='opacity-40 text-xs'>#{user.id}</span></Link>)}</h3>

      <List selectedList={selectedList} items={items} setItems={setItems} categories={categories} setCategories={setCategories} permission={permission} />
    </div>
  )
}

export default TierList