import { useParams, useNavigate } from 'react-router-dom'
import QuizCard from '../components/QuizCard'
import ProgressDashboard from '../components/ProgressDashboard'
import { useState } from 'react'

const LANG_INFO: Record<string, { name: string; flag: string }> = {
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  moore: { name: 'Mooré', flag: '🇧🇫' },
  dioula: { name: 'Dioula', flag: '🇧🇫' },
  peulh: { name: 'Peulh', flag: '🇧🇫' },
}

export default function Practice() {
  const { lang = 'fr' } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState<'quiz' | 'progress'>('quiz')
  const info = LANG_INFO[lang] || { name: lang, flag: '🌍' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/learn/${lang}`)} className="text-gray-500 hover:text-white transition-all">
          ← Retour
        </button>
        <span className="text-2xl">{info.flag}</span>
        <h1 className="text-xl font-bold">Pratiquer — {info.name}</h1>
      </div>

      <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
        {(['quiz', 'progress'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 text-sm py-2 rounded-lg font-medium transition-all ${view === v ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {v === 'quiz' ? 'Quiz' : 'Ma Progression'}
          </button>
        ))}
      </div>

      {view === 'quiz' ? (
        <QuizCard language={lang} languageName={info.name} />
      ) : (
        <ProgressDashboard />
      )}
    </div>
  )
}
