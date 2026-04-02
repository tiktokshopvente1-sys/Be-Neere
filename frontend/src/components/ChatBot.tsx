import { useState, useRef, useEffect } from 'react'
import { sendChat, textToSpeech } from '../api/client'
import { useVoice } from '../hooks/useVoice'
import type { ChatMessage } from '../api/client'
import toast from 'react-hot-toast'

interface Props {
  language: string
  languageName: string
}

export default function ChatBot({ language, languageName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { isListening, transcript, startListening, stopListening, supported } = useVoice(language)

  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: getWelcomeMessage(language)
    }])
  }, [language])

  const getWelcomeMessage = (lang: string) => {
    const msgs: Record<string, string> = {
      fr: "Bonjour ! Je suis votre professeur de français. Comment puis-je vous aider aujourd'hui ?",
      en: "Hello! I am your English teacher. How can I help you today?",
      moore: "Laafi ! (Bonjour !) Je suis votre professeur de Mooré. Posez-moi vos questions !",
      dioula: "I ni ce ! (Bonjour !) Je suis votre professeur de Dioula. Comment puis-je vous aider ?",
      peulh: "Jam waawi ! (Bonjour !) Je suis votre professeur de Peulh. Comment puis-je vous aider ?",
    }
    return msgs[lang] || msgs.fr
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const res = await sendChat(input, language, messages)
      setMessages([...newHistory, { role: 'assistant', content: res.reply }])
    } catch {
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleTTS = async (text: string) => {
    try {
      const res = await textToSpeech(text, language)
      const audio = new Audio(res.audio_url)
      audio.play()
    } catch {
      toast.error('Synthèse vocale indisponible')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                IA
              </div>
            )}
            <div>
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleTTS(msg.content)}
                  className="mt-1 text-xs text-gray-500 hover:text-primary-400 flex items-center gap-1"
                >
                  <span>Ecouter</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold flex-shrink-0">IA</div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder={`Écrivez en ${languageName}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          {supported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-3 py-2 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
              title="Microphone"
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
          <button onClick={handleSend} disabled={loading} className="btn-primary px-4">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
