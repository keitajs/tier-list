export default function Button({ children, width, text, color, hover, onClick, className, disabled }) {
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

  return (
    <button
      className={`
        ${width ? `w-${width}` : 'w-full'}
        ${width === 'max' || width === 'min' ? 'px-8' : 'px-0'}
        py-1.5
        ${text ? `text-${text}` : 'text-base'}
        rounded-lg
        ${color || 'bg-blue-500'}
        ${disabled ? 'cursor-not-allowed' : hover || 'hover:bg-blue-400'}
        transition-colors
        ${className}
      `}
      onClick={onClick}
    >
        {children}
    </button>
  )
}