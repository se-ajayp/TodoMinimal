import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {ToDoItemComponent} from '../components/ToDoItem';
import {ToDoItem} from '../models';
import {
  getDBConnection,
  getTodoItems,
  saveTodoItems,
  createTable,
  deleteTable,
  deleteTodoItem,
  UpdateTodoItem,
  getTodoByDate,
} from '../sqlite/db-service';

import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';

const Dashboard = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [doneTodos, setDoneTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const loadDataCallback = useCallback(async () => {
    try {
      const initTodos = [];
      const db = await getDBConnection();
      await createTable(db);
      // const storedTodoItems = await getTodoItems(db);
      const storedTodoItems = await getTodoByDate(
        db,
        selectedDate.format('YYYY-MM-DD').toString(),
      );
      if (storedTodoItems) {
        // console.log(storedTodoItems);
        setTodos(storedTodoItems.filter(i => i.isDone === 0));
        setDoneTodos(storedTodoItems.filter(i => i.isDone === 1));
      } else {
        if (initTodos.length) {
          await saveTodoItems(db, initTodos);
          setTodos(initTodos);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newTodos = [
        ...todos,
        {
          id: todos.length
            ? todos.reduce((acc, cur) => {
                if (cur.id > acc.id) return cur;
                return acc;
              }).id + 1
            : 0,
          value: newTodo,
          timestamp: moment().format('YYYY-MM-DD h:mm:ss'),
          datetime: selectedDate.format('YYYY-MM-DD'),
        },
      ];
      setTodos(newTodos);
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      loadDataCallback();
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };
  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteTodoItem(db, id);
      // todos.splice(id, 1);
      // setTodos(todos.slice(0));
      loadDataCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const doneItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await UpdateTodoItem(db, id);
      //let objIndex = todos.findIndex(obj => obj.id == id);
      //todos[objIndex].isDone = 1;
      // todos.splice(id, 1);
      // setTodos(todos.slice(0));
      loadDataCallback();
    } catch (error) {
      console.error(error);
    }
  };

  const clearTable = async () => {
    const db = await getDBConnection();
    await deleteTable(db);
    setTodos([]);
  };

  const datesBlacklistFunc = date => {
    return date.isoWeekday() === 6; // disable Saturdays
  };

  const onDateSelected = date => {
    // this.setState({selectedDate});
    // this.setState({formattedDate: selectedDate.format('YYYY-MM-DD')});
    // console.log('-->' + moment(date));
    setSelectedDate(moment(date));
  };

  const setSelectedDateNextWeek = date => {
    // const selectedDate = moment(this.state.selectedDate).add(1, 'week');
    // const formattedDate = selectedDate.format('YYYY-MM-DD');
    // this.setState({selectedDate, formattedDate});
  };

  const setSelectedDatePrevWeek = date => {
    // const selectedDate = moment(this.state.selectedDate).subtract(1, 'week');
    // const formattedDate = selectedDate.format('YYYY-MM-DD');
    // this.setState({selectedDate, formattedDate});
  };
  let datesWhitelist = [
    {
      start: moment(),
      // end: moment().add(3, 'days'), // total 4 days enabled
      end: moment('2030'),
    },
  ];
  let datesBlacklist = [moment().add(1, 'days')]; // 1 day disabled
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{marginBottom: 60}}>
        <View style={{margin: 10}}>
          <CalendarStrip
            selectedDate={selectedDate}
            onDateSelected={date => onDateSelected(date)}
            calendarAnimation={{type: 'sequence', duration: 30}}
            daySelectionAnimation={{
              type: 'border',
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: 'white',
            }}
            style={{
              height: 100,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 8,
            }}
            calendarHeaderStyle={{color: 'white'}}
            calendarColor={'#1E348A'}
            dateNumberStyle={{color: 'white'}}
            dateNameStyle={{color: 'white'}}
            highlightDateNumberStyle={{color: 'yellow'}}
            highlightDateNameStyle={{color: 'yellow'}}
            disabledDateNameStyle={{color: 'grey'}}
            disabledDateNumberStyle={{color: 'grey'}}
            iconContainer={{flex: 0.1}}
            // datesBlacklist={datesBlacklist}
            datesWhitelist={datesWhitelist}
            // iconLeft={require('./img/left-arrow.png')}
            // iconRight={require('./img/right-arrow.png')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <Text style={styles.title}>
            {moment(selectedDate).format('ddd DD/MM/YYYY')}
          </Text>
          {todos.length ? (
            <TouchableOpacity
              style={{padding: 10, alignSelf: 'flex-end'}}
              onPress={() => clearTable()}>
              <Text style={{fontSize: 16}}>Clear All</Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
        </View>

        <View>
          {todos.map(todo => (
            <ToDoItemComponent
              key={todo.id}
              todo={todo}
              // deleteItem={deleteItem}
              deleteItem={doneItem}
              isDone={todo.isDone}
            />
          ))}
        </View>

        <View>
          <Text
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1E348A',
              display: doneTodos.length > 0 ? 'flex' : 'none',
            }}>
            Completed
          </Text>

          {doneTodos.map(todo => (
            <ToDoItemComponent
              key={todo.id}
              todo={todo}
              // deleteItem={deleteItem}
              deleteItem={doneItem}
              isDone={todo.isDone}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Add Todo"
          style={styles.textInput}
          value={newTodo}
          onChangeText={text => setNewTodo(text)}
        />
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => {
            addTodo();
          }}>
          <Icon name="save" size={25} color="#1E348A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#e5e5e5',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  textInput: {
    marginVertical: 10,
    height: 40,
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {fontSize: 16, color: '#1E348A', fontWeight: 'bold'},
});
export default Dashboard;
