import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Row from './components/Row';
import uuid from 'react-native-uuid';
import Constants from 'expo-constants'
import Add from './components/Add';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@items_key'

export default function App() {

    const [data, setData] = useState([])
    const [selectedId, setSelectedId] = useState(null)

    const add = useCallback((name) => {
      const newItem = {
        id: uuid.v4(),
        name: name,
        completed: false
      }
      const tempData = [...data,newItem]
      setData(tempData)
    }, [data])

/*     const select = useCallback((id) => {
      setSelectedId(id);
    }, []); */

    const select = useCallback((id) => {
      const updateData = data.map(item =>
        item.id === id ? {...item, completed: !item.completed } : item
      )
      const sortedData = updateData.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1)
      setData(sortedData)
    }, [data]);

    const getData = async() => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY)
        const json = JSON.parse(value)
        if (json === null) {
          json = []
        }
        setData(json)
      } catch (ex) {
        console.log(ex)
      }
    }

    const storeData = async(value) => {
      try {
        const json = JSON.stringify(value)
        await AsyncStorage.setItem(STORAGE_KEY,json)
      } catch (ex) {
        console.log(ex)
      }
    }

    useEffect(() => {
      storeData(data)
    }, [data])

    useEffect(() => {
      //AsyncStorage.clear()
      getData()
    }, [])

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Todo list</Text>
        <Add add={add} />
        <FlatList
          data = {data}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          renderItem={({item}) => (
            <Row
              item={item}
              selectedId={selectedId}
              select={select}
              data={data}
              setData={setData}
            />
          )}
        />
      </SafeAreaView>
    );
 
}    

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },
  rowText: {
    marginLeft: 5,
    fontSize: 16,
    padding: 1
  },
  image: {
    width: 32,
    height: 32,
    marginRight: 16
  },
});
