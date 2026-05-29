import { useState, useRef, useEffect } from 'react'
import { getRecommendation } from '../services/recommend.service'
import ChatMessage from './chat/ChatMessage'
import ChatSliderInput from './chat/ChatSliderInput'

const QUESTIONS = [
  { index: 0,  label: 'עד כמה קריטית דרישת זמן אמת?' },
  { index: 1,  label: 'עד כמה חשובה מהירות תגובה מקצה לקצה?' },
  { index: 2,  label: 'עד כמה נדרש קומינ מילולי (ולא רק ציון)?' },
  { index: 3,  label: 'עד כמה קריטית שקיפות אלגוריתמית?' },
  { index: 4,  label: 'עד כמה חמורה מגבלת התקציב לרכישת שרתים?' },
  { index: 5,  label: 'עד כמה חשוב לצמצם עלויות תפעול שוטפות?' },
  { index: 6,  label: 'האם נתוני השטח נוטים להיות "מלוכלכים"?' },
  { index: 7,  label: 'עד כמה מאתגר לסנכרן בין ערוצי המידע השונים?' },
  { index: 8,  label: 'עד כמה חשוב לארגון להשתמש בקוד פתוח?' },
  { index: 9,  label: 'עד כמה קריטי שמידע פנים-ארגוני יישאר בשרתי החברה?' },
  { index: 10, label: 'עד כמה גבוהי דיוק הם הערך הכי חשוב לחברה?' },
  { index: 11, label: 'האם הארגון מוכן להשקיע יותר זמן עיבוד כדי שלא יפספס הונאה?' },
]

const GREETING = 'שלום! אני FraudGuard, כאן לעזור לך לבחור את הארכיטקטורה המתאימה לזיהוי הונאה. אשאל אותך 12 שאלות קצרות — כל אחת מדורגת בסולם 1–5.'

function newId() { return `${Date.now()}-${Math.random()}` }
function botMsg(content, extra = {}) { return { id: newId(), role: 'bot', type: 'text', content, ...extra } }
function userMsg(content) { return { id: newId(), role: 'user', type: 'text', content } }

const DEFAULT_ANSWERS = () => Array.from({ length: 12 }, () => 3)

export default function ChatBot() {
  const [messages, setMessages] = useState([botMsg(GREETING)])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [pendingValue, setPendingValue] = useState(3)
  const [phase, setPhase] = useState('asking')
  const answersRef = useRef(DEFAULT_ANSWERS())
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const t = setTimeout(() => pushQuestion(0), 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pushQuestion(idx) {
    setMessages(prev => [...prev, botMsg(QUESTIONS[idx].label)])
    setCurrentIndex(idx)
  }

  async function onConfirm(value) {
    answersRef.current[currentIndex] = value
    setMessages(prev => [
      ...prev,
      userMsg(`בחרתי: ${value} מתוך 5`),
      { id: 'typing', role: 'bot', type: 'typing' },
    ])

    setTimeout(async () => {
      setMessages(prev => prev.filter(m => m.id !== 'typing'))

      if (currentIndex < 11) {
        pushQuestion(currentIndex + 1)
        setPendingValue(3)
      } else {
        setPhase('loading')
        try {
          const data = await getRecommendation(answersRef.current)
          setMessages(prev => [
            ...prev,
            botMsg('ניתחתי את תשובותיך. הנה ההמלצה שלי:'),
            botMsg(null, { type: 'result', resultData: data, bonusData: data.bonuses }),
          ])
          setPhase('done')
        } catch {
          setMessages(prev => [...prev, botMsg('משהו השתבש. אנא נסה שוב.')])
          setPhase('error')
        }
      }
    }, 600)
  }

  function onReset() {
    answersRef.current = DEFAULT_ANSWERS()
    setMessages([botMsg(GREETING)])
    setCurrentIndex(-1)
    setPendingValue(3)
    setPhase('asking')
    setTimeout(() => pushQuestion(0), 400)
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(m => <ChatMessage key={m.id} message={m} />)}
        {phase === 'done' && (
          <button className="btn btn-primary chat-reset-btn" onClick={onReset}>
            התחל מחדש
          </button>
        )}
        {phase === 'error' && (
          <button className="btn btn-secondary chat-reset-btn" onClick={onReset}>
            נסה שוב
          </button>
        )}
        <div ref={bottomRef} />
      </div>

      {phase === 'asking' && currentIndex >= 0 && (
        <ChatSliderInput
          questionIndex={currentIndex}
          pendingValue={pendingValue}
          onChange={setPendingValue}
          onConfirm={onConfirm}
        />
      )}
    </div>
  )
}
