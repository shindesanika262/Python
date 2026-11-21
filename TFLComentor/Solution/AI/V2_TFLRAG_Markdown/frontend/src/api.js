const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`)
  return data
}

export const getHealth = () => request('/health')
export const getDocuments = () => request('/documents')
export const uploadDocument = (file) => {
  const body = new FormData()
  body.append('file', file)
  return request('/documents/upload', { method: 'POST', body })
}
export const deleteDocument = (id) => request(`/documents/${id}`, { method: 'DELETE' })
export const askQuestion = (question) => request('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question }),
})
