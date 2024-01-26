import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/List/Navbar'
import Lists from './List/Lists'
import TierList from './List/TierList'

function List(props) {
  const [selectedList, setSelectedList] = useState(null)

  return (
    <div className='min-h-screen p-6'>
      <Sidebar history={props.history} />

      <div className='h-full ml-14'>
        <Routes>
          <Route path='/' element={<Lists history={props.history} setSelectedList={setSelectedList} />} />
          <Route path='/editor' element={<TierList history={props.history} selectedList={selectedList} />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
        <Navbar selectedList={selectedList} />
      </div>
    </div>
  )
}

export default List