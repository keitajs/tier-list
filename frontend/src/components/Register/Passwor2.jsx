import React from 'react'
import Input from '../Form/Input'

function Passwor2(props) {
  const passwor2Change = (e) => {
    const { value } = e.target
    props.setPasswor2(value)

    if (value === '') return props.setPasswor2Msg('Add meg újra a jelszót!')
    if (value !== props.password) return props.setPasswor2Msg('A két jelszó nem egyezik!')
    props.setPasswor2Msg('')
  }

  return (
    <Input name='password2' label='Password again' type='password' value={props.passwor2} message={props.passwor2Msg} onChange={passwor2Change} />
  )
}

export default Passwor2