import {TasksStateType} from '../../../../../App/App';
import {SetTodolistAT,} from '../../../todolists-reducer/todolists-reducer';
import {TaskEntityStatus, TaskPriorities, TaskStatuses, TodolistApi} from '../../../../../api/todolist-api';
import {SetErrorACType, setLinearProgressAC} from '../../../../../App/app-reducer/app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppRootStateType} from '../../../../../state/store/store';
import {handleServerAppError, handleServerNetworkError} from '../../../../../utils/error-utils';
import {asyncActions as asyncTodolistsActions} from '../../../todolists-reducer/todolists-reducer'


const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setLinearProgressAC({value: true}))
    try {
        let res = await TodolistApi.getTasks(todolistId);
        dispatch(setLinearProgressAC({value: false}))
        return {todolistId, tasks: res.data.items}
    }
    catch (e: any) {
        handleServerNetworkError(e, dispatch)
        dispatch(setLinearProgressAC({value: false}))
        return rejectWithValue(null)

    }

})
const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    model: any
}, {dispatch, getState, rejectWithValue}) => {
    dispatch(setLinearProgressAC({value: true}))
    const state = getState() as AppRootStateType
    dispatch(changeEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: TaskEntityStatus.Expectation
    }))
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (task) {
        const model = {
            title: task.title, // утверждаем что этот элемент точно будет
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...param.model
        }

        try {
            const res =
                await TodolistApi.updateTask(param.todolistId, param.taskId, model)
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeEntityStatus({
                    todolistId: task.todoListId,
                    taskId: task.id,
                    entityStatus: TaskEntityStatus.Prepared
                }))
                dispatch(setLinearProgressAC({value: false}))
                return {taskId: task.id, model, todolistId: task.todoListId}

            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
            // dispatch(changeEntityStatus({param.todolistId, param.taskId, entityStatus: TaskEntityStatus.Expectation}))
        }
    } else {
        return rejectWithValue(null)
    }
})
const removeTaskTC = createAsyncThunk('tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, {dispatch}) => {
        dispatch(changeEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: TaskEntityStatus.Expectation
        }))
        dispatch(setLinearProgressAC({value: true}))
        try {
            let res = await TodolistApi.deleteTask(param.todolistId, param.taskId);
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setLinearProgressAC({value: false}))
                return {taskId: param.taskId, todolistId: param.todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: TaskEntityStatus.Prepared
            }))
        }
    })
const addTaskTC = createAsyncThunk('tasks/addTask',
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setLinearProgressAC({value: true}))
        try {
            const res = await TodolistApi.createTask(param.todolistId, param.title)
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setLinearProgressAC({value: false}))
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

export const asyncActions = {fetchTasks, updateTaskTC, addTaskTC, removeTaskTC}

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
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
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
        builder.addCase(asyncTodolistsActions.deleteTodolistTC.fulfilled, (state, action: any) => {
            delete state[action.payload.id]
        });
        builder.addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
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

