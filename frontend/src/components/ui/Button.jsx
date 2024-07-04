import { useState } from "react"
import { Link } from "react-router-dom"

export default function Button({ children, width, padding, text, color, hover, href, target, onClick, className, disabled }) {
  const [loading, setLoading] = useState(false)

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

  const clickEvent = async () => {
    if (!onClick) return
    setLoading(true)

    try {
      await onClick()
    } catch (error) {
      console.warn('Something went wrong')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (<>{
    href ? 
      <Link to={href} target={target} className={btnClass}>{children}</Link>
    :
      <button
        className={`
          relative
          ${width ? `w-${width}` : 'w-full'}
          ${width === 'max' || width === 'min' ? 'px-8' : 'px-0'}
          ${padding === 1 ? 'py-1' : 'py-1.5'}
          ${text ? `text-${text}` : 'text-base'}
          rounded-lg
          ${color || 'bg-blue-500'}
          ${disabled ? 'cursor-not-allowed' : hover || 'hover:bg-blue-400'}
          ${!disabled ? 'active:scale-95' : ''}
          ${loading ? 'cursor-not-allowed' : ''}
          transition-[transform_colors]
          ${className ?? ''}
        `}
        onClick={clickEvent}
        disabled={disabled || loading}
      >
        <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>

        {loading &&
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-1/2 aspect-square">
            <div className="w-full h-full rounded-full border-2 border-white/50 border-t-white border-r-white animate-spin"></div>
          </div>
        }
      </button>
  }</>)
}