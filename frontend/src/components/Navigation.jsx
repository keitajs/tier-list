import React from 'react'
import Sidebar from './Navigation/Sidebar'
import ListNavbar from './Navigation/ListNavbar'
import MobileNavbar from './Navigation/MobileNavbar'

function Navigation(props) {
  return (
    <>
      <Sidebar history={props.history} />
      <ListNavbar selectedList={props.selectedList} />
      <MobileNavbar selectedList={props.selectedList} />
    </>
  )
}

export default Navigation