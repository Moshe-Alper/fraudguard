import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import ChatBot from './components/ChatBot'
import './style/main.css'

export default function App() {
  const [theme, setTheme] = useState('light')

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
        <ChatBot />
      </main>
    </div>
  )
}
