import { useEffect } from 'react'
import { InputContainer, Label, Input, Error } from './Input'

export default function Email({ children, label, value, setValue, error, setError, validation, errors, margin, className, disabled }) {
  const onChange = (e) => {
    const { value } = e.target
    setValue(value)
  }

  const handleErrors = () => {
    if (value === '') return setError(errors?.empty || 'Adj meg egy emailt!')
    if (validation && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return setError(errors?.valid || 'Az email cím nem megfelelő!')
    setError('')
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <InputContainer className={margin}>
      <Label htmlFor='email'>{label || 'Email'}</Label>
      <Input type='email' id='email' name='email' maxLength={128} value={value} onChange={onChange} error={error} className={className} disabled={disabled}>
        {children}
      </Input>
      <Error>{error}</Error>
    </InputContainer>
  )
}