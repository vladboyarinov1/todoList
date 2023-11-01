import { asyncActions as tasksAsyncActions } from "features/TodolistsList/model/tasks/tasksSlice";
import { slice as tasksSlice } from "features/TodolistsList/model/tasks/tasksSlice";
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
