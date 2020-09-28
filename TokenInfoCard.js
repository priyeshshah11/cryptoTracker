
import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Card } from 'react-native-elements';
import { AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {ThemeContext, themes} from './utils';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

export default function TokenInfoCard(props) {

  const historicData = []

  const [difference, setDifference] = useState({percent: 0, value: 0})
  const [tokenData, setTokenData] = useState({
    rate: 0,
    history: []
  })
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      borderRadius: 15,
      borderColor: theme.borderColor,
    },
    wrapper: {
      height: 185,
      margin: -15,
    },
    titleText :{
      color: theme.mainPrimary,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    topTextView: {
      flex: 1,
      textAlign: 'center',
    },
    topText: {
      // fontFamily: 'RawlineSemiBold',
      fontSize: 18,
      lineHeight: 18,
      textAlign: 'center',
      color: theme.mainPrimary,
    },
    bottomText: {
      // fontFamily: 'RawlineSemiBold',
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
      color: theme.success,
    }
  });

  const Gradient = ({ index }) => (
    <Defs key={index}>
        <LinearGradient id={'gradient'} x1={'0%'} y1={'100%'} x2={'0%'} y2={'0%'}>
            <Stop offset={'85%'} stopColor={'rgba(241, 90, 41, 1)'} stopOpacity={0}/>
            <Stop offset={'100%'} stopColor={'rgba(241, 90, 41, 0)'} stopOpacity={0.2}/> 
        </LinearGradient>
    </Defs>

  )

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
    if (tokenData !== null && tokenData.histor) {
      for (let i=0; i < tokenData.history.length; i++) {
        historicData.push(tokenData.history[i].rate)
      }
    }
  }, [tokenData])

  return (
    <Card containerStyle={styles.container} wrapperStyle={styles.wrapper}>
      <View style={styles.topRow}>
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
              `${difference.percent < 0 ? '-' : '+'}${difference.percent}% ($${difference.value})`
            }
          </Text>
        </View>
      </View>
        {
          tokenData.history
          ?
          <AreaChart
              style={{ height: 110 }}
              data={tokenData.history.slice(tokenData.history.length-50)}
              yAccessor={({item}) => item.rate}
              svg={{ stroke: '#F79C7F', strokeWidth: 3, fill: 'url(#gradient)'}}
              curve={shape.curveNatural}
              contentInset={{ top: 20, bottom: 20 }}
          >
            <Gradient/>
          </AreaChart>
          :
          <Text
            style={{ height: 110, textAlign: "center", justifyContent: "center"}}
          >
            No History
          </Text>
        }
    </Card>
  );
}


