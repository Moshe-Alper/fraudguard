import { useState, useRef, useEffect } from 'react'
import { getRecommendation } from '../services/recommend.service'
import ChatMessage from './chat/ChatMessage'
import ChatSliderInput from './chat/ChatSliderInput'

const GREETING = 'שלום! אני FraudGuard, כאן לעזור לך לבחור את הארכיטקטורה המתאימה לזיהוי הונאה. נתחיל בשאלה אחת חשובה שתכוון אותנו לכיוון הנכון עבורך.'

const OPENING = {
  question: 'מעולה! נתחיל בהחלטה הגדולה ביותר של הארגון שלך. לא רוצים לבזבז לך זמן! מהי "האמינות" המרכזית של החברה שלך שצריכה להיות מוכחת בזמן אמת דרך וידאו?',
  options: [
    {
      id: 'path1',
      label: 'ביצוע, יעילות ומהירות',
      description: 'המערכת צריכה לעבוד מהר, לתת התרעות מיידיות (בשניות), ולא להציג אחוזים אלא אינדיקציה ברורה',
    },
    {
      id: 'path2',
      label: 'דיוק, אמינות ואסטרטגיה',
      description: 'מעקב מדויק ומפורט עם שקיפות מלאה, מנהלים צריכים להבין ולסמוך ולקבל הסברים ברורים',
    },
  ],
}

const PATHS = {
  path1: {
    questions: [
      'עד כמה חשוב לך לזהות שקרים בזמן אמת במהלך שידור חי, ולאמת זאת מיידית במקום להמתין לבדיקת מסד נתונים?',
      'עד כמה חשוב שהמערכת תספק משוב ויזואלי מיידי (בתוך שניות) כשהיא מזהה שמשהו לא תקין?',
      'עד כמה חשוב לך לקבל הסבר ברור במילים (לדוגמה: "המערכת חושבת שהם משקרים") במקום רק אחוזים או מדדים מספריים?',
      'עד כמה מחמירה ומוגבלת מגבלת התקציב שלך לרכישת חומרה יקרה ו-GPUs חזקים?',
      'עד כמה חשוב לך לשמור על עלויות תחזוקה שוטפות ואימון מודלים קטנים?',
      'האם ההצגות שלך מתרחשות בתנאי שטח קשים (אינטרנט גרוע, שמע גרוע, וידאו מבולגן)?',
      'עד כמה מורכב הצורך שלך בסנכרון טכני בין מקורות מידע (יישור מדויק בין גוון קול ופנים)?',
    ],
    redirectAt: 2,
    redirectThreshold: 4,
    redirectTo: 'path2',
    redirectMsg: 'רגע, עצרתי את הבוט — שמנו לב שאתה מדגיש הסברים ברורים, שהם קריטיים עבורך! אני מעביר אותך לפתרון שמראה לך בדיוק מה המודל מזהה. המודל עובד כמו קופסה שחורה — הוא יכול לזהות דברים או לטעות ואנחנו לא יכולים לראות למה. ואני רוצה לעזור לך להבין את האמון האמיתי של המנהלים, ולעבור להגדרה שמראה לך מה באמת עומד על הפרק...',
  },
  path2: {
    questions: [
      'עד כמה חשוב לך לקבל הסברים ברורים במילים (לדוגמה: "המערכת חושבת שהם משקרים") במקום רק אחוזים או מדדים מספריים?',
      'עד כמה קריטי שהמנהלים שלך יבינו איך המערכת הגיעה להחלטתה, ולא יקבלו החלטה סגורה מ"קופסה שחורה"?',
      'עד כמה מחמיר ומוגבל התקציב שלך לרכישת חומרה יקרה ו-GPUs חזקים?',
      'עד כמה חשוב להתאים לדיוק מקסימלי (אפילו בתנאים קשים) כערך הכי קריטי?',
      'האם תהיה מוכן לעבוד עם זמן עיבוד ארוך יותר או כוח חישובי חזק יותר?',
      'עד כמה חשוב לך שהמערכת מבוססת על קוד פתוח, ולא תלויה בשירותים חיצוניים?',
      'עד כמה קריטי שהחיישנים וההקלטות נשמרים רק בתוך הצוות שלך, ולא יוצאים לשירותים חיצוניים?',
    ],
    redirectAt: 2,
    redirectThreshold: 4,
    redirectTo: 'path1',
    redirectMsg: 'חשיבה טובה! חישוב חדש בוצע בלולאה הזו. זה מאותת לי שאתה רוצה את המודלים המדויקים והעמוקים ביותר, אבל התקציב שלך מחמיר בכל הנוגע לחומרה יקרה. מודלים עמוקים הם כבדים ויקרים מאוד. אני מעביר אותנו לחלק היעילות — בואו נבדוק מה באמת עומד על הפרק על בסיס התנאים שלך...',
  },
}

