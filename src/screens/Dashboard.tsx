/* eslint-disable prettier/prettier */
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {useDispatch, useSelector} from 'react-redux';
import {addTodo, toggleTodo, deleteTodo} from '../redux/reducers/todos';
import {Image} from 'react-native';
import ColorConstant from '../constants/ColorConstant';
import {StatusBar} from 'react-native';
import PieChart from 'react-native-pie-chart';
const DateFormat = 'DD-MM-YYYY';

const DateFilter = (todos, selectedDate) => {
  todos = todos.filter(item => item.date === selectedDate.format(DateFormat));
  const completedTodo = todos.filter(item => item.completed === true);
  const pendingTodo = todos.filter(item => item.completed === false);
  const pendingCount = pendingTodo.length > 0 ? pendingTodo.length : 0.01;
  const completedCount = completedTodo.length;
  todos = [...pendingTodo, ...completedTodo];
  return {pendingCount, completedCount, todos};
};

const Dashboard = () => {
  let startDate = moment(); // today
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(startDate);
  let {pendingCount, completedCount, todos} = DateFilter(
    useSelector(state => state.todos),
    selectedDate,
  );

  const dispatch = useDispatch();

  const Item = ({id, title, done, date}) => (
    <View
      style={[
        styles.itemStyle,
        {backgroundColor: done ? '#424769' : ColorConstant.itemBackground},
      ]}>
      <CheckBox
        style={{padding: 10}}
        onValueChange={() => dispatch(toggleTodo(id))}
        value={done}
      />
      <View style={{marginLeft: 10}}>
        <Text style={{fontSize: 16, color: '#FFF'}}>{title}</Text>
        {/* <Text style={{fontSize: 10, color: '#FFF'}}>{date.toString()}</Text> */}
      </View>

      <TouchableOpacity
        style={{position: 'absolute', right: 16}}
        onPress={() => {
          dispatch(deleteTodo(id));
        }}>
        <Text style={{fontSize: 16, color: 'red'}}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      dispatch(
        addTodo({
          newTodo: newTodo,
          selectedDate: selectedDate.format(DateFormat),
        }),
      );
      setNewTodo('');
    }
  };

  useEffect(() => {}, []);

  const onDateSelected = selectedDate => {
    setSelectedDate(selectedDate);
    // this.setState({selectedDate});
    // this.setState({formattedDate: selectedDate.format('YYYY-MM-DD')});
  };

  let tomorrow = moment().add(1, 'day').format(DateFormat);

  const widthAndHeight = 100;
  const series = [completedCount, pendingCount];
  const sliceColor = ['#424769', ColorConstant.itemBackground];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={styles.titleStyle}>
            {moment().format(DateFormat) === selectedDate.format(DateFormat)
              ? `Today's`
              : tomorrow === selectedDate.format(DateFormat)
              ? `Tomorrow's`
              : selectedDate.format(DateFormat)}
          </Text>
          <Text style={styles.titleStyle}>Schedule</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.5}
            coverFill={'#0000'}
          />
        </View>
      </View>
      <View>
        <CalendarStrip
          scrollable
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'background',
            duration: 300,
            highlightColor: '#9265DC',
          }}
          minDate={moment()}
          style={{height: 100, marginTop: 16}}
          calendarHeaderStyle={{
            color: 'white',
            fontSize: 16,
          }}
          dateNumberStyle={{color: 'white', fontSize: 12}}
          dateNameStyle={{color: 'white', fontSize: 12}}
          iconContainer={{flex: 0.1}}
          // customDatesStyles={this.state.customDatesStyles}
          highlightDateNameStyle={{
            color: ColorConstant.textColor,
            fontSize: 12,
          }}
          highlightDateNumberStyle={{
            color: ColorConstant.textColor,
            fontSize: 12,
          }}
          highlightDateContainerStyle={{
            backgroundColor: '#424769',
            borderColor: ColorConstant.itemBackground,
            borderWidth: 2,
            elevation: 4,
          }}
          // markedDates={this.state.markedDates}
          // datesBlacklist={this.datesBlacklistFunc}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          useIsoWeekday={false}
        />
      </View>
      {/* List of Todos */}
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{marginVertical: 20}}
        data={todos}
        renderItem={({item}) => (
          <Item
            title={item.title}
            done={item.completed}
            id={item.id}
            date={item.date}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Image
              style={{
                height: 250,
                width: 250,
                borderRadius: 20,
                resizeMode: 'cover',
              }}
              source={require('../assets/images/empty_list.jpg')}
            />
          </View>
        }
      />
      {/* Add Todo */}
      <View style={{}}>
        <TextInput
          value={newTodo}
          placeholder="Enter Task"
          style={styles.addTodo}
          onChangeText={text => setNewTodo(text)}
          onEndEditing={handleAddTodo}
        />
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: ColorConstant.background,
  },
  titleStyle: {
    color: ColorConstant.textColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  addTodo: {backgroundColor: '#fff', borderRadius: 8, paddingLeft: 16},
  itemStyle: {
    backgroundColor: ColorConstant.itemBackground,
    marginVertical: 10,
    elevation: 8,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
