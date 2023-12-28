import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TierList from '../components/List/List'

function List(props) {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])

  const getList = async() => {
    await axios.get('http://localhost:2000/token')

    // axios
    setCategories([
      { id: "cat-1", name: 'S', color: '#990000' },
      { id: "cat-2", name: 'A', color: '#999900' },
      { id: "cat-3", name: 'B', color: '#009900' }
    ])

    setItems([
      {
        id: 1,
        categoryId: "cat-1",
        name: 'Bocchi',
        url: 'https://myanimelist.net/character/206276/Hitori_Gotou',
        img: 'https://cdn.myanimelist.net/images/characters/8/491455.jpg',
        anime: {
          id: 1,
          name: 'Bocchi the Rock!',
          url: 'https://myanimelist.net/anime/47917/Bocchi_the_Rock'
        }
      },
      {
        id: 2,
        categoryId: "characters",
        name: 'Zero Two',
        url: 'https://myanimelist.net/character/155679/Zero_Two',
        img: 'https://cdn.myanimelist.net/images/characters/10/352557.jpg',
        anime: {
          id: 2,
          name: 'Darling in the FranXX',
          url: 'https://myanimelist.net/anime/35849/Darling_in_the_FranXX'
        }
      },
      {
        id: 3,
        categoryId: "cat-1",
        name: 'Cid Kagenou',
        url: 'https://myanimelist.net/character/171572/Cid_Kagenou',
        img: 'https://cdn.myanimelist.net/images/characters/7/461218.jpg',
        anime: {
          id: 2,
          name: 'Kage no Jitsuryokusha ni Naritakute!',
          url: 'https://myanimelist.net/anime/48316/Kage_no_Jitsuryokusha_ni_Naritakute'
        }
      }
    ])
  }

  useEffect(() => {
    getList().catch(e => props.history('/'))
  }, [props])

  return (
    <div className='py-5'>
      <TierList categories={categories} setCategories={setCategories} items={items} setItems={setItems} />
    </div>
  )
}

export default List