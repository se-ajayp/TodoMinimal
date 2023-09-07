/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import TodoList from './src/screens/TodoList';
import TodoTypeList from './src/screens/TodoTypeList';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Dashboard}
          options={{title: 'TODO'}}
        />
        <Stack.Screen name="Todo" component={TodoList} />
        <Stack.Screen name="TodoType" component={TodoTypeList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
