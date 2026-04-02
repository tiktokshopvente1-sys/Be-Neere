import { useState } from 'react'
import { translateText } from '../api/client'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'moore', name: 'Mooré', flag: '🇧🇫' },
  { code: 'dioula', name: 'Dioula', flag: '🇧🇫' },
  { code: 'peulh', name: 'Peulh', flag: '🇧🇫' },
]

export default function Translator() {
  const [sourceLang, setSourceLang] = useState('fr')
  const [targetLang, setTargetLang] = useState('moore')
  const [sourceText, setSourceText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText.trim()) return
    setLoading(true)
    setResult('')
    try {
      const res = await translateText(sourceText, sourceLang, targetLang)
      setResult(res.translated_text)
    } catch {
      toast.error('Erreur de traduction')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(result)
    setResult(sourceText)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Langue source</label>
          <select
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            className="input-field"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSwap} className="mt-5 p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all text-xl">
          ⇄
        </button>

        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Langue cible</label>
          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="input-field"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Texte à traduire</label>
          <textarea
            className="input-field h-36 resize-none"
            placeholder="Entrez votre texte ici..."
            value={sourceText}
            onChange={e => setSourceText(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Traduction</label>
          <div className="input-field h-36 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span>Traduction en cours...</span>
              </div>
            ) : (
              <p className="text-white whitespace-pre-wrap">{result || <span className="text-gray-500">La traduction apparaîtra ici</span>}</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleTranslate} disabled={loading || !sourceText.trim()} className="btn-primary w-full">
        Traduire
      </button>
    </div>
  )
}
