import React, { useEffect, useState } from 'react'
import { getLoginStatus } from '../../user'
import Sidebar from './Sidebar'
import ListNavbar from './ListNavbar'
import MobileNavbar from './MobileNavbar'

export default function Navigation({ history, selectedList, loading }) {
  const [logged, setLogged] = useState(false)

  const getLogged = async () => {
    setLogged(await getLoginStatus())
  }

  useEffect(() => {
    getLogged()
  }, [])

  return (
    <>
      <Sidebar logged={logged} history={history} loading={loading} />
      <MobileNavbar logged={logged} selectedList={selectedList} />
      <ListNavbar logged={logged} selectedList={selectedList} />
    </>
  )
}