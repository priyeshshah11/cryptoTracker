
import React, {createContext, useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import Tracker from './Tracker'
import TokenInfo from './TokenInfo'
import {ThemeContext, themes} from './utils';

export default function App() {

  const [selectedTheme, setSelectedTheme] = useState(themes.light);
  const [showInfo, setShowInfo] = useState(false);
  const [tokenData, setTokenData] = useState({});
  const [currentPeriod, setCurrentPeriod] = useState('month');

  useEffect(() => {
    setSelectedTheme(themes.light);
  }, [])

  const toggleTheme = () => {
    setSelectedTheme(selectedTheme === themes.light ? themes.dark : themes.light)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    }
  });

  return (
    <ThemeContext.Provider value={selectedTheme}>
      <View style={styles.container}>
        {
          showInfo
          ?
          <TokenInfo 
            setShowInfo={setShowInfo}
            tokenData={tokenData}
            setTokenData={setTokenData}
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
          />
          :
          <Tracker 
            setShowInfo={setShowInfo}
            toggleTheme={toggleTheme}
            setTokenData={setTokenData}
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
          />
        }
      </View>
    </ThemeContext.Provider>
  );
}