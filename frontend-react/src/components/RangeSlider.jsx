export default function RangeSlider({ label, value, onChange }) {
  const [lo, hi] = value

  function handleLo(e) {
    const next = parseFloat(e.target.value)
    onChange([Math.min(next, hi), hi])
  }

  function handleHi(e) {
    const next = parseFloat(e.target.value)
    onChange([lo, Math.max(lo, next)])
  }

  const midpoint = ((lo + hi) / 2).toFixed(1)

  return (
    <div className="range-slider">
      <div className="range-slider__label">{label}</div>
      <div className="range-slider__tracks">
        <div className="range-slider__track">
          <span>נמוך</span>
          <input type="range" min="1" max="5" step="0.5" value={lo} onChange={handleLo} />
          <span>{lo}</span>
        </div>
        <div className="range-slider__track">
          <span>גבוה</span>
          <input type="range" min="1" max="5" step="0.5" value={hi} onChange={handleHi} />
          <span>{hi}</span>
        </div>
      </div>
      <div className="range-slider__midpoint">ממוצע: {midpoint}</div>
    </div>
  )
}
