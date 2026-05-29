export default function RangeSlider({ label, value, onChange }) {
  return (
    <div className="range-slider">
      <div className="range-slider__label">{label}</div>
      <div className="range-slider__tracks">
        <div className="range-slider__track">
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={value}
            onChange={e => onChange(parseFloat(e.target.value))}
          />
          <span>{value}</span>
        </div>
      </div>
    </div>
  )
}
