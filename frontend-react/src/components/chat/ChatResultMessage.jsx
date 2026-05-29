import ResultCard from '../ResultCard'
import BonusAlerts from '../BonusAlerts'

export default function ChatResultMessage({ resultData, bonusData }) {
  return (
    <div>
      <ResultCard result={resultData} onReset={null} />
      {bonusData?.length > 0 && <BonusAlerts bonuses={bonusData} />}
    </div>
  )
}
