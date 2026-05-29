import RangeSlider from './RangeSlider'

const QUESTIONS = [
  { index: 0,  category: 'Operational', label: 'עד כמה קריטית דרישת זמן אמת?' },
  { index: 1,  category: 'Operational', label: 'עד כמה חשובה מהירות תגובה מקצה לקצה?' },
  { index: 2,  category: 'Managerial',  label: 'עד כמה נדרש קומינ מילולי (ולא רק ציון)?' },
  { index: 3,  category: 'Managerial',  label: 'עד כמה קריטית שקיפות אלגוריתמית?' },
  { index: 4,  category: 'Economic',    label: 'עד כמה חמורה מגבלת התקציב לרכישת שרתים?' },
  { index: 5,  category: 'Economic',    label: 'עד כמה חשוב לצמצם עלויות תפעול שוטפות?' },
  { index: 6,  category: 'Technical',   label: 'האם נתוני השטח נוטים להיות "מלוכלכים"?' },
  { index: 7,  category: 'Technical',   label: 'עד כמה מאתגר לסנכרן בין ערוצי המידע השונים?' },
  { index: 8,  category: 'Strategic',   label: 'עד כמה חשוב לארגון להשתמש בקוד פתוח?' },
  { index: 9,  category: 'Strategic',   label: 'עד כמה קריטי שמידע פנים-ארגוני יישאר בשרתי החברה?' },
  { index: 10, category: 'Quality',     label: 'עד כמה גבוהי דיוק הם הערך הכי חשוב לחברה?' },
  { index: 11, category: 'Quality',     label: 'האם הארגון מוכן להשקיע יותר זמן עיבוד כדי שלא יפספס הונאה?' },
]

const CATEGORY_LABELS = {
  Operational: 'ממד מבצעי (זמן אמת)',
  Managerial:  'ממד ניהולי (הסברתיות ואמון)',
  Economic:    'ממד כלכלי (תקציב ומשאבים)',
  Technical:   'ממד טכני (סביבת עבודה)',
  Strategic:   'ממד אסטרטגי (קוד פתוח ואבטחה)',
  Quality:     'ממד איכותי (דיוק)',
}

const CATEGORIES = ['Operational', 'Managerial', 'Economic', 'Technical', 'Strategic', 'Quality']

export default function QuestionForm({ answers, onSliderChange, onSubmit, loading, error }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <div className="flex-col gap-6">
        {CATEGORIES.map(cat => (
          <section key={cat} className="question-form__category">
            <div className="question-form__category-title">{CATEGORY_LABELS[cat]}</div>
            {QUESTIONS.filter(q => q.category === cat).map(q => (
              <RangeSlider
                key={q.index}
                label={q.label}
                value={answers[q.index]}
                onChange={range => onSliderChange(q.index, range)}
              />
            ))}
          </section>
        ))}

        {error && <div className="question-form__error">{error}</div>}

        <div className="question-form__submit">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'מנתח...' : 'קבל המלצה'}
          </button>
        </div>
      </div>
    </form>
  )
}
