import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import QuestionForm from './components/QuestionForm'
import ResultCard from './components/ResultCard'
import BonusAlerts from './components/BonusAlerts'
import { getRecommendation } from './services/recommend.service'
import './style/main.css'

const DEFAULT_ANSWERS = Array.from({ length: 12 }, () => [2, 4])

export default function App() {
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState('light')

  function onSliderChange(index, range) {
    setAnswers(prev => {
      const next = [...prev]
      next[index] = range
      return next
    })
  }

  async function onSubmit() {
    setLoading(true)
    setError(null)
    try {
      const midpoints = answers.map(([lo, hi]) => (lo + hi) / 2)
      const data = await getRecommendation(midpoints)
      setResult(data)
    } catch (err) {
      setError('משהו השתבש. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  function onReset() {
    setAnswers(DEFAULT_ANSWERS)
    setResult(null)
    setError(null)
  }

  function onToggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.dataset.theme = next === 'dark' ? 'dark' : ''
  }

  return (
    <div className="container">
      <header className="app-header">
        <span className="app-logo">FraudGuard</span>
        <button className="btn-icon" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      <main>
        {!result && (
          <QuestionForm
            answers={answers}
            onSliderChange={onSliderChange}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
          />
        )}

        {result && (
          <div className="flex-col gap-6">
            <ResultCard result={result} onReset={onReset} />
            <BonusAlerts bonuses={result.bonuses} />
          </div>
        )}
      </main>
    </div>
  )
}
