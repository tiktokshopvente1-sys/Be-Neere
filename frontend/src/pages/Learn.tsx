import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatBot from '../components/ChatBot'
import Translator from '../components/Translator'
import GrammarChecker from '../components/GrammarChecker'
import VocabularyCard from '../components/VocabularyCard'

const LANG_INFO: Record<string, { name: string; flag: string }> = {
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  moore: { name: 'Mooré', flag: '🇧🇫' },
  dioula: { name: 'Dioula', flag: '🇧🇫' },
  peulh: { name: 'Peulh', flag: '🇧🇫' },
}

const TABS = ['Chatbot', 'Traduction', 'Grammaire', 'Vocabulaire'] as const
type Tab = typeof TABS[number]

export default function Learn() {
  const { lang = 'fr' } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Chatbot')
  const info = LANG_INFO[lang] || { name: lang, flag: '🌍' }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 h-screen flex flex-col">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-all">
          ← Retour
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{info.flag}</span>
          <h1 className="text-xl font-bold">{info.name}</h1>
        </div>
        <button
          onClick={() => navigate(`/practice/${lang}`)}
          className="ml-auto btn-primary text-sm py-2"
        >
          Quiz
        </button>
      </div>

      <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm py-2 rounded-lg font-medium transition-all ${activeTab === tab ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden card">
        {activeTab === 'Chatbot' && (
          <div className="h-full flex flex-col">
            <ChatBot language={lang} languageName={info.name} />
          </div>
        )}
        {activeTab === 'Traduction' && (
          <div className="overflow-y-auto h-full">
            <Translator />
          </div>
        )}
        {activeTab === 'Grammaire' && (
          <div className="overflow-y-auto h-full">
            <GrammarChecker language={lang} languageName={info.name} />
          </div>
        )}
        {activeTab === 'Vocabulaire' && (
          <div className="overflow-y-auto h-full">
            <VocabularyCard language={lang} languageName={info.name} />
          </div>
        )}
      </div>
    </div>
  )
}
