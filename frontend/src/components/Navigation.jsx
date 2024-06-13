import React, { useEffect, useState } from 'react'
import { getLoginStatus } from '../user'
import Sidebar from './Navigation/Sidebar'
import ListNavbar from './Navigation/ListNavbar'
import MobileNavbar from './Navigation/MobileNavbar'

function Navigation(props) {
  const [logged, setLogged] = useState(false)

  const getLogged = async () => {
    setLogged(await getLoginStatus())
  }

  useEffect(() => {
    getLogged()
  }, [])

  return (
    <>
      <Sidebar logged={logged} history={props.history} />
      <ListNavbar logged={logged} selectedList={props.selectedList} />
      <MobileNavbar logged={logged} selectedList={props.selectedList} />
    </>
  )
}

export default Navigation