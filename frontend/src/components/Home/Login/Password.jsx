import React from 'react'
import Input from '../../Form/Input'

function Password(props) {
  const passwordChange = (e) => {
    props.setPassword(e.target.value)

    if (e.target.value === '') props.setPasswordMsg('Adj meg egy jelszót!')
    else props.setPasswordMsg('')
  }

  return (
    <Input name='password' label='Jelszó' type='password' value={props.password} message={props.passwordMsg} onChange={passwordChange} reset={props.active} />
  )
}

export default Password