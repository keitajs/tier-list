import React, { useEffect, useState } from 'react'
import { getLoginStatus } from '../user'
import Sidebar from './Navigation/Sidebar'
import ListNavbar from './Navigation/ListNavbar'
import MobileNavbar from './Navigation/MobileNavbar'

function Navigation({ history, selectedList, loading }) {
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

export default Navigation