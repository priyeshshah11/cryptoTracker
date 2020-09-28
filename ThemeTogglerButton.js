
import React, { useContext } from 'react';
import { View, Switch } from 'react-native';
import {ThemeContext, themes} from './utils';


const ThemeTogglerButton = (props) => {

  const theme = useContext(ThemeContext)

  return (
      <View style={{marginLeft: 20}}>
        <Switch
          trackColor={{ false: themes.dark.background, true: themes.light.primary }}
          thumbColor={theme === themes.light ? themes.dark.background : themes.light.primary}
          onValueChange={props.toggleTheme}
          value={theme === themes.light}
        />
      </View>
  );
}

export default ThemeTogglerButton;