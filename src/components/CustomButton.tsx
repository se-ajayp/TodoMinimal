import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function CustomButton({ onPress, title }) {
  return (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({  
    appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin:10
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "capitalize"
  }})
  