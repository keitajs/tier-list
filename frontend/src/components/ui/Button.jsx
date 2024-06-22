import { Link } from "react-router-dom"

export default function Button({ children, width, padding, text, color, hover, href, target, onClick, className, disabled }) {
  if (!color || color === 'primary') {
    color = 'bg-blue-500'
    hover = 'hover:bg-blue-400'
  }
  else
  if (color === 'success') {
    color = 'bg-emerald-600'
    hover = 'hover:bg-emerald-500'
  }
  else
  if (color === 'danger') {
    color = 'bg-rose-600'
    hover = 'hover:bg-rose-500'
  }

  const btnClass = `
    ${width ? `w-${width}` : 'w-full'}
    ${width === 'max' || width === 'min' ? 'px-8' : 'px-0'}
    ${padding === 1 ? 'py-1' : 'py-1.5'}
    ${text ? `text-${text}` : 'text-base'}
    rounded-lg
    ${color || 'bg-blue-500'}
    ${disabled ? 'cursor-not-allowed' : hover || 'hover:bg-blue-400'}
    transition-colors
    ${className ?? ''}
  `

  return href ? (<Link to={href} target={target} className={btnClass}>{children}</Link>) : (<button className={btnClass} onClick={onClick} disabled={disabled}>{children}</button>)
}