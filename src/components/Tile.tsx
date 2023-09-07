import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function Tile({ onPress, title, details }) {
  return (
  <TouchableOpacity onPress={onPress} style={styles.main}>
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.detailsText}>{details}</Text>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({  
  main: {
    flex:1,
    height:100,
    margin:10,
    backgroundColor:"gray",
    borderRadius:8,
    padding:10,
    elevation:8,
  },
  titleText:{
    flex:1,
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  detailsText: {
    flex:1,
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize"
  }})
  