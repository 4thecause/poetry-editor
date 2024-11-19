import React from 'react'
    import { TiDelete } from 'react-icons/ti'
    import { useTheme } from './ThemeContext'

    export default function Toolbar({ onRemoveBlankLines }) {
      const { currentTheme } = useTheme()

      return (
        <div 
          className="toolbar"
          style={{
            background: currentTheme.sidebar,
            borderColor: currentTheme.border
          }}
        >
          <button
            className="toolbar-button"
            onClick={onRemoveBlankLines}
            title="Remove blank lines"
            style={{
              color: currentTheme.text
            }}
          >
            <TiDelete size={20} />
          </button>
        </div>
      )
    }
