import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import EditPermission from './ManagePermission/EditPermission'
import PermissionItem from './ManagePermission/PermissionItem'

function ManagePermission() {
  const [active, setActive] = useState(null)

  return (
    <>
      <div className='flex flex-col grow max-h-min overflow-hidden'>
        <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jogosultságok
          <button onClick={() => setActive({ new: true })}><FontAwesomeIcon icon={faUserPlus} /></button>
        </div>

        <div className='flex flex-col grow gap-2.5 min-h-0 overflow-auto'>
          <PermissionItem user={{ id: 1, username: 'User 1' }} permission={1} setActive={setActive} />
          <PermissionItem user={{ id: 2, username: 'User 2' }} permission={2} setActive={setActive} />
          <PermissionItem user={{ id: 3, username: 'User 3' }} permission={3} setActive={setActive} />
          <PermissionItem user={{ id: 4, username: 'User 4' }} permission={1} setActive={setActive} />
        </div>
      </div>

      {active ? <EditPermission active={active} setActive={setActive} /> : <></>}
    </>
  )
}

export default ManagePermission