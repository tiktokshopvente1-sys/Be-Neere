import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLanguages } from '../api/client'
import type { Language } from '../api/client'
import ProgressDashboard from '../components/ProgressDashboard'

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getLanguages().then(setLanguages).catch(() => {
      setLanguages([
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'moore', name: 'Mooré', flag: '🇧🇫' },
        { code: 'dioula', name: 'Dioula', flag: '🇧🇫' },
        { code: 'peulh', name: 'Peulh (Fulfulde)', flag: '🇧🇫' },
      ])
    })
  }, [])

  const features = [
    {
      icon: '💬',
      title: 'Chatbot IA',
      desc: 'Conversez avec un professeur natif virtuel',
      tab: 'Chatbot',
      defaultLang: 'fr',
    },
    {
      icon: '📝',
      title: 'Quiz & Exercices',
      desc: 'Testez votre vocabulaire et grammaire',
      tab: 'quiz',
      defaultLang: 'fr',
    },
    {
      icon: '🔊',
      title: 'Synthèse vocale',
      desc: 'Écoutez la prononciation correcte',
      tab: 'Vocabulaire',
      defaultLang: 'moore',
    },
    {
      icon: '🌐',
      title: 'Traduction',
      desc: 'Traduisez entre les 5 langues',
      tab: 'Traduction',
      defaultLang: 'fr',
    },
    {
      icon: '✏️',
      title: 'Correction',
      desc: 'Corrigez votre grammaire',
      tab: 'Grammaire',
      defaultLang: 'fr',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/20 text-primary-400 text-3xl mb-2">
          🌍
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-yellow-400 bg-clip-text text-transparent">
          IA Multilingue
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Apprenez le Français, l'Anglais, le Mooré, le Dioula et le Peulh grâce à l'intelligence artificielle
        </p>
      </div>

      {/* Sélecteur de langue */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Choisir une langue pour commencer</h2>
        <p className="text-sm text-gray-500 mb-4">Cliquez sur une langue pour accéder au chatbot, quiz, traduction et plus</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => navigate(`/learn/${lang.code}`)}
              className="card hover:border-primary-500 hover:bg-gray-800 transition-all text-center space-y-2 group cursor-pointer"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">{lang.flag}</div>
              <p className="font-medium text-sm">{lang.name}</p>
              <p className="text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">Commencer →</p>
            </button>
          ))}
        </div>
      </div>

      {/* Fonctionnalités cliquables */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Fonctionnalités</h2>
        <p className="text-sm text-gray-500 mb-4">Cliquez pour accéder directement à une fonctionnalité</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {features.map(f => (
            <button
              key={f.title}
              onClick={() => navigate(f.tab === 'quiz' ? `/practice/${f.defaultLang}` : `/learn/${f.defaultLang}`)}
              className="card hover:border-primary-500 hover:bg-gray-800 transition-all text-center space-y-2 group cursor-pointer"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{f.icon}</div>
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors leading-tight">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Progression */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ma progression</h2>
        <ProgressDashboard />
      </div>
    </div>
  )
}
