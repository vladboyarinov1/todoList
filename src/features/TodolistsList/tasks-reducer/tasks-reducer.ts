import {TasksStateType} from '../../../App/App';
import {asyncActions as asyncTodolistsActions, SetTodolistAT,} from '../todolists-reducer/todolists-reducer';
import {
    TodolistApi
} from '../../../api/todolist-api';
import {
    FieldErrorType,
    TaskEntityStatus,
    TaskPriorities,
    TaskStatuses
} from '../../../api/types';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AppRootStateType} from '../../../utils/types';
import {appActions} from '../../CommonActions/App';

const {setLinearProgress} = appActions

const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setLinearProgress({value: true}))
    try {
        let res = await TodolistApi.getTasks(todolistId);
        dispatch(setLinearProgress({value: false}))
        return {todolistId, tasks: res.data.items}
    } catch (e: any) {
        dispatch(setLinearProgress({value: false}))
        return  handleServerNetworkError(e, dispatch)

    }
})
const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    model: FlexType
}, thunkAPI) => {
    thunkAPI.dispatch(setLinearProgress({value: true}))
    const state = thunkAPI.getState() as AppRootStateType
    thunkAPI.dispatch(changeEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: TaskEntityStatus.Expectation
    }))
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)

    if (!task) {
        return thunkAPI.rejectWithValue('task not found in the state')
    }
    const apiModel = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status,
        ...param.model
    }
    const res =
        await TodolistApi.updateTask(param.todolistId, param.taskId, apiModel)
    try {
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(changeEntityStatus({
                todolistId: task.todoListId,
                taskId: task.id,
                entityStatus: TaskEntityStatus.Prepared
            }))
            thunkAPI.dispatch(setLinearProgress({value: false}))
            return param

        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
const removeTask = createAsyncThunk('tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(changeEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: TaskEntityStatus.Expectation
        }))
        thunkAPI.dispatch(setLinearProgress({value: true}))
        try {
            let res = await TodolistApi.deleteTask(param.todolistId, param.taskId);
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setLinearProgress({value: false}))
                return {taskId: param.taskId, todolistId: param.todolistId}
            } else {
                handleServerAppError(res.data,
                    thunkAPI)
            }
        } catch (e: any) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            thunkAPI.dispatch(changeEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: TaskEntityStatus.Prepared
            }))
        }
    })
const addTask = createAsyncThunk<any, { todolistId: string, title: string }, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('tasks/addTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setLinearProgress({value: true}))
        try {
            const res = await TodolistApi.createTask(param.todolistId, param.title)
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setLinearProgress({value: false}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, thunkAPI)
                return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (e: any) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [e.errors], fieldsErrors: undefined})
        } finally {
            thunkAPI.dispatch(setLinearProgress({value: false}))
        }
    })

const initialState: TasksStateType = {}
export const slice = createSlice({
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
        builder
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action: any) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks[index] = {...tasks[index], ...action.payload.model}
            })
            .addCase(fetchTasks.fulfilled, (state, action: any) => {
                state[action.payload?.todolistId] = action.payload?.tasks
            })
            .addCase(removeTask.fulfilled, (state, action: any) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks.splice(index, 1)
            })
            .addCase(asyncTodolistsActions.deleteTodolistTC.fulfilled, (state, action: any) => {
                delete state[action.payload.id]
            })
            .addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
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
export const asyncActions = {fetchTasks, updateTask, addTask, removeTask}


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

