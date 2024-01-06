import {createSlice} from '@reduxjs/toolkit';
import ToDoModel from '../../models/ToDoModel';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {todos: []},
  reducers: {
    addTodo: (state, action) => {
      return {
        ...state,
        todos: [
          ...state.todos,
          new ToDoModel(
            state.todos.length + 1,
            action.payload.newTodo,
            false,
            action.payload.selectedDate,
          ),
        ],
      };
    },
    toggleTodo: (state, action) => {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? {...todo, completed: !todo.completed}
            : todo,
        ),
      };
    },
    deleteTodo: (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    },
  },
});

export const {addTodo, toggleTodo, deleteTodo} = todoSlice.actions;
export default todoSlice.reducer;
