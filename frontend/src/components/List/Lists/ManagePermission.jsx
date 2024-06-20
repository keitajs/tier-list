import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import EditPermission from './ManagePermission/EditPermission'
import PermissionItem from './ManagePermission/PermissionItem'
import Box from '../../ui/Box'

function ManagePermission({ activeList, setActiveList, setLists }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    // Bezárja a módosítást / hozzáadást, ha vált a listák között
    setActive(null)
  }, [activeList])

  return (
    <Box>
      <div className='flex flex-col grow max-h-min -m-5 p-5 overflow-hidden'>
        <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          Jogosultságok
          <button id='add' onClick={() => setActive(active => active?.new ? null : { new: true })}><FontAwesomeIcon icon={faUserPlus} /></button>
          <Tooltip anchorSelect='#add' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Új jogosultság</Tooltip>
        </div>

        <div className='flex flex-col grow gap-2.5 min-h-0 -mr-2 pr-2 overflow-y-auto'>
          {activeList.permissions.length > 0 ? activeList.permissions.map((permission, i) => <PermissionItem key={i} user={permission.user} permission={permission} active={active} setActive={setActive} />) : <div className='flex items-center justify-center h-full opacity-50'>Nem található jogosultság.</div>}
        </div>
      </div>

      {active && <EditPermission activeList={activeList} setActiveList={setActiveList} setLists={setLists} active={active} setActive={setActive} />}
    </Box>
  )
}

export default ManagePermission