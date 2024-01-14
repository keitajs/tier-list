import React from 'react'

import Sidebar from '../components/Sidebar'

function Profile(props) {
  return (
    <div>
      <Sidebar history={props.history} />
    </div>
  )
}

export default Profile