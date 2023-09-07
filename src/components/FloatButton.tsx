import {TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
export default function FloatButton({icon,onPress}) {
  return (
    <TouchableOpacity style={styles.floatButton} onPress={onPress}>
        <Icon name={icon} size={25} color="black" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
});