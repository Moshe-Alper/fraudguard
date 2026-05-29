export default function RangeSlider({ label, value, onChange }) {
  const [lo, hi] = value

  function handleLo(e) {
    const next = parseFloat(e.target.value)
    onChange([next, Math.max(next, hi)])
  }

  function handleHi(e) {
    const next = parseFloat(e.target.value)
    onChange([Math.min(lo, next), next])
  }

  const midpoint = ((lo + hi) / 2).toFixed(1)

  return (
    <div className="range-slider">
      <div className="range-slider__label">{label}</div>
      <div className="range-slider__tracks">
        <div className="range-slider__track">
          <span>Low</span>
          <input type="range" min="1" max="5" step="0.5" value={lo} onChange={handleLo} />
          <span>{lo}</span>
        </div>
        <div className="range-slider__track">
          <span>High</span>
          <input type="range" min="1" max="5" step="0.5" value={hi} onChange={handleHi} />
          <span>{hi}</span>
        </div>
      </div>
      <div className="range-slider__midpoint">Midpoint: {midpoint}</div>
    </div>
  )
}
