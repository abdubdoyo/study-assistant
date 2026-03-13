import { useState } from 'react'
import { generateStudyMaterials } from '../lib/claude'

export default function Upload({ onResults }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setLoading(true)

    try {
      const text = await file.text()
      if (text.trim().length < 50) {
        throw new Error('File seems too short — paste more notes.')
      }
      const results = await generateStudyMaterials(text)
      onResults(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>
        Study Assistant
      </h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Upload your lecture notes and get flashcards, a summary, and a quiz instantly.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? '#534AB7' : '#ddd'}`,
          borderRadius: 12,
          padding: '48px 24px',
          textAlign: 'center',
          background: dragOver ? '#EEEDFE' : '#fafafa',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <p style={{ fontSize: 16, color: '#444', marginBottom: 8 }}>
          Drag and drop your notes here
        </p>
        <p style={{ fontSize: 13, color: '#999' }}>
          .txt or .md files · or click to browse
        </p>
        <input
          id="file-input"
          type="file"
          accept=".txt,.md"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && (
        <p style={{ color: '#E24B4A', marginTop: 16, fontSize: 14 }}>{error}</p>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: '#666' }}>Generating your study materials...</p>
        </div>
      )}
    </div>
  )
}