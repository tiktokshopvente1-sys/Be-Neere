import { useState } from 'react'
import { checkGrammar } from '../api/client'
import toast from 'react-hot-toast'

interface Props {
  language: string
  languageName: string
}

export default function GrammarChecker({ language, languageName }: Props) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<{ corrected_text: string; explanation: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await checkGrammar(text, language)
      setResult(res)
    } catch {
      toast.error('Erreur lors de la correction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Texte à corriger en {languageName}</label>
        <textarea
          className="input-field h-32 resize-none"
          placeholder={`Écrivez un texte en ${languageName} pour le faire corriger...`}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <button onClick={handleCheck} disabled={loading || !text.trim()} className="btn-primary w-full">
        {loading ? 'Correction en cours...' : 'Corriger le texte'}
      </button>

      {result && (
        <div className="space-y-3">
          <div className="card border-green-800">
            <p className="text-xs text-green-400 font-semibold mb-2">TEXTE CORRIGE</p>
            <p className="text-white">{result.corrected_text}</p>
          </div>
          <div className="card border-blue-800">
            <p className="text-xs text-blue-400 font-semibold mb-2">EXPLICATION</p>
            <p className="text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
