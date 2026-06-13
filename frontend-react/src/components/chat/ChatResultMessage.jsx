import BonusAlerts from '../BonusAlerts'

export default function ChatResultMessage({ resultData, bonusData }) {
  if (!bonusData?.length) return null
  return <BonusAlerts bonuses={bonusData} />
}
