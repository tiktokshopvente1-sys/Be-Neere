import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn/:lang" element={<Learn />} />
        <Route path="/practice/:lang" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  )
}
