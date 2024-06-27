export default function DoughnutChart({ hover, setHover, size = 200, strokeWidth = 20, totalPercentage = 100, gap = 2, segments = [], className }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Adjust segments percentages to fit within totalPercentage
  const adjustedSegments = segments.map(segment => ({
    ...segment,
    percentage: (segment.percentage / 100) * totalPercentage,
  }))

  // Calculate the initial offset to center the gap at the bottom
  const initialOffset = circumference * ((100 - totalPercentage) / 100) / 2
  const length = adjustedSegments.length
  let offset = initialOffset

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className ?? ''}>
      {adjustedSegments.map(segment => {
        const finalPercentage = segment.percentage - (gap * (length - 1) / length)
        const segmentLength = ((finalPercentage >= 0 ? finalPercentage : 0) / 100) * circumference
        const gapLength = (gap / 100) * circumference
        const segmentOffset = offset
        offset += segmentLength + gapLength
        return (
          <circle
            key={segment.name ?? segment.color}
            onMouseEnter={() => setHover(segment.name)}
            onMouseLeave={() => setHover(null)}
            className={`[pointer-events:stroke] ${hover === segment.name ? 'brightness-150' : ''} transition-all duration-200`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference}`}
            strokeDashoffset={-segmentOffset}
            transform={`rotate(90 ${size / 2} ${size / 2})`}
          />
        )
      })}
    </svg>
  )
}