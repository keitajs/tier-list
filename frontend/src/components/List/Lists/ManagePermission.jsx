import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import EditPermission from './ManagePermission/EditPermission'
import PermissionItem from './ManagePermission/PermissionItem'

function ManagePermission(props) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    // Bezárja a módosítást / hozzáadást, ha vált a listák között
    setActive(null)
  }, [props.activeList])

  return (
    <>
      <div className='flex flex-col grow max-h-min overflow-hidden'>
        <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jogosultságok
          <button onClick={() => setActive(active => active?.new ? null : { new: true })}><FontAwesomeIcon icon={faUserPlus} /></button>
        </div>

        <div className='flex flex-col grow gap-2.5 min-h-0 overflow-auto'>
          {props.activeList.permissions.length > 0 ? props.activeList.permissions.map((permission, i) => <PermissionItem key={i} user={permission.user} permission={permission} active={active} setActive={setActive} />) : <div className='flex items-center justify-center h-full opacity-50'>Nem található jogosultság.</div>}
        </div>
      </div>

      {active ? <EditPermission activeList={props.activeList} setActiveList={props.setActiveList} setLists={props.setLists} active={active} setActive={setActive} /> : <></>}
    </>
  )
}

export default ManagePermission