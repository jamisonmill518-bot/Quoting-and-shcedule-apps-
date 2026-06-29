import { useState, useEffect } from 'react'
import QuoteEditor from './components/QuoteEditor.jsx'
import QuoteList from './components/QuoteList.jsx'
import { loadQuotes, saveQuote, deleteQuote, newQuote } from './utils/storage.js'

export default function App() {
  const [view, setView] = useState('list') // 'list' | 'editor' | 'summary'
  const [quotes, setQuotes] = useState([])
  const [activeQuote, setActiveQuote] = useState(null)

  useEffect(() => {
    setQuotes(loadQuotes())
  }, [])

  function handleNew() {
    const q = newQuote()
    setActiveQuote(q)
    setView('editor')
  }

  function handleEdit(q) {
    setActiveQuote({ ...q })
    setView('editor')
  }

  function handleSave(q) {
    saveQuote(q)
    setQuotes(loadQuotes())
    setActiveQuote(q)
  }

  function handleDelete(id) {
    deleteQuote(id)
    setQuotes(loadQuotes())
  }

  function handleBack() {
    setActiveQuote(null)
    setView('list')
    setQuotes(loadQuotes())
  }

  if (view === 'editor' && activeQuote) {
    return (
      <QuoteEditor
        quote={activeQuote}
        onSave={handleSave}
        onBack={handleBack}
      />
    )
  }

  return (
    <QuoteList
      quotes={quotes}
      onNew={handleNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
