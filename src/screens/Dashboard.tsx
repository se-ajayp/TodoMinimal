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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import fonts from '../constants/fonts';
import Toast from 'react-native-toast-message';
const DateFormat = 'D/M/YYYY';

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
        {
          backgroundColor: done
            ? ColorConstant.taskDone
            : ColorConstant.taskUndone,
        },
      ]}>
      <CheckBox
        style={{padding: 10}}
        onValueChange={() => {
          dispatch(toggleTodo(id));
          Toast.show({
            type: 'success',
            text1: 'Task Completed',
            text2: 'The task has been completed 👋',
          });
        }}
        value={done}
      />
      <View style={{marginLeft: 10}}>
        <Text style={{fontSize: 16, color: '#FFF', fontFamily: fonts.MPL_Bold}}>
          {title}
        </Text>
        {/* <Text style={{fontSize: 10, color: '#FFF',fontFamily: fonts.MPL_Bold,}}>{date.toString()}</Text> */}
      </View>

      <TouchableOpacity
        style={{position: 'absolute', right: 16}}
        onPress={() => {
          dispatch(deleteTodo(id));
          Toast.show({
            type: 'success',
            text1: 'Task Deleted',
            text2: 'The task has been deleted 👋',
          });
        }}>
        {/* <Text style={{fontSize: 16, color: 'red',fontFamily: fonts.MPL_Bold,}}>Delete</Text> */}
        <FontAwesome6 name="trash" size={16} color={ColorConstant.deleteIcon} />
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
      Toast.show({
        type: 'success',
        text1: 'Task Added',
        text2: 'New task has been added 👋',
      });
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
  const sliceColor = [ColorConstant.taskDone, ColorConstant.taskUndone];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text style={styles.titleStyle}>
            {moment().format(DateFormat) === selectedDate.format(DateFormat)
              ? `Today`
              : tomorrow === selectedDate.format(DateFormat)
              ? `Tomorrow`
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
          calendarAnimation={{type: 'sequence', duration: 100}}
          daySelectionAnimation={{
            type: 'background',
            duration: 50,
            highlightColor: 'black',
          }}
          minDate={moment()}
          style={{height: 100, marginTop: 16}}
          calendarHeaderStyle={{
            color: ColorConstant.titleTextColor,
            fontSize: 18,
            fontFamily: fonts.MPL_Bold,
          }}
          dateNumberStyle={{
            color: ColorConstant.titleTextColor,
            fontSize: 12,
            fontFamily: fonts.MPL_Medium,
          }}
          dateNameStyle={{
            color: ColorConstant.titleTextColor,
            fontSize: 12,
            fontFamily: fonts.MPL_Regular,
          }}
          iconContainer={{flex: 0.1}}
          // customDatesStyles={this.state.customDatesStyles}
          highlightDateNameStyle={{
            color: 'white',
            fontSize: 12,
            fontFamily: fonts.MPL_Bold,
          }}
          highlightDateNumberStyle={{
            color: 'white',
            fontSize: 12,
            fontFamily: fonts.MPL_Bold,
          }}
          highlightDateContainerStyle={{
            backgroundColor: ColorConstant.titleTextColor,
            borderColor: ColorConstant.itemBackground,
            borderWidth: 1,
            elevation: 2,
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
        keyExtractor={item => item.id.toString() + item.title.toString()}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
              elevation: 2,
            }}>
            <Image
              style={{
                height: 200,
                width: 200,
                borderRadius: 20,
                resizeMode: 'cover',
              }}
              source={require('../../assets/images/empty_list.jpg')}
            />
          </View>
        }
      />
      {/* Add Todo */}
      <View style={{justifyContent: 'center'}}>
        <TextInput
          value={newTodo}
          placeholder="Enter Task"
          style={styles.addTodo}
          onChangeText={text => setNewTodo(text)}
          onEndEditing={handleAddTodo}
        />
        <TouchableOpacity
          style={{position: 'absolute', right: 15, zIndex: 1}}
          onPress={() => {
            handleAddTodo();
          }}>
          <FontAwesome6
            name="plus"
            size={16}
            color={ColorConstant.titleTextColor}
          />
        </TouchableOpacity>
      </View>
      <Toast />
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
    color: ColorConstant.titleTextColor,
    fontSize: 30,
    fontFamily: fonts.MPL_Bold,
  },
  addTodo: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingLeft: 16,
    color: ColorConstant.titleTextColor,
    elevation: 2,
    fontSize: 16,
    fontFamily: fonts.MPL_Regular,
  },
  itemStyle: {
    backgroundColor: ColorConstant.itemBackground,
    marginVertical: 10,
    elevation: 2,
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
