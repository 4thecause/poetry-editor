import React, { createContext, useContext, useState } from 'react'

    const ThemeContext = createContext()

    export const themes = {
      light: {
        name: 'Light',
        background: '#ffffff',
        editorBg: '#ffffff',
        text: '#333333',
        accent: '#4a90e2',
        sidebar: '#f8f8f8',
        border: '#cccccc'
      },
      dark: {
        name: 'Dark',
        background: '#1a1a1a',
        editorBg: '#2d2d2d',
        text: '#e0e0e0',
        accent: '#6ab0ff',
        sidebar: '#252525',
        border: '#404040'
      },
      sepia: {
        name: 'Sepia',
        background: '#f4ecd8',
        editorBg: '#fdf6e3',
        text: '#5b4636',
        accent: '#8b6b4c',
        sidebar: '#efe6d5',
        border: '#d3c4b0'
      }
    }

    export function ThemeProvider({ children }) {
      const [currentTheme, setCurrentTheme] = useState(themes.light)

      return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
          {children}
        </ThemeContext.Provider>
      )
    }

    export function useTheme() {
      const context = useContext(ThemeContext)
      if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
      }
      return context
    }
