import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, Bot, BookOpen, CheckCircle2, FileText, FileUp, LoaderCircle, MessageSquare, Send, ShieldCheck, Trash2, UploadCloud, Wifi, X } from 'lucide-react'
import { askQuestion, deleteDocument, getDocuments, getHealth, uploadDocument } from './api'
import tapLogo from './assets/tapLogo.png';

const starterMessage = {
  role: 'assistant',
  content: 'Hi! Upload a document, then ask a question about its contents. I’ll search your local index and show the sources used for the answer.',
  sources: [],
}

function App() {
  const [health, setHealth] = useState(null)
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([starterMessage])
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef(null)
  const chatEnd = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const [h, d] = await Promise.all([getHealth(), getDocuments()])
      setHealth(h)
      setDocuments(d.documents || [])
    } catch {
      setHealth(null)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, busy])

  async function handleFiles(fileList) {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setUploading(true)
    setError('')
    for (const file of files) {
      try {
        await uploadDocument(file)
      } catch (e) {
        setError(`${file.name}: ${e.message}`)
      }
    }
    await refresh()
    setUploading(false)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function removeDocument(doc) {
    if (!window.confirm(`Delete "${doc.filename}" and its indexed chunks?`)) return
    try {
      await deleteDocument(doc.id)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function sendQuestion(e) {
    e?.preventDefault()
    const q = question.trim()
    if (!q || busy) return
    setError('')
    setMessages(prev => [...prev, { role: 'user', content: q, sources: [] }])
    setQuestion('')
    setBusy(true)
    try {
      const result = await askQuestion(q)
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer, sources: result.sources || [] }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `I couldn't complete that request: ${e.message}`, sources: [] }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><img src={tapLogo} alt="Company Logo" /></div><div><strong>LocalRAG</strong><span>Private document AI</span></div></div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><MessageSquare size={17}/> Document chat</div>
        <div className="side-label docs-label">YOUR KNOWLEDGE <span>{documents.length}</span></div>
        <div className="doc-list">
          {documents.length === 0 && <p className="empty-docs">Your uploaded documents will appear here.</p>}
          {documents.map(doc => <div className="doc-row" key={doc.id}><FileText size={17}/><div className="doc-meta"><strong title={doc.filename}>{doc.filename}</strong><span>{doc.chunks} chunks</span></div><button className="icon-button delete-button" title="Delete document" onClick={() => removeDocument(doc)}><Trash2 size={15}/></button></div>)}
        </div>
        <div className="sidebar-bottom"><div className="privacy-icon"><ShieldCheck size={17}/></div><div><strong>Local by design</strong><p>Your files and AI requests stay on this computer when using the local setup.</p></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><div className="eyebrow">YOUR PRIVATE KNOWLEDGE BASE</div><h1>Document assistant</h1><p>Ask questions. Get answers grounded in your files.</p></div>
          <div className={`connection ${health ? 'connected' : 'disconnected'}`}><span className="status-dot"/>{health ? 'Backend connected' : 'Backend offline'}</div>
        </header>

        <section className="workspace">
          <div className="upload-card">
            <div className="section-heading"><div className="heading-icon"><UploadCloud size={19}/></div><div><h2>Add your documents</h2><p>Upload files to build your searchable knowledge base.</p></div></div>
            <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={e => {e.preventDefault(); setDragging(true)}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files)}} onClick={() => fileInput.current?.click()} role="button" tabIndex="0" onKeyDown={e => e.key === 'Enter' && fileInput.current?.click()}>
              <input ref={fileInput} type="file" multiple accept=".pdf,.docx,.txt,.md,.markdown,.png,.jpg,.jpeg,.tif,.tiff,.bmp" onChange={e => handleFiles(e.target.files)} hidden />
              <div className="upload-icon"><FileUp size={22}/></div>
              <strong>{uploading ? 'Processing and indexing…' : 'Drop files here or browse'}</strong>
              <span>PDF, DOCX, TXT, MD, images · Multiple files supported</span>
              {uploading && <LoaderCircle className="spin" size={18}/>}
            </div>
            <div className="upload-foot"><span><ShieldCheck size={14}/> Private local storage</span><span><Activity size={14}/> {documents.length} document{documents.length === 1 ? '' : 's'} indexed</span></div>
            {error && <div className="error-banner"><X size={16}/>{error}<button onClick={() => setError('')}><X size={14}/></button></div>}
          </div>

          <div className="chat-card">
            <div className="chat-heading"><div className="section-heading"><div className="heading-icon purple"><Bot size={19}/></div><div><h2>Ask your documents</h2><p>Answers generated by your local language model.</p></div></div><div className="model-pill"><span className="status-dot"/>{health?.chat_model || 'Ollama'}</div></div>
            <div className="messages">
              {messages.map((msg, i) => <div className={`message ${msg.role}`} key={`${i}-${msg.role}`}><div className="avatar">{msg.role === 'assistant' ? <Bot size={17}/> : <span>Y</span>}</div><div className="message-body"><div className="message-author">{msg.role === 'assistant' ? 'LocalRAG assistant' : 'You'}</div><div className="message-text">{msg.content}</div>{msg.sources?.length > 0 && <div className="sources"><div className="sources-title"><BookOpen size={14}/> Sources used</div>{msg.sources.map((s, j) => <div className="source" key={`${s.chunk_id}-${j}`}><div className="source-name"><FileText size={14}/><strong>{s.document}</strong>{s.page && <span>Page {s.page}</span>}</div><p>{s.excerpt}</p></div>)}</div>}</div></div>)}
              {busy && <div className="message assistant"><div className="avatar"><Bot size={17}/></div><div className="message-body"><div className="message-author">LocalRAG assistant</div><div className="typing"><LoaderCircle className="spin" size={16}/> Searching documents and generating an answer…</div></div></div>}
              <div ref={chatEnd}/>
            </div>
            <form className="composer" onSubmit={sendQuestion}><div className="composer-input"><textarea value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); sendQuestion()}}} placeholder={documents.length ? 'Ask a question about your documents…' : 'Upload a document to get started…'} rows="1" disabled={busy}/><button type="submit" className="send-button" disabled={!question.trim() || busy} aria-label="Send question">{busy ? <LoaderCircle className="spin" size={17}/> : <Send size={17}/>}</button></div><div className="composer-note"><span><Wifi size={13}/> Local model via Ollama</span><span>Enter to send · Shift+Enter for new line</span></div></form>
          </div>
        </section>
        <footer className="footer"><span>LocalRAG · Retrieval-Augmented Generation</span><span>Built for private, document-grounded Q&A</span></footer>
      </main>
    </div>
  )
}

export default App
