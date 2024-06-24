import { useEffect } from 'react'
import { InputContainer, Label, Input, Error } from './Input'

export default function Username({ label, value, setValue, error, setError, validation, errors, margin, className, disabled }) {
  const onChange = (e) => {
    const { value } = e.target
    setValue(value)
  }

  const handleErrors = () => {
    if (value === '') return setError(errors?.empty || 'Adj meg egy felhasználónevet!')
    if (validation && !/^[^ \!\"#\$%&'\(\)\*\+,\/:;<=>\?@\[\\\]\^`\{\|\}~]+$/gm.test(value)) return setError(errors?.valid || 'A felhasználóneved nem tartalmazhat speciális karaktereket és szóközöket!')
    setError('')
  }

  useEffect(() => {
    handleErrors()
  }, [value])

  return (
    <InputContainer className={margin}>
      <Label htmlFor='username'>{label || 'Felhasználónév'}</Label>
      <Input type='text' id='username' name='username' maxLength={128} value={value} onChange={onChange} error={error} className={className} disabled={disabled} />
      <Error>{error}</Error>
    </InputContainer>
  )
}