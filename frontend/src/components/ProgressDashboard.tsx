import { useEffect, useState } from 'react'
import { getAllProgress } from '../api/client'

interface LangProgress {
  language: string
  score: number
  total_quizzes: number
  correct_answers: number
  streak: number
}

const LANG_INFO: Record<string, { name: string; flag: string }> = {
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  moore: { name: 'Mooré', flag: '🇧🇫' },
  dioula: { name: 'Dioula', flag: '🇧🇫' },
  peulh: { name: 'Peulh', flag: '🇧🇫' },
}

export default function ProgressDashboard() {
  const [progress, setProgress] = useState<LangProgress[]>([])

  useEffect(() => {
    getAllProgress()
      .then(data => {
        if (Array.isArray(data)) setProgress(data)
      })
      .catch(() => {})
  }, [])

  if (progress.length === 0) {
    return (
      <div className="card text-center text-gray-500 py-8">
        <p className="text-4xl mb-3">📊</p>
        <p>Commencez des quiz pour voir votre progression !</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {progress.map(p => {
        const info = LANG_INFO[p.language] || { name: p.language, flag: '🌍' }
        return (
          <div key={p.language} className="card space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{info.flag}</span>
              <div>
                <p className="font-semibold">{info.name}</p>
                <p className="text-xs text-gray-400">{p.total_quizzes} questions répondues</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl font-bold text-primary-400">{p.score}%</p>
                {p.streak > 0 && <p className="text-xs text-orange-400">🔥 {p.streak} série</p>}
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(p.score, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{p.correct_answers}/{p.total_quizzes} bonnes réponses</p>
          </div>
        )
      })}
    </div>
  )
}
