import { useEffect } from 'react'
import { InputContainer, Label, Input, Error } from './Input'

export default function Password({ label, name, type, value, value2, setValue, error, setError, setError2, errors, margin, className, reset, disabled }) {
  const onChange = (e) => {
    const { value } = e.target
    setValue(value)
  }

  const handleErrors = () => {
    if (!type || type === 'password' || type === 'p') {
      if (value === '') setError(errors?.empty || 'Adj meg egy jelszót!')
      else setError('')
    }
    else
    if (type === 'passwordWithConfirm' || type === 'pwc') {
      if (value !== value2) setError2(errors?.notEqual || 'A két jelszó nem egyezik!')
      else if (value2 !== '') setError2('')
      if (value === '') return setError(errors?.empty || 'Adj meg egy jelszót!')
      if (value.length < 8) return setError(errors?.valid || 'A jelszavadnak legalább 8 karakter hosszúnak kell lennie!')
      setError('')
    }
    else
    if (type === 'passwordConfirm' || type === 'pc') {
      if (value === '') return setError(errors?.confirmEmpty || 'Add meg újra a jelszót!')
      if (value !== value2) return setError(errors?.notEqual || 'A két jelszó nem egyezik!')
      setError('')
    }
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <InputContainer className={margin}>
      <Label htmlFor={name || 'password'} password>{label || 'Jelszó'}</Label>
      <Input type='password' id={name || 'password'} name={name || 'password'} maxLength={128} value={value} onChange={onChange} error={error} className={className} reset={reset} disabled={disabled} />
      <Error>{error}</Error>
    </InputContainer>
  )
}