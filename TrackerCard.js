import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {ThemeContext, themes} from './utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TrackerCard(props) {

  const historicData = []

  const [difference, setDifference] = useState({percent: 0, value: 0})
  const [tokenData, setTokenData] = useState({
    rate: 0,
    history: []
  })
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme ? theme.background : themes.light.background,
      borderRadius: 15,
      borderColor: theme ? theme.borderColor : themes.light.borderColor
    },
    wrapper: {
      height: 140,
      margin: -15,
    },
    cardIcon: {
      marginRight: 10,
      width: 36,
      height: 36
    },
    cardBitIcon: {
      marginRight: 10,
      width: 36,
      height: 36,
      color: theme === themes.dark ? themes.light.background : themes.dark.background,
    },
    titleText :{
      color: theme ? theme.mainPrimary : themes.light.mainPrimary,
    },
    topRow: {
      flexDirection: 'row',
      margin: 10,
      alignItems: 'center',
      flex: 1
    },
    topTextView: {
      flex: 1,
      marginLeft: '10%',
    },
    topText: {
      // fontFamily: 'RawlineSemiBold',
      fontSize: 15,
      lineHeight: 18,
      textAlign: 'right',
      color: theme ? theme.mainPrimary : themes.light.mainPrimary,
    },
    bottomText: {
      // fontFamily: 'RawlineSemiBold',
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'right',
      color: theme ? theme.success : themes.light.success,
    }
  });

  useEffect(() => {
    fetch(`https://assets-api.sylo.io/v2/asset/id/${props.data.id}/rate/?period=${props.period}&fiat=NZD&type=historic`)
      .then((response) => response.json())
      .then((data) => {
        if (data.history) {
          let value = Math.abs(data.history.slice(-1)[0].rate - data.history[0].rate)
          setDifference({
            percent: ((value/(data.history.slice(-1)[0].rate + data.history[0].rate))*100).toFixed(2),
            value: value > 1 ? value.toFixed(2) : value.toPrecision(2)
          })
        }
        setTokenData(data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.data, props.period]);

  useEffect(() => {
    if (tokenData !== null && tokenData.history) {
      for (let i=0; i < tokenData.history.length; i++) {
        historicData.push(tokenData.history[i].rate)
      }
    }
  }, [tokenData])

  return (
    <Card containerStyle={styles.container} wrapperStyle={styles.wrapper}>
      <View style={styles.topRow}>
        {
          theme === themes.light
          ?
          props.data.icon_address
            ?
            <Image source={{
                uri: props.data.icon_address
              }}
              style={styles.cardIcon}
            />
            :
            <Icon
              name="currency-btc"
              size={36}
              style={styles.cardBitIcon}
            />
          :
          props.data.icon_address_dark
            ?
            <Image source={{
                uri: props.data.icon_address_dark
              }}
              style={styles.cardIcon}
            />
            :
            <Icon
              name="currency-btc"
              size={36}
              style={styles.cardBitIcon}
            />
        }
        <Text style={styles.titleText}>{props.data.name}</Text>
        <View style={styles.topTextView}>
          <Text style={styles.topText}>
            ${
              tokenData.rate
              ?
              tokenData.rate > 1
                ?
                `${tokenData.rate.toFixed(2)}`
                :
                `${tokenData.rate.toPrecision(6)}`
              :
              '0.00'
            }
          </Text>
          <Text style={styles.bottomText}>
            {
              `${difference.percent < 0 ? '' : '+'}${difference.percent}% ($${difference.value})`
            }
          </Text>
        </View>
      </View>
        {
          tokenData.history
          ?
          <LineChart
            style={{ height: 90 }}
            data={tokenData.history.slice(tokenData.history.length-50)}
            yAccessor={({item}) => item.rate}
            svg={{ strokeWidth: 3, stroke: theme ? theme.primary : themes.light.primary }}
            curve={shape.curveNatural}
            contentInset={{ top: 20, bottom: 20 }}
          >
          </LineChart>
          :
          <Text
            style={{ height: 90, textAlign: "center", justifyContent: "center"}}
          >
            No History
          </Text>
        }
    </Card>
  );
}


