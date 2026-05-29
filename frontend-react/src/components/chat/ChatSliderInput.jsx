import RangeSlider from '../RangeSlider'

export default function ChatSliderInput({ questionIndex, pendingRange, onChange, onConfirm }) {
  return (
    <div className="chat-input-dock">
      <div className="chat-input-dock__hint">שאלה {questionIndex + 1} מתוך 12</div>
      <RangeSlider label="" value={pendingRange} onChange={onChange} />
      <button className="btn btn-primary" onClick={() => onConfirm(pendingRange)}>
        אשר
      </button>
    </div>
  )
}
