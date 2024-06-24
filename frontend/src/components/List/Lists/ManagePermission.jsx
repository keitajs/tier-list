import React, { useEffect, useState } from 'react'
import { createPermission, updatePermission, removePermission } from '../../../user'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import ManageUser from './ManageUser'
import UserItem from './UserItem'

function ManagePermission({ activeList, setActiveList }) {
  const [active, setActive] = useState(null)

  const newPermission = async (username, permission) => {
    const data = await createPermission(activeList.id, username, permission)
    if (data.error) return data.error

    setActiveList(a => {
      a.permissions.push(data)
      return { ...activeList }
    })
    setActive(null)
  }

  const editPermission = async (permission) => {
    const data = await updatePermission(activeList.id, active.user.id, permission)
    if (data.error) return data.error

    setActiveList(a => {
      const p = a.permissions.find(permission => permission.user.id === active.user.id)
      console.log(p)
      p.value = permission
      return { ...activeList }
    })
    setActive(null)
  }

  const deletePermission = async () => {
    const data = await removePermission(activeList.id, active.user.id)
    if (data.error) return data.error

    setActiveList(a => {
      const p = a.permissions.findIndex(permission => permission.user.id === active.user.id)
      a.permissions.splice(p, 1)
      return { ...activeList }
    })
    setActive(null)
  }

  useEffect(() => {
    // Bezárja a módosítást / hozzáadást, ha vált a listák között
    setActive(null)
  }, [activeList])

  return (
    <>
      <div className='flex flex-col grow max-h-min -m-5 p-5 overflow-hidden'>
        <div className='flex items-center justify-between mb-5 px-3 pb-2 text-xl border-b-2 border-blue-500'>
          {!active && 'Jogosultságok'}
          {active?.new && 'Felhasználó hozzáadása'}
          {active?.edit && 'Felhasználó kezelése'}

          <div>
            {active?.edit &&
              <button onClick={deletePermission} className='flex items-center gap-2 group text-sm text-rose-600 hover:text-rose-500 ml-0 hover:ml-2 transition-all'>
                <div className='w-0 group-hover:w-32 max-w-max overflow-hidden transition-all'>
                  Törlés
                </div>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            }
            {!active &&
              <button id='add' onClick={() => setActive(active => active ? null : { new: true })}>
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
            }
          </div>
          <Tooltip anchorSelect='#add' place='top' className='!text-sm !rounded-lg !bg-neutral-950'>Új jogosultság</Tooltip>
        </div>

        {active ? 
          <ManageUser newPermission={newPermission} editPermission={editPermission} active={active} setActive={setActive} activeList={activeList} setActiveList={setActiveList} />
        :
          <div className='flex flex-col grow gap-2.5 min-h-0 -mr-2 pr-2 overflow-y-auto'>
            {activeList.permissions.length > 0 ?
              activeList.permissions.map((permission, i) =>
                <UserItem key={i} user={permission.user} permission={permission} active={active} setActive={setActive} />
              )
            :
              <div className='flex items-center justify-center h-full opacity-50'>
                Nem található felhasználó.
              </div>
            }
          </div>
        }
      </div>
    </>
  )
}

export default ManagePermission