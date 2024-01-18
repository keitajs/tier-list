import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ListItem from './ListItem'

function PublicLists() {
  const [lists, setLists] = useState([])

  const getPublicLists = async () => {
    const { data } = await axios.get('http://localhost:2000/lists/public')
    setLists(data)
  }

  useEffect(() => {
    getPublicLists().catch(() => {})
  }, [])

  return (
    <>
      <div className='px-3 pb-2 text-xl border-b-2 border-blue-500'>Publikus listák</div>
      <div className='flex flex-col grow gap-2.5'>
        {lists.length > 0 ? lists.map(list => <ListItem key={list.id} list={list} public={true} />) : <div className='flex items-center justify-center h-full opacity-50'>Nem található lista.</div>}
      </div>
    </>
  )
}

export default PublicLists