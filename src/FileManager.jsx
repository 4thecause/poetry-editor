import React, { useState, useEffect } from 'react'
    import { useTheme } from './ThemeContext.jsx'

    export default function FileManager({ onLoad, onSave, currentPoem }) {
      const [savedPoems, setSavedPoems] = useState([])
      const [poemTitle, setPoemTitle] = useState('')
      const { currentTheme } = useTheme()

      useEffect(() => {
        const poems = JSON.parse(localStorage.getItem('poems') || '[]')
        setSavedPoems(poems)
      }, [])

      const handleSave = () => {
        if (!poemTitle.trim()) {
          alert('Please enter a title for your poem')
          return
        }

        const poems = JSON.parse(localStorage.getItem('poems') || '[]')
        const newPoem = {
          id: Date.now(),
          title: poemTitle,
          content: currentPoem,
          date: new Date().toISOString()
        }

        const updatedPoems = [...poems, newPoem]
        localStorage.setItem('poems', JSON.stringify(updatedPoems))
        setSavedPoems(updatedPoems)
        setPoemTitle('')
        onSave(newPoem)
      }

      const handleDelete = (id) => {
        const updatedPoems = savedPoems.filter(poem => poem.id !== id)
        localStorage.setItem('poems', JSON.stringify(updatedPoems))
        setSavedPoems(updatedPoems)
      }

      return (
        <div className="file-manager" style={{
          background: currentTheme.sidebar,
          borderColor: currentTheme.border
        }}>
          <div className="save-form">
            <input
              type="text"
              value={poemTitle}
              onChange={(e) => setPoemTitle(e.target.value)}
              placeholder="Enter poem title..."
              style={{
                background: currentTheme.editorBg,
                color: currentTheme.text,
                borderColor: currentTheme.border
              }}
            />
            <button
              onClick={handleSave}
              style={{
                background: currentTheme.accent,
                color: currentTheme.background
              }}
            >
              Save
            </button>
          </div>

          <div className="saved-poems">
            <h3>Saved Poems</h3>
            {savedPoems.length === 0 ? (
              <p className="no-poems">No saved poems yet</p>
            ) : (
              <ul>
                {savedPoems.map(poem => (
                  <li key={poem.id} style={{ borderColor: currentTheme.border }}>
                    <div className="poem-info">
                      <span className="poem-title">{poem.title}</span>
                      <span className="poem-date">
                        {new Date(poem.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="poem-actions">
                      <button
                        onClick={() => onLoad(poem.content)}
                        style={{
                          background: currentTheme.accent,
                          color: currentTheme.background
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(poem.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )
    }
