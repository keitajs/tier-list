import { useEffect, useState } from 'react'
import { faEye, faArrowsUpDownLeftRight, faPen } from '@fortawesome/free-solid-svg-icons'
import { InputContainer, Label, Input } from '../../ui/Input'
import { Select, SelectButton } from '../../ui/Select'
import Button from '../../ui/Button'

export default function ManageUser({ newPermission, editPermission, active, setActive, activeList, setActiveList }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('Írj be egy felhasználónevet!')
  const [permission, setPermission] = useState(1)

  const createPermission = async () => {
    const error = await newPermission(name, permission)
    if (error) setError(error)
  }

  const updatePermission = async () => {
    const error = await editPermission(permission)
    if (error) setError(error)
  }

  useEffect(() =>{
    // Beállítja a megfelelő értékeket az alapján, hogy épp szerkeszt vagy új jogosultságot ad hozzá
    if (active.edit) {
      setName(active.user.username)
      setPermission(active.value)
    } else {
      setName('')
      setPermission(1)
    }
  }, [active])

  useEffect(() => {
    // Felhasználónév mező üresség ellenőrzés
    if (name === '') setError('Írj be egy felhasználónevet!')
    else setError('')
  }, [name])

  return (
    <div className='flex flex-col h-full'>
      <InputContainer className='!w-full !mb-3'>
        <Label htmlFor='name' className='!text-base'>Felhasználó {error && <span className='ml-0.5 text-sm text-rose-600'>{error}</span>}</Label>
        <Input type='text' id='name' name='name' maxLength={128} value={name} setValue={setName} error={error} onlyError={true} disabled={active.edit} className='!w-full' />
      </InputContainer>

      <Label className='!text-base'>Jogosultság</Label>
      <Select value={permission} setValue={setPermission} startIndex={1} className='w-full mb-3'>
        <SelectButton icon={faEye}>
          Megtekintés
        </SelectButton>
        <SelectButton icon={faArrowsUpDownLeftRight}>
          Mozgatás
        </SelectButton>
        <SelectButton icon={faPen}>
          Szerkesztés
        </SelectButton>
      </Select>

      <div className='text-sm text-center'>
        {permission === 1 ?
          <div className='flex flex-col items-center justify-center w-full px-3 py-1.5 rounded-lg bg-neutral-700/75'>
            <ul>
              <li>Lista megtekintése</li>
              <li>Karakter információk megtekintése</li>
            </ul>
          </div>
        :permission === 2 ?
          <div className='flex flex-col items-center justify-center w-full px-3 py-1.5 rounded-lg bg-neutral-700/75'>
            <ul>
              <li>Karakter mozgatás</li>
              <li>Kategória mozgatás</li>
              <li>+ Megtekintés funkciók</li>
            </ul>
          </div>
        :permission === 3 &&
          <div className='flex flex-col items-center justify-center w-full px-3 py-1.5 rounded-lg bg-neutral-700/75'>
            <ul>
              <li>Karakter hozzáadás</li>
              <li>Karakter szerkesztés</li>
              <li>Karakter törlés</li>
              <li>Kategória hozzáadás</li>
              <li>Kategória szerkesztés</li>
              <li>Kategória törlés</li>
              <li>+ Megtekintés és Mozgatás funkciók</li>
            </ul>
          </div>
        }

        <p className='mt-1 opacity-70'>A lista megnevezése, leírása, státusza és láthatósága kizárólag a készítője által szerkeszthető.</p>
      </div>

      <div className='flex gap-2 justify-center mt-auto'>
        <Button width='1/3' color='success' onClick={active.new ? createPermission : updatePermission} disabled={error}>{active.new? 'Hozzáadás' : 'Módosítás'}</Button>
        <Button width='1/3' color='danger' onClick={() => setActive(null)}>Mégsem</Button>
      </div>
    </div>
  )
}