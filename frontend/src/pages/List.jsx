import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/List/Navbar'
import Lists from './List/Lists'
import TierList from './List/TierList'

function List(props) {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])

  return (
    <div className='h-screen p-6'>
      <Sidebar history={props.history} />

      <div className='h-full ml-14'>
        <Routes>
          <Route path='/' element={<Lists history={props.history} />} />
          <Route path='/editor' element={<TierList history={props.history} categories={categories} setCategories={setCategories} items={items} setItems={setItems} />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
        <Navbar />
      </div>
    </div>
  )
}

export default List