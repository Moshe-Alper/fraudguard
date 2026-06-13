import BonusAlerts from '../BonusAlerts'

export default function ChatResultMessage({ resultData, bonusData }) {
  return (
    <div>
      {bonusData?.length > 0 && <BonusAlerts bonuses={bonusData} />}
    </div>
  )
}
