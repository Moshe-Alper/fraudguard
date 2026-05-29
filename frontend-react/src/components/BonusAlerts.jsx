import { Lightbulb } from 'lucide-react'

export default function BonusAlerts({ bonuses }) {
  if (!bonuses || bonuses.length === 0) return null

  return (
    <div className="bonus-alerts">
      <div className="bonus-alerts__title">Bonus Insights</div>
      {bonuses.map(bonus => (
        <div key={bonus.type} className="bonus-alert">
          <Lightbulb className="bonus-alert__icon" size={18} />
          <p className="bonus-alert__text">{bonus.text}</p>
        </div>
      ))}
    </div>
  )
}
