import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { refreshToken } from '../user'
import Navigation from '../components/navigation/Navigation'
import Lists from './List/Lists'
import TierList from './List/TierList'

export default function List({ history }) {
  const [selectedList, setSelectedList] = useState(null)
  const [logged, setLogged] = useState(null)

  const getLogged = async () => {
    const logged = await refreshToken()
    setLogged(logged)
  }

  useEffect(() => {
    getLogged().catch(err => console.error(err))
  }, [])

  return (
    <div className='min-h-screen p-6'>
      <Navigation selectedList={selectedList} loading={logged === null} history={history} />

      <div className='h-full ml-0 sm:ml-14 mb-16 sm:mb-0'>
        <Routes>
          <Route path='/' element={<Lists history={history} logged={logged} setSelectedList={setSelectedList} />} />
          <Route path='/editor' element={<TierList history={history} logged={logged} selectedList={selectedList} setSelectedList={setSelectedList} />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </div>
    </div>
  )
}