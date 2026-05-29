import { RotateCcw } from 'lucide-react'

export default function ResultCard({ result, onReset }) {
  const { recommendation, rationale, scores } = result
  const max = 5

  const scoreRows = [
    { label: 'יעילות מבצעית',      value: scores.operationalEfficiency, accent: false },
    { label: 'דיוק ואמון ניהולי',  value: scores.accuracyAndTrust,      accent: true  },
  ]

  return (
    <div className="result-card">
      <div>
        <div className="result-card__badge">המלצה</div>
        <h2 className="result-card__title" style={{ marginTop: '0.5rem' }}>{recommendation}</h2>
      </div>

      <p className="result-card__rationale">{rationale}</p>

      <div className="result-card__scores">
        {scoreRows.map(({ label, value, accent }) => (
          <div key={label} className="result-card__score-row">
            <div className="result-card__score-label">
              <span>{label}</span>
              <span>{value} / {max}</span>
            </div>
            <div className="result-card__score-bar-track">
              <div
                className={`result-card__score-bar-fill${accent ? ' result-card__score-bar-fill--accent' : ''}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="result-card__footer">
        <button className="btn btn-secondary" onClick={onReset}>
          <RotateCcw size={15} />
          התחל מחדש
        </button>
      </div>
    </div>
  )
}
