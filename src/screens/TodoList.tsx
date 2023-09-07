import {   
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,Pressable,
  Alert,
  TextInput, } from 'react-native'
import React, { useState } from 'react'
import FloatButton from '../components/FloatButton';
const data = require("../../data.json");
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const todoType=[
  {
  "id":1,
  "name":"Type 1"
  },
  {
  "id":2,
  "name":"Type 2"
  },
  {
  "id":3,
  "name":"Type 3"
  },
  {
  "id":4,
  "name":"Type 4"
  },
  {
  "id":5,
  "name":"Type 5"
  },
  {
  "id":6,
  "name":"Type 6"
  },
]

const Item = ({title,details}) => (
  <TouchableOpacity style={styles.item} onPress={()=>{
    Alert.alert(title,details);
  }}>
    <View style={{flex:1}}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.details}>{details}</Text>
    </View>
    <TouchableOpacity style={{justifyContent:"center", padding:10}} onPress={()=>{
      Alert.alert("delete");
    }}>
        <Icon name="trash" size={25} color="black" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function TodoList() {
  const[modalVisible,setModalVisible]=useState(false);
  const [selectedType, setSelectedType] = useState();
  return (
 <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => <Item title={item.title} details={item.details} />}
        keyExtractor={item => item.id}
      />

      <FloatButton icon="plus" onPress={()=>{
        setModalVisible(!modalVisible);
      }}/>
      <Modal
      style={{
        position:"absolute",
        height:150,
        bottom:10
      }}
        animationType='slide'
        //transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        >
        <View 
          style={styles.centeredView}>
          <View style={styles.modalView}>
             <TextInput placeholder="Email" />
              <TextInput
                secureTextEntry={true}
                placeholder="Password"
              />
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedType(itemValue)
              }>
                {
                  todoType.map((item)=>{
                    return (
                      <Picker.Item label={item.name} value={item.id} key={item.id} />
                    )
                  })
                }
            </Picker>
          </View>
        </View>
        <FloatButton icon="save" onPress={()=>{
          setModalVisible(!modalVisible);
        }}/>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
    padding:10,
  },
  item: {
    flex:1,
    flexDirection:'row',
    backgroundColor: '#f9c2ff',
    padding: 8,
    marginVertical: 8,
    borderRadius:8
  },
  title: {
    fontSize: 14,
    fontWeight:"700"
  },
  details:{
    fontSize: 12,
    fontWeight:"400"
  },
  floatButton:{
    alignItems:"center",
    justifyContent:"center",
    height:50,
    width:50,
    position:"absolute",
    bottom:10,
    right:10,
    backgroundColor:"gray",
    elevation:8,
    borderRadius:25
  },
  centeredView: {
    //flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
    modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});