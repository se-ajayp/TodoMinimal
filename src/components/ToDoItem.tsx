import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {ToDoItem} from '../models/ToDoModel';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
export const ToDoItemComponent: React.FC<{
  todo: ToDoItem;
  deleteItem: Function;
}> = ({todo: {id, value, isDone}, deleteItem}) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todoTextContainer}>
        <Text style={[styles.sectionTitle, {color: isDone ? 'gray' : 'black'}]}>
          {value}
        </Text>
      </View>
      {/* <TouchableOpacity style={{padding: 5}} onPress={() => deleteItem(id)}>
        <Icon name="rocket" size={25} color="#1E348A" />
      </TouchableOpacity> */}
      <CheckBox
        value={isDone ? true : false}
        onValueChange={() => {
          deleteItem(id);
        }}
        style={styles.checkbox}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 8,
  },
  todoTextContainer: {},
  sectionTitle: {fontSize: 16, color: '#000'},
  checkbox: {
    color: '#2D4354',
    // alignSelf: 'center',
  },
});
