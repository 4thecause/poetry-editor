import React from 'react'
    import { useTheme, themes } from './ThemeContext.jsx'

    export default function ThemeSelector() {
      const { setCurrentTheme } = useTheme()

      return (
        <div className="theme-selector">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(theme)}
              className="theme-button"
              style={{
                background: theme.background,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      )
    }
