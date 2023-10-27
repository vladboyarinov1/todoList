import { asyncActions as tasksAsyncActions } from "./tasks-reducer/tasks-reducer";
import { slice as tasksSlice } from "./tasks-reducer/tasks-reducer";
import { asyncActions as todolistsAsyncActions } from "./todolists-reducer/todolists-reducer";
import { slice as todolistsSlice } from "./todolists-reducer/todolists-reducer";

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
