
import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator, TextInput } from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackerCard from './TrackerCard';
import {ThemeContext, themes} from './utils';
import ThemeTogglerButton from './ThemeTogglerButton';
import TimePeriods from './TimePeriods';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function Tracker(props) {

  const [isLoaded, setIsLoaded] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [newTokens, setNewTokens] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const theme = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    title: {
      marginTop: Constants.statusBarHeight,
      height: '7%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchBar: {
      marginTop: Constants.statusBarHeight,
      height: '7%',
      width: '100%',
      flexDirection: 'row',
    },
    searchInput: { 
      width: '80%', 
      height: '60%', 
      borderColor: theme.primary, 
      color: theme.mainPrimary,
      borderWidth: 2,
      borderRadius: 15,
      marginLeft: '5%',
      paddingHorizontal: 10
    },
    titleText: {
      // fontFamily: 'RawlineMedium',
      fontSize: 18,
      lineHeight: 21,
      display: 'flex',
      flex: 1,
      alignSelf: 'center',
      textAlign: 'center',
      paddingRight: 15,
      /* Colour/Main */
      color: theme.mainPrimary,
    },
    searchIcon: {
      width: 30,
      alignSelf: 'center',
      textAlign: 'center',
      marginRight: 20,
      color: theme.mainPrimary,
    },
    
    tokensList: {
      width: '100%',
    },
    listOuterView: {
      width: '100%',
      marginTop: 10,
      marginBottom: 110
    },
    period: {
      flexDirection: 'row',
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

  useEffect(() => {
    fetchLazyData()
  }, []);

  useEffect(() => {
    if (searchValue === '') {
      fetchData()
    }
  }, [searchValue]);

  const fetchLazyData = () => {
    if (searchValue === '') {
      fetch(`https://assets-api.sylo.io/v2/all?sort_order=market_cap&skip=${newTokens.length}`)
      .then((response) => response.json())
      .then((data) => {
        let newList = newTokens.concat(data)
        setNewTokens(newList)
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  const fetchData = () => {
    fetch('https://assets-api.sylo.io/v2/all?sort_order=market_cap')
      .then((response) => response.json())
      .then((data) => setNewTokens(data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }

  const fetchSearchData = () => {
    fetch(`https://assets-api.sylo.io/v2/all?sort_order=market_cap&take=100&search=${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        setNewTokens(data)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const renderToken = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        props.setTokenData(item)
        props.setShowInfo(true)
      }}
    >
      <TrackerCard 
        data={item} 
        period={props.currentPeriod}
      />
    </TouchableOpacity>
  );

  return (
    isLoaded ? 
    <View style={styles.container}>
      {
        !showSearch
        ?
        <View style={styles.title}>
          <ThemeTogglerButton toggleTheme={props.toggleTheme}/>
          <Text style={styles.titleText}>Tracker</Text>
          <TouchableOpacity
            onPress={() => {
              setShowSearch(!showSearch)
            }}
          >
            <Icon style={styles.searchIcon} name="search" size={30}/>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            onChangeText={text => setSearchValue(text)}
            value={searchValue}
            autoFocus={true}
            placeholder={"Search..."}
            clearButtonMode={"never"}
            onSubmitEditing={() => fetchSearchData(searchValue)}
            placeholderTextColor={theme.mainPrimary}
          />
          <TouchableOpacity
            onPress={() => {
              setShowSearch(!showSearch)
              setSearchValue('')
            }}
          >
            <Icon
              name="clear"
              size={36}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      }
      
      <View style={styles.period}>
        <TimePeriods 
          currentPeriod={props.currentPeriod}
          setCurrentPeriod={props.setCurrentPeriod}
        />
      </View>
      <SafeAreaView style={styles.listOuterView}>
        <FlatList
          style={styles.tokensList}
          data={newTokens}
          onEndReached={fetchLazyData}
          onEndReachedThreshold={0.7}
          renderItem={renderToken}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
    :
    <View style={[styles.spinnerContainer, styles.horizontal]}>
      <ActivityIndicator size={"large"} color={theme.primary}/>
    </View>
  );
}


