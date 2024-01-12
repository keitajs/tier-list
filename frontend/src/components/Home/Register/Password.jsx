import React from 'react'
import Input from '../../Form/Input'

function Password(props) {
  const passwordChange = (e) => {
    const { value } = e.target
    props.setPassword(value)

    if (value !== props.passwor2) props.setPasswor2Msg('A két jelszó nem egyezik!')
    else if (props.passwor2 !== '') props.setPasswor2Msg('')
    if (value === '') return props.setPasswordMsg('Adj meg egy jelszót!')
    if (value.length < 8) return props.setPasswordMsg('A jelszavadnak legalább 8 karakter hosszúnak kell lennie!')
    props.setPasswordMsg('')
  }

  return (
    <Input name='pass1' label='Jelszó' type='password' value={props.password} message={props.passwordMsg} onChange={passwordChange} reset={props.active} />
  )
}

export default Password