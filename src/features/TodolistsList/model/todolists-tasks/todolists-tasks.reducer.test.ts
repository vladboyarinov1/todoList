import { tasksReducer } from "features/TodolistsList/model/tasks/tasks.reducer";
import { TodolistDomain, todolistsReducer } from "features/TodolistsList/model/todolists/todolistsSlice";
import { TasksState } from "app/App";
import { asyncActions as todolistsAsyncActions } from "features/TodolistsList/model/todolists/todolistsSlice";

import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";

test("ids should be equals", () => {
    const startTasksState: TasksState = {};
    const startTodolistsState: TodolistDomain[] | any = [];
    let todolist: Todolist = {
        id: "21",
        title: "any",
        addedDate: "",
        order: 0,
    };

    const action: any = todolistsAsyncActions.addTodolistTC.fulfilled({ todolist }, "requesId", todolist.title);
    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState: TodolistDomain[] = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
