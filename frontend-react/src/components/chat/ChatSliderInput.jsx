import RangeSlider from '../RangeSlider'

export default function ChatSliderInput({ questionIndex, pendingValue, onChange, onConfirm }) {
  return (
    <div className="chat-input-dock">
      <div className="chat-input-dock__hint">שאלה {questionIndex + 1} מתוך 12</div>
      <RangeSlider label="" value={pendingValue} onChange={onChange} />
      <button className="btn btn-primary" onClick={() => onConfirm(pendingValue)}>
        אשר
      </button>
    </div>
  )
}
