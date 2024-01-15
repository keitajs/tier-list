import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ListItem from './ListItem'

function PublicLists(props) {
  const [lists, setLists] = useState([])

  const getPublicLists = async () => {
    const { data } = await axios.get('http://localhost:2000/lists/public')
    setLists(data)
  }

  useEffect(() => {
    getPublicLists().catch(err => {alert('Server error'); console.log(err)})
  }, [])

  return (
    <>
      <div className='px-3 pb-2 text-xl border-b-2 border-blue-500'>Publikus listák</div>
      <div className='flex flex-col gap-2.5'>
        {lists.map(list => <ListItem key={list.id} list={list} public={true} />)}
      </div>
    </>
  )
}

export default PublicLists