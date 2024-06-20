import { Tooltip } from 'react-tooltip'

export default function CustomTooltip({ children, id, place }) {
  return (
    <Tooltip anchorSelect={'#' + id} place={place} className='!px-3 !py-1.5 !text-xs !rounded-lg !bg-neutral-950'>{children}</Tooltip>
  )
}