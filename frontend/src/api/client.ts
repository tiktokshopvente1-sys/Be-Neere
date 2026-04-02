import axios from 'axios'

const api = axios.create({ baseURL: '' })

export interface Language {
  code: string
  name: string
  flag: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const getLanguages = () =>
  api.get<{ languages: Language[] }>('/languages').then(r => r.data.languages)

export const sendChat = (message: string, language: string, history: ChatMessage[]) =>
  api.post('/chat', { message, language, conversation_history: history }).then(r => r.data)

export const translateText = (text: string, source_lang: string, target_lang: string) =>
  api.post('/translate', { text, source_lang, target_lang }).then(r => r.data)

export const getQuiz = (language: string, mode: string = 'vocabulary') =>
  api.get(`/quiz/${language}?mode=${mode}`).then(r => r.data)

export const submitQuizAnswer = (language: string, question: string, user_answer: string, correct_answer: string) =>
  api.post('/quiz/answer', { language, question, user_answer, correct_answer }).then(r => r.data)

export const checkGrammar = (text: string, language: string) =>
  api.post('/grammar/check', { text, language }).then(r => r.data)

export const textToSpeech = (text: string, language: string) =>
  api.post('/voice/tts', { text, language }).then(r => r.data)

export const getAllProgress = () =>
  api.get('/quiz/progress/all').then(r => r.data)

export const getVocabulary = (language: string) =>
  api.get(`/chat/vocabulary/${language}`).then(r => r.data)
