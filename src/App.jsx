import React, { useState, useEffect, useRef } from 'react'
    import ThemeSelector from './ThemeSelector.jsx'
    import FileManager from './FileManager.jsx'
    import { useTheme } from './ThemeContext.jsx'

    function App() {
      const [poem, setPoem] = useState('')
      const [lineSyllableCounts, setLineSyllableCounts] = useState([])
      const [rhymingWords, setRhymingWords] = useState([])
      const [showFileManager, setShowFileManager] = useState(false)
      const { currentTheme } = useTheme()
      const textareaRef = useRef(null)
      const syllableContainerRef = useRef(null)

      const getLastWord = (line) => {
        const words = line.trim().split(/\s+/)
        return words[words.length - 1]
      }

      const fetchRhymingWords = async (word) => {
        if (!word) return
        try {
          const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=10`)
          const data = await response.json()
          setRhymingWords(data.map(item => item.word))
        } catch (error) {
          console.error('Error fetching rhyming words:', error)
          setRhymingWords([])
        }
      }

      const fetchSyllableCount = async (word) => {
        if (!word) return 0
        try {
          const response = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=s`)
          const data = await response.json()
          if (data.length > 0 && data[0].numSyllables) {
            return data[0].numSyllables
          }
          return 1
        } catch (error) {
          console.error('Error fetching syllable count:', error)
          return 1
        }
      }

      const handleScroll = (e) => {
        if (syllableContainerRef.current) {
          syllableContainerRef.current.scrollTop = e.target.scrollTop
        }
      }

      useEffect(() => {
        const updatePoemData = async () => {
          const lines = poem.split('\n')
          
          // Calculate syllable counts for each line
          const counts = await Promise.all(
            lines.map(async (line) => {
              const words = line.trim().split(/\s+/).filter(word => word.length > 0)
              if (words.length === 0) return 0

              const syllableCounts = await Promise.all(
                words.map(word => fetchSyllableCount(word))
              )
              return syllableCounts.reduce((sum, count) => sum + count, 0)
            })
          )
          setLineSyllableCounts(counts)

          // Get rhyming words for the last word of the last non-empty line
          const nonEmptyLines = lines.filter(line => line.trim().length > 0)
          if (nonEmptyLines.length > 0) {
            const lastLine = nonEmptyLines[nonEmptyLines.length - 1]
            const lastWord = getLastWord(lastLine)
            if (lastWord) {
              await fetchRhymingWords(lastWord)
            }
          } else {
            setRhymingWords([])
          }
        }

        const timeoutId = setTimeout(() => {
          updatePoemData()
        }, 500)

        return () => clearTimeout(timeoutId)
      }, [poem])

      const handleSave = () => {
        setShowFileManager(false)
      }

      const handleLoad = (poemContent) => {
        setPoem(poemContent)
        setShowFileManager(false)
      }

      return (
        <div className="editor-container" style={{ 
          background: currentTheme.background,
          color: currentTheme.text
        }}>
          <header>
            <h1>Poetry Editor</h1>
            <div className="header-actions">
              <button
                onClick={() => setShowFileManager(!showFileManager)}
                className="file-button"
                style={{
                  background: currentTheme.accent,
                  color: currentTheme.background
                }}
              >
                {showFileManager ? 'Hide Files' : 'Show Files'}
              </button>
              <ThemeSelector />
            </div>
          </header>
          
          <div className="workspace">
            {showFileManager && (
              <FileManager
                onLoad={handleLoad}
                onSave={handleSave}
                currentPoem={poem}
              />
            )}
            
            <div className="editor-layout">
              <div className="editor-main">
                <div 
                  className="syllable-counts"
                  ref={syllableContainerRef}
                >
                  <div className="syllable-counts-content">
                    {poem.split('\n').map((line, index) => (
                      <div key={index} className="line-count">
                        {lineSyllableCounts[index] || 0}
                      </div>
                    ))}
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={poem}
                  onChange={(e) => setPoem(e.target.value)}
                  onScroll={handleScroll}
                  placeholder="Write your poem here..."
                  style={{
                    background: currentTheme.editorBg,
                    color: currentTheme.text,
                    borderColor: currentTheme.border
                  }}
                />
              </div>
              <div className="rhyming-words" style={{
                background: currentTheme.sidebar,
                borderColor: currentTheme.border
              }}>
                <h3>Rhyming Words</h3>
                {rhymingWords.length > 0 ? (
                  <ul>
                    {rhymingWords.map((word, index) => (
                      <li key={index}>{word}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No rhyming words found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    export default App
