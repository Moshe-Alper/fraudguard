import BonusAlerts from '../BonusAlerts'

const SCORE_LABELS = {
  operationalEfficiency: 'יעילות תפעולית',
  accuracyAndTrust: 'דיוק ואמון',
  economic: 'כלכליות',
  strategic: 'אסטרטגיה',
}

function ScoreBar({ label, value }) {
  const pct = Math.round((value / 5) * 100)
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
        <span>{label}</span>
        <span>{value.toFixed(1)} / 5</span>
      </div>
      <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-primary)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function ChatResultMessage({ resultData, bonusData }) {
  const scores = resultData?.scores

  return (
    <div>
      {scores && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>הציונים שהובילו להמלצה:</p>
          {Object.entries(SCORE_LABELS).map(([key, label]) => (
            scores[key] != null && <ScoreBar key={key} label={label} value={scores[key]} />
          ))}
        </div>
      )}
      {bonusData?.length > 0 && <BonusAlerts bonuses={bonusData} />}
    </div>
  )
}