const TOTAL_QUESTIONS = 7

function newId() { return `${Date.now()}-${Math.random()}` }
function botMsg(content, extra = {}) { return { id: newId(), role: 'bot', type: 'text', content, ...extra } }
function userMsg(content) { return { id: newId(), role: 'user', type: 'text', content } }

const DEFAULT_ANSWERS = () => Array.from({ length: TOTAL_QUESTIONS }, () => 3)

export default function ChatBot() {
  const [messages, setMessages] = useState([botMsg(GREETING)])
  const [phase, setPhase] = useState('opening')
  const [activePath, setActivePath] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [pendingValue, setPendingValue] = useState(3)
  const [redirected, setRedirected] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const answersRef = useRef(DEFAULT_ANSWERS())
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages(prev => [...prev, botMsg(OPENING.question)])
    }, 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startPath(pathId) {
    const choiceLabel = OPENING.options.find(o => o.id === pathId).label
    setActivePath(pathId)
    setMessages(prev => [
      ...prev,
      userMsg(`בחרתי: ${choiceLabel}`),
      { id: 'typing', role: 'bot', type: 'typing' },
    ])
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        botMsg(PATHS[pathId].questions[0]),
      ])
      setQuestionIndex(0)
      setPhase('asking')
    }, 600)
  }

  async function onConfirm(value) {
    setIsConfirming(true)
    answersRef.current[questionIndex] = value
    setMessages(prev => [
      ...prev,
      userMsg(`בחרתי: ${value} מתוך 5`),
      { id: 'typing', role: 'bot', type: 'typing' },
    ])

    setTimeout(async () => {
      setMessages(prev => prev.filter(m => m.id !== 'typing'))

      const path = PATHS[activePath]
      const isRedirectPoint =
        questionIndex === path.redirectAt &&
        value >= path.redirectThreshold &&
        !redirected

      if (isRedirectPoint) {
        const newPathId = path.redirectTo
        setRedirected(true)
        setActivePath(newPathId)
        setMessages(prev => [...prev, botMsg(path.redirectMsg)])
        // isConfirming stays true until new question appears to block slider interaction
        setTimeout(() => {
          setMessages(prev => [...prev, botMsg(PATHS[newPathId].questions[3])])
          setQuestionIndex(3)
          setPendingValue(3)
          setIsConfirming(false)
        }, 900)
      } else if (questionIndex < TOTAL_QUESTIONS - 1) {
        setMessages(prev => [...prev, botMsg(PATHS[activePath].questions[questionIndex + 1])])
        setQuestionIndex(questionIndex + 1)
        setPendingValue(3)
        setIsConfirming(false)
      } else {
        setPhase('loading')
        try {
          const data = await getRecommendation(activePath, answersRef.current, redirected)
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
    setActivePath(null)
    setQuestionIndex(-1)
    setPendingValue(3)
    setPhase('opening')
    setRedirected(false)
    setIsConfirming(false)
    setTimeout(() => {
      setMessages(prev => [...prev, botMsg(OPENING.question)])
    }, 400)
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

      {phase === 'opening' && (
        <div className="chat-input-dock chat-input-dock--choices">
          {OPENING.options.map(option => (
            <button
              key={option.id}
              className="btn btn-choice"
              onClick={() => startPath(option.id)}
            >
              <span className="btn-choice__label">{option.label}</span>
              <span className="btn-choice__desc">{option.description}</span>
            </button>
          ))}
        </div>
      )}

      {phase === 'asking' && questionIndex >= 0 && (
        <ChatSliderInput
          questionIndex={questionIndex}
          pendingValue={pendingValue}
          onChange={setPendingValue}
          onConfirm={onConfirm}
          disabled={isConfirming}
        />
      )}
    </div>
  )
}
