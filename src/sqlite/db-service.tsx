import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {ToDoItem} from '../models';

const tableName = 'todoData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'todo-data.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        rowid INT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        isDone BOOLEAN NOT NULL DEFAULT 0,
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        datetime TEXT NOT NULL
    );`;

  await db.executeSql(query);
};

export const getTodoItems = async (
  db: SQLiteDatabase,
  selectedDate: any,
): Promise<ToDoItem[]> => {
  try {
    const todoItems: ToDoItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id,value, isDone, datetime, timestamp FROM ${tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const getTodoByDate = async (
  db: SQLiteDatabase,
  selectedDate: string,
): Promise<ToDoItem[]> => {
  try {
    // console.log('selectedDate => ' + selectedDate);

    const todoItems: ToDoItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, value, isDone, timestamp, datetime FROM ${tableName}  WHERE datetime = '${selectedDate}'`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveTodoItems = async (
  db: SQLiteDatabase,
  todoItems: ToDoItem[],
) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value, timestamp, datetime) values` +
    todoItems
      .map(i => `(${i.id}, '${i.value}', '${i.timestamp}', '${i.datetime}')`)
      .join(',');

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const UpdateTodoItem = async (db: SQLiteDatabase, id: number) => {
  const updateQuery = `Update ${tableName} 
  SET isDone = 1
  WHERE rowid = ${id}`;
  await db.executeSql(updateQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
