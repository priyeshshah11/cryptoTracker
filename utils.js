import {createContext} from 'react'

export const themes = {
    light: {
      background: '#FFFFFF',
      main: '#495162',
      mainPrimary: '#495162',
      mainSecondary: '#8A96AA',
      primary: '#F15A29',
      success: '#33BB5D',
      shadeDark: '#8A96AA',
      borderColor: '#F6F6F6',
      // chartColor: 'linear-gradient(180deg, #F15A29 0%, rgba(241, 90, 41, 0) 100%)'
    },
    dark: {
      background: '#000000',
      main: '#495162',
      mainPrimary: '#F6F6F6',
      mainSecondary: '#646464',
      primary: '#F15A29',
      success: '#29964A',
      shadeDark: '#8A96AA',
      borderColor: '#161616',
      // chartColor: 'linear-gradient(180deg, #F15A29 0%, rgba(241, 90, 41, 0) 100%)'
    }
  }
  
  
  export const ThemeContext = createContext(themes.light); 