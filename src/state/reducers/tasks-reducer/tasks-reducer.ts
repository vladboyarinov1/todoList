import {TasksStateType} from '../../../App/App';
import {SetTodolistAT,} from '../todolist-reducer/todolists-reducer';
import {TaskEntityStatus, TaskPriorities, TaskStatuses} from '../../../api/todolist-api';
import {SetErrorACType} from '../app-reducer/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createTaskTC, fetchTasks, removeTaskTC, updateTaskTC} from './tasks-actions';
import {addTodolistTC, deleteTodolistTC} from '../todolist-reducer/todolists-actions';

const initialState: TasksStateType = {}
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changeEntityStatus(state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            entityStatus: TaskEntityStatus
        }>) {
            state[action.payload.todolistId] = state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                ...t,
                entityStatus: action.payload.entityStatus
            } : t);
            return state;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action: any) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        });
        builder.addCase(deleteTodolistTC.fulfilled, (state, action: any) => {
            delete state[action.payload.id]
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.todolist.id] = [];
            }
        });

    }
})

export const tasksReducer = slice.reducer
export const {
    changeEntityStatus
} = slice.actions


//types
type FlexType = {
    title?: string
    description?: string
    priority?: TaskPriorities
    status?: TaskStatuses
    startDate?: string
    deadline?: string
}

export enum ResultCode {
    OK = 0,
    ERROR = 1,
    CAPTCHA = 10,
}

export type TasksActionType =
    | ReturnType<typeof changeEntityStatus>
    | SetTodolistAT
    | SetErrorACType

