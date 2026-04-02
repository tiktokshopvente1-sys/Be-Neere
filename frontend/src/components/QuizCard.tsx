import { useState, useEffect } from 'react'
import { getQuiz, submitQuizAnswer, textToSpeech } from '../api/client'
import toast from 'react-hot-toast'

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  question_type: string
}

interface Props {
  language: string
  languageName: string
}

export default function QuizCard({ language, languageName }: Props) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<{ is_correct: boolean; explanation: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [mode, setMode] = useState<'vocabulary' | 'dynamic'>('vocabulary')

  const loadQuestion = async () => {
    setLoading(true)
    setSelected(null)
    setResult(null)
    try {
      const q = await getQuiz(language, mode)
      setQuestion(q)
    } catch {
      toast.error('Impossible de charger la question')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadQuestion() }, [language, mode])

  const handleAnswer = async (option: string) => {
    if (selected || !question) return
    setSelected(option)
    try {
      const res = await submitQuizAnswer(language, question.question, option, question.correct_answer)
      setResult(res)
      setScore(prev => ({
        correct: prev.correct + (res.is_correct ? 1 : 0),
        total: prev.total + 1,
      }))
    } catch {
      const isCorrect = option === question.correct_answer
      setResult({ is_correct: isCorrect, explanation: isCorrect ? 'Bonne réponse !' : `La bonne réponse était: ${question.correct_answer}` })
      setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))
    }
  }

  const handleTTS = async (text: string) => {
    try {
      const res = await textToSpeech(text, language)
      new Audio(res.audio_url).play()
    } catch {}
  }

  const getOptionClass = (option: string) => {
    if (!selected) return 'bg-gray-800 hover:bg-gray-700 border-gray-700 cursor-pointer'
    if (option === question?.correct_answer) return 'bg-green-900 border-green-500 text-green-300'
    if (option === selected && option !== question?.correct_answer) return 'bg-red-900 border-red-500 text-red-300'
    return 'bg-gray-800 border-gray-700 opacity-50'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('vocabulary')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'vocabulary' ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            Vocabulaire
          </button>
          <button
            onClick={() => setMode('dynamic')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'dynamic' ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            IA Dynamique
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Score: <span className="text-primary-400 font-semibold">{score.correct}/{score.total}</span>
        </div>
      </div>

      {loading ? (
        <div className="card flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : question ? (
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-base font-medium leading-relaxed">{question.question}</p>
            <button onClick={() => handleTTS(question.question)} className="text-gray-500 hover:text-primary-400 text-sm flex-shrink-0">🔊</button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className={`border rounded-xl px-4 py-3 text-left text-sm transition-all ${getOptionClass(option)}`}
              >
                <span className="font-medium mr-2 text-gray-500">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>

          {result && (
            <div className={`rounded-xl p-3 text-sm ${result.is_correct ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
              <p className="font-semibold mb-1">{result.is_correct ? '✓ Correct !' : '✗ Incorrect'}</p>
              <p>{result.explanation}</p>
            </div>
          )}

          {result && (
            <button onClick={loadQuestion} className="btn-primary w-full">
              Question suivante
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
