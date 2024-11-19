import React, { useRef, useEffect } from 'react'
    import { useTheme } from './ThemeContext.jsx'

    export default function HighlightedTextarea({ 
      value, 
      onChange, 
      onScroll, 
      rhymingWords,
      style 
    }) {
      const textareaRef = useRef(null)
      const highlightRef = useRef(null)
      const { currentTheme } = useTheme()

      useEffect(() => {
        if (textareaRef.current && highlightRef.current) {
          highlightRef.current.scrollTop = textareaRef.current.scrollTop
        }
      }, [value])

      const handleScroll = (e) => {
        if (highlightRef.current) {
          highlightRef.current.scrollTop = e.target.scrollTop
        }
        onScroll?.(e)
      }

      const highlightText = (text) => {
        const lines = text.split('\n')
        return lines.map((line, lineIndex) => {
          const words = line.split(/(\s+)/)
          return (
            <div key={lineIndex} className="highlight-line">
              {words.map((word, wordIndex) => {
                if (word.trim() === '') {
                  return <span key={wordIndex}>{word}</span>
                }
                
                const isRhyming = rhymingWords.includes(word.toLowerCase())
                const lastWordInLine = wordIndex === words.length - 1 && word.trim().length > 0
                
                return (
                  <span
                    key={wordIndex}
                    className={`
                      ${isRhyming ? 'rhyming' : ''}
                      ${lastWordInLine ? 'line-end' : ''}
                    `.trim()}
                  >
                    {word}
                  </span>
                )
              })}
            </div>
          )
        })
      }

      return (
        <div className="highlighted-textarea" style={style}>
          <div 
            className="highlight-layer"
            ref={highlightRef}
          >
            {highlightText(value)}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onScroll={handleScroll}
            spellCheck="false"
            placeholder="Write your poem here..."
            style={{
              color: currentTheme.text,
            }}
          />
        </div>
      )
    }
