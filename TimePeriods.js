
import React, { useContext} from 'react';
import { StyleSheet, Text } from 'react-native';
import {ThemeContext, themes} from './utils';

const TimePeriods = (props) => {

  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    periodText: {
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      flex: 1,
      color: theme ? theme.mainSecondary : themes.light.mainSecondary,
      textAlign: 'center'
    },
  
    currentPeriodText: {
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      flex: 1,
      color: theme ? theme.primary : themes.light.primary,
      textAlign: 'center'
    },
  });

  const timePeriods = ['all', 'year', 'month', 'week', 'day'];
  let timePeriodButtons = []
  for(let i=0; i < timePeriods.length; i++) {
    timePeriodButtons.push(
      <Text 
        key={i} 
        style={props.currentPeriod === timePeriods[i] ? styles.currentPeriodText : styles.periodText}
        onPress={() => props.setCurrentPeriod(timePeriods[i])}
      >
        {timePeriods[i]}
      </Text>
    )
  }
  return timePeriodButtons;
}

export default TimePeriods;


