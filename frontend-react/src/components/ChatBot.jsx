import { useState, useRef, useEffect } from 'react'
import { getRecommendation } from '../services/recommend.service'
import ChatMessage from './chat/ChatMessage'
import ChatSliderInput from './chat/ChatSliderInput'

const GREETING = 'שלום! אני FraudGuard, כאן לעזור לך לבחור את הארכיטקטורה המתאימה לזיהוי הונאה. נתחיל בשאלה אחת חשובה שתכוון אותנו לכיוון הנכון עבורך.'

const OPENING = {
  question: 'היי! כדי שלא נבזבז זמן יקר, בוא נתחיל מההחלטה הכי גדולה של הארגון שלך. כשאתה חושב על מערכת לזיהוי הונאות בוידאו בזמן אמת, מהו ה\'אני מאמין\' המרכזי של החברה שלכם?',
  options: [
    {
      id: 'path1',
      label: 'הכי חשוב לנו שהמערכת תעבוד מהר, תגיב בשבריר שנייה ולא תקרע לנו את הכיס',
      description: 'המערכת צריכה לעבוד מהר, לתת התרעות מיידיות (בשניות), ולא להציג אחוזים אלא אינדיקציה ברורה',
    },
    {
      id: 'path2',
      label: 'הכי חשוב לנו דיוק מוחלט במעבדה, ושקיפות מלאה כדי שהמנהלים יבינו ויסמכו על המסקנות',
      description: 'מעקב מדויק ומפורט עם שקיפות מלאה, מנהלים צריכים להבין ולסמוך ולקבל הסברים ברורים',
    },
  ],
}

const PATHS = {
  path1: {
    questions: [
      'עד כמה דחוף לכם לתפוס את השקר בשידור חי תוך כדי השיחה (למשל בזום), ולא בדיעבד אחרי שהיא מסתיימת?',
      'עד כמה חשוב לכם שהמערכת תיתן התראה מיידית (תוך שבריר שנייה) ברגע שמזהה חוסר אמינות?',
      'עד כמה חשוב לכם לקבל הסבר ברור במילים (כמו \'למה המערכת חושבת שהוא משקר\') במקום לקבל רק ציין יבש באחוזים?',
      'עד כמה מחמיר ומוגבל התקציב שלכם בכל הנוגע לרכישת שרתים יקרים וכרטיסי מסך (GPUs)?',
      'עד כמה חשוב לכם לשמור על עלויות תחזוקה והרצת מודלים נמוכות ביומיום?',
      'האם הראיונות שלכם מתבצעים לעיתים קרובות בתנאי שטח קשים (רעשי רקע באודיו, אינטרנט חלש, או וידאו מטושטש)?',
      'עד כמה מאתגר ומורכב הצורך שלכם לסנכרן טכנולוגית בין ערוצי המידע (למשל, להתאים בדיוק בין טון הדיבור לבין הבעות הפנים באותו שבריר שנייה)?',
    ],
    redirectAt: 2,
    redirectThreshold: 4,
    redirectTo: 'path2',
    redirectMsg: 'הופס, עצרתי רגע! שמתי לב שסימנת שהסבר מילולי ושקיפות הם קריטיים עבורכם! בארכיטקטורה מהירה וזולה, מנהלים בדרך כלל לא מקבלים הסברים כאלו כי המודל עובד כמו קופסה שחורה. מאחר ואני רוצה שלא תתפשר על האמון והדיוק של המנהלים, אני מנתב אותנו למסלול הניהולי והאמון. בוא נראה מה קורה אצלכם באבטחת המידע...',
  },
  path2: {
    questions: [
      'עד כמה חשוב לכם לקבל הסבר ברור במילים (כמו \'למה המערכת חושבת שהוא משקר\') במקום לקבל רק ציין יבש באחוזים?',
      'עד כמה קריטי למנהלים שלכם להבין איך המערכת הגיעה למסקנה שלה, ולא לקבל החלטה מ\'קופסה שחורה\' סגורה?',
      'עד כמה מחמיר ומוגבל התקציב שלכם לרכישת שרתים יקרים וכרטיסי מסך (GPUs)?',
      'עד כמה השאיפה לאחוזי דיוק מקסימליים (אפילו בתנאי מעבדה סטריליים) היא הערך החשוב ביותר עבורכם?',
      'האם תהיו מוכנים \'לשלם\' בזמן עיבוד ארוך יותר או כוח חישובי חזק, ובלבד שלא נפספס אף ניסיון מרמה?',
      'עד כמה חשוב לכם שהמערכת תתבסס על קוד פתוח, כדי שלא תהיו תלויים לחלוטין בחברות ענק חיצוניות?',
      'עד כמה קריטי שהסרטונים וההקלטות הרגישות יישארו ויעובדו רק בתוך שרתי החברה שלכם, בלי לצאת לענן חיצוני?',
    ],
    redirectAt: 2,
    redirectThreshold: 4,
    redirectTo: 'path1',
    redirectMsg: 'חכה, בוא נעשה חישוב מסלול מחדש! רציתם את המודלים המדויקים והעמוקים ביותר שיש, אבל עכשיו סימנת לי שיש לכם מגבלת תקציב חישקית להרצה. מודלים עמוקים הם כבדים ויקרים מאוד לרכישה. כדי שלא תקבלו המלצה שתקרוס לכם בתקציב או תגיב לאט, אני מעביר אותנו לנתיב היעילות והחיסכון. בואו נבדוק מה קורה אצלכם מבחינת תנאי השטח המבצעיים...',
  },
}

const TOTAL_QUESTIONS = 7

function newId() { return `${Date.now()}-${Math.random()}` }
function botMsg(content, extra = {}) { return { id: newId(), role: 'bot', type: 'text', content, ...extra } }
function userMsg(content) { return { id: newId(), role: 'user', type: 'text', content } }

const DEFAULT_ANSWERS = () => Array.from({ length: TOTAL_QUESTIONS }, () => 3)

export default function ChatBot() {
  const [messages, setMessages] = useState([botMsg(GREETING)])
  const [phase, setPhase] = useState('start')
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

  function startFlow() {
    setMessages(prev => [
      ...prev,
      userMsg('כן, בואו נתחיל!'),
      { id: 'typing', role: 'bot', type: 'typing' },
    ])
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        botMsg('מעולה! בואו נתחיל 🚀'),
        botMsg(OPENING.question),
      ])
      setPhase('opening')
    }, 600)
  }

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
            botMsg(data.summaryText),
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
    setPhase('start')
    setRedirected(false)
    setIsConfirming(false)
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

      {phase === 'start' && (
        <div className="chat-input-dock">
          <button className="btn btn-primary" onClick={startFlow}>
            כן, בואו נתחיל!
          </button>
        </div>
      )}

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
