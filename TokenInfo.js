
import React, {useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext, themes } from './utils';
import TimePeriods from './TimePeriods';
import Constants from 'expo-constants';
import TokenInfoCard from './TokenInfoCard';

export default function TokenInfo(props) {

  const theme = useContext(ThemeContext);

  const [detailedData, setDetailedData] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch(`https://assets-api.sylo.io/v2/asset/id/${props.tokenData.id}/rate/?period=${props.currentPeriod}&fiat=NZD&type=historic`)
    .then((response) => response.json())
    .then((data) => {
      setDetailedData(data)
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setIsLoaded(true)
    });
  }, [props.tokenData, props.currentPeriod])

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
    },
    title: {
      marginTop: Constants.statusBarHeight,
      height: '7%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      // fontFamily: 'RawlineMedium',
      fontSize: 18,
      lineHeight: 21,
      display: 'flex',
      alignSelf: 'center',
      textAlign: 'left',
      paddingLeft: 10,
      color: theme.mainPrimary,
    },
    backIcon: {
      width: '10%',
      textAlign: 'right',
      color: theme.mainPrimary,
    },
    period: {
      flexDirection: 'row',
      marginBottom: '5%'
    },
    cardIcon: {
      width: 36,
      height: 36,
    },
    titleContainer: {
      paddingRight: '10%',
      width: '90%',
      flexDirection: 'row',
      justifyContent: "center"
    },
    info : {
      marginTop: '5%',
      marginBottom: '3%',
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      textAlign: "center",
      color: theme.mainPrimary,
    },
    infoView : {
      flexDirection: 'row',
      marginLeft: '5%',
      marginVertical: '2%',
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      color: theme.shadeDark,
    },
    infoText : {
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      color: theme.shadeDark,
      marginLeft: '5%',
      width: '30%',
    },
    infoValue : {
      // fontFamily: 'RawlineMedium',
      fontSize: 15,
      lineHeight: 21,
      color: theme.shadeDark,
    },
    spinnerContainer: {
      flex: 1,
      width: '100%',
      justifyContent: "center",
      backgroundColor: theme.background
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }
  });

  return (
    isLoaded ?
    <View style={styles.container}>
      <View style={styles.title}>
        <Icon style={styles.backIcon} name="chevron-left" size={30} 
          onPress={() => {
            props.setShowInfo(false)
            props.setTokenData({})
          }}
        />
        <View style={styles.titleContainer}>
          <Image 
            source={{
              uri: theme === themes.light ? props.tokenData.icon_address : props.tokenData.icon_address_dark,
            }}
            style={styles.cardIcon}
          />
          <Text style={styles.titleText}>
            {props.tokenData.name}
          </Text>
        </View>
      </View>
      <View style={styles.period}>
        <TimePeriods 
          currentPeriod={props.currentPeriod}
          setCurrentPeriod={props.setCurrentPeriod}
        />
      </View>
      <TokenInfoCard
        data={props.tokenData}
        period={props.currentPeriod}
      />
      <Text style={styles.info}>Information</Text>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          Symbol:
        </Text>
        <Text style={styles.infoValue}>
          {props.tokenData.symbol}
        </Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          Market Cap:
        </Text>
        <Text style={styles.infoValue}>
          ${
            detailedData.market_cap
            ? 
            detailedData.market_cap.toFixed(2) + ' ' + detailedData.fiat_symbol
            :
            '0.00'
          }
        </Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>
          24h Volume:
        </Text>
        <Text style={styles.infoValue}>
            ${
              detailedData.volume_24h
              ? 
              detailedData.volume_24h.toFixed(2) + ' ' + detailedData.fiat_symbol
              :
              '0.00'
            }
        </Text>
      </View>
    </View>
    :
    <View style={[styles.spinnerContainer, styles.horizontal]}>
      <ActivityIndicator size={"large"} color={theme.primary}/>
    </View>
  );
};
