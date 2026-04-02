# IA Multilingue - Application d'apprentissage des langues

Application web interactive pour apprendre 5 langues : **Français, Anglais, Mooré, Dioula, Peulh**.

## Fonctionnalités

- **Chatbot conversationnel** : Pratiquez avec un professeur IA natif de la langue choisie
- **Traduction automatique** : Traduisez entre les 5 langues (OpenAI GPT-4o-mini)
- **Quiz / Exercices** : QCM de vocabulaire et questions dynamiques générées par IA
- **Correction grammaticale** : Corrigez et comprenez vos erreurs
- **Synthèse vocale** : Ecoutez la prononciation avec gTTS
- **Vocabulaire de base** : Dictionnaires JSON pour Mooré, Dioula et Peulh
- **Progression** : Suivi des scores et séries de bonnes réponses

## Stack technique

- **Backend** : Python 3.11+, FastAPI, SQLAlchemy (SQLite), gTTS, OpenAI
- **Frontend** : React 18, Vite, TypeScript, Tailwind CSS

## Installation

### Prérequis
- Python 3.11+
- Node.js 18+
- Clé API OpenAI

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Créer le fichier `.env` dans `backend/` :
```
OPENAI_API_KEY=sk-your-key-here
```

Démarrer :
```powershell
uvicorn main:app --reload --port 8000
```

API disponible sur http://localhost:8000  
Documentation Swagger : http://localhost:8000/docs

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Application disponible sur http://localhost:5173

## Structure du projet

```
creer-moi-une-ia/
├── backend/
│   ├── main.py               # FastAPI app
│   ├── routers/              # Endpoints (chat, translate, quiz, grammar, voice)
│   ├── services/             # Logique métier (LLM, TTS, traduction, quiz)
│   ├── models/               # SQLAlchemy + Pydantic
│   ├── data/languages/       # Vocabulaire JSON (Mooré, Dioula, Peulh)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/       # ChatBot, QuizCard, Translator, GrammarChecker...
        ├── pages/            # Home, Learn, Practice
        ├── hooks/            # useVoice (Web Speech API)
        └── api/              # Axios client
```

## Notes sur les langues africaines

Le Mooré, le Dioula et le Peulh (Fulfulde) ont peu de ressources NLP disponibles.
Cette application utilise :
1. Des dictionnaires JSON artisanaux pour le vocabulaire de base
2. GPT-4o-mini comme moteur principal pour la conversation, traduction et quiz
