import { asyncActions as tasksAsyncActions } from "./model/tasks/tasks-reducer";
import { slice as tasksSlice } from "./model/tasks/tasks-reducer";
import { asyncActions as todolistsAsyncActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { slice as todolistsSlice } from "features/TodolistsList/model/todolists/todolistsSlice";

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions,
};
const tasksActions = {
    ...tasksAsyncActions,
    ...tasksSlice.actions,
};
const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

export { tasksActions, todolistsActions, todolistsReducer, tasksReducer };
