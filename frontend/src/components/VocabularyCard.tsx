import { useEffect, useState } from 'react'
import { getVocabulary, textToSpeech } from '../api/client'

interface VocabItem {
  [key: string]: string
}

interface Props {
  language: string
  languageName: string
}

export default function VocabularyCard({ language, languageName }: Props) {
  const [data, setData] = useState<{ greetings: VocabItem[]; numbers: VocabItem[]; common_phrases: VocabItem[] } | null>(null)
  const [tab, setTab] = useState('greetings')

  useEffect(() => {
    if (['moore', 'dioula', 'peulh'].includes(language)) {
      getVocabulary(language).then(setData).catch(() => {})
    }
  }, [language])

  const handleTTS = async (text: string) => {
    try {
      const res = await textToSpeech(text, language)
      new Audio(res.audio_url).play()
    } catch {}
  }

  if (!data || !['moore', 'dioula', 'peulh'].includes(language)) {
    return (
      <div className="card text-center text-gray-500 py-6">
        <p>Vocabulaire de base disponible pour Mooré, Dioula et Peulh uniquement.</p>
      </div>
    )
  }

  const tabs = [
    { key: 'greetings', label: 'Salutations', items: data.greetings },
    { key: 'numbers', label: 'Chiffres', items: data.numbers },
    { key: 'common_phrases', label: 'Phrases', items: data.common_phrases },
  ]

  const currentTab = tabs.find(t => t.key === tab)!
  const langKey = language

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {currentTab.items.map((item, i) => (
          <div key={i} className="card flex items-center gap-4 py-3">
            <div className="flex-1">
              <p className="font-semibold text-primary-300">{item[langKey] || Object.values(item)[0]}</p>
              <p className="text-sm text-gray-400">{item.french}</p>
            </div>
            <button
              onClick={() => handleTTS(item[langKey] || Object.values(item)[0] as string)}
              className="text-gray-500 hover:text-primary-400 text-lg"
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
