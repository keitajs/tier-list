import React from 'react'
import Input from '../../Form/Input'

function Username(props) {
  const usernameChange = (e) => {
    props.setUsername(e.target.value)

    if (e.target.value === '') props.setNameMsg('Adj meg egy felhasználónevet!')
    else props.setNameMsg('')
  }

  return (
    <Input name='username' label='Felhasználónév' type='text' value={props.username} message={props.nameMsg} onChange={usernameChange} />
  )
}

export default Username