import { useState, useCallback, useRef } from 'react'

interface UseVoiceReturn {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  supported: boolean
}

export const useVoice = (language: string = 'fr'): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  const langMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    moore: 'fr-FR',
    dioula: 'fr-FR',
    peulh: 'fr-FR',
  }

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = useCallback(() => {
    if (!supported) return
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = langMap[language] || 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setTranscript('')
  }, [language, supported])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, transcript, startListening, stopListening, supported }
}
