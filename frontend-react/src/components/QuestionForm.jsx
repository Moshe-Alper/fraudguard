import RangeSlider from './RangeSlider'

const QUESTIONS = [
  { index: 0,  category: 'Operational', label: 'How critical is real-time response?' },
  { index: 1,  category: 'Operational', label: 'How important is low processing latency?' },
  { index: 2,  category: 'Managerial',  label: 'How important is verbal reasoning explainability?' },
  { index: 3,  category: 'Managerial',  label: 'How important is algorithmic transparency?' },
  { index: 4,  category: 'Economic',    label: 'How constrained is your hardware budget?' },
  { index: 5,  category: 'Economic',    label: 'How important is minimizing ongoing operational costs?' },
  { index: 6,  category: 'Technical',   label: 'How noisy is your input data?' },
  { index: 7,  category: 'Technical',   label: 'How complex is audio-video synchronization in your use case?' },
  { index: 8,  category: 'Strategic',   label: 'How important is technological independence?' },
  { index: 9,  category: 'Strategic',   label: 'How critical is keeping data on-premises?' },
  { index: 10, category: 'Quality',     label: 'How important is detection accuracy?' },
  { index: 11, category: 'Quality',     label: 'How willing are you to trade resources for performance?' },
]

const CATEGORIES = ['Operational', 'Managerial', 'Economic', 'Technical', 'Strategic', 'Quality']

export default function QuestionForm({ answers, onSliderChange, onSubmit, loading, error }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <div className="flex-col gap-6">
        {CATEGORIES.map(cat => (
          <section key={cat} className="question-form__category">
            <div className="question-form__category-title">{cat}</div>
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
            {loading ? 'Analysing…' : 'Get Recommendation'}
          </button>
        </div>
      </div>
    </form>
  )
}
