import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/List/Navbar'
import Lists from '../components/List/Lists'
import TierList from '../components/List/TierList'

function List(props) {
  const [editor, setEditor] = useState(false)

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])

  /*
  const getList = async() => {
    // axios
    setCategories([
      { id: "cat-1", name: 'S', color: '#990000' }
    ])

    setItems([
      {
        id: 1, categoryId: "cat-1", name: 'Bocchi', url: 'https://myanimelist.net/character/206276/Hitori_Gotou', img: 'https://cdn.myanimelist.net/images/characters/8/491455.jpg',
        anime: { id: 1, name: 'Bocchi the Rock!', url: 'https://myanimelist.net/anime/47917/Bocchi_the_Rock' }
      }
    ])
  }
  */

  return (
    <div className='h-screen p-6'>
      <Sidebar history={props.history} />

      <div className='h-full ml-14'>
        {editor ? <TierList categories={categories} setCategories={setCategories} items={items} setItems={setItems} /> : <Lists />}
        <Navbar editor={editor} setEditor={setEditor} />
      </div>
    </div>
  )
}

export default List