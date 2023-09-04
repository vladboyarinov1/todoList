import {TasksStateType} from '../../../App/App';
import {
    addTodolistAC,
    AddTodolistAT,
    removeTodolistAC,
    RemoveTodolistAT, setTodolistAC,
    SetTodolistAT,
} from '../todolist-reducer/todolists-reducer';
import {
    TaskEntityStatus,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    TodolistApi,
    UpdateTaskModelType
} from '../../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType, RootActionType} from '../../store/store';
import {SetErrorACType} from '../app-reducer/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TasksStateType = {}
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        deleteTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, model: FlexType, todolistId: string }>) {

            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, title: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], title: action.payload.title}
        },
        setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
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
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolistId] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(setTodolistAC, (state, action) => {
            action.payload.todos.forEach((tl) => {
                state[tl.id] = []
            })
        })
    }
})

export const tasksReducer = slice.reducer
export const {
    deleteTaskAC,
    addTaskAC, changeTaskStatusAC, changeTaskTitleAC, changeEntityStatus, setTasksAC
} = slice.actions

//thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<RootActionType>) => TodolistApi.getTasks(todolistId)
    .then((res) => {
        dispatch(setTasksAC({todolistId, tasks: res.data.items}))

    })
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<RootActionType>) => {
    dispatch(changeEntityStatus({todolistId, taskId, entityStatus: TaskEntityStatus.Expectation}))
    TodolistApi.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(deleteTaskAC({taskId, todolistId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatus({todolistId, taskId, entityStatus: TaskEntityStatus.Prepared}))
        })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<RootActionType>) => {
    TodolistApi.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTaskAC({task: res.data.data.item}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}
export const updateTaskTC = (todolistId: string, taskId: string, data: FlexType) => (dispatch: Dispatch<RootActionType>, getState: () => AppRootStateType) => {
    dispatch(changeEntityStatus({todolistId, taskId, entityStatus: TaskEntityStatus.Expectation}))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const model: UpdateTaskModelType = {
            title: task.title, // утверждаем что этот элемент точно будет
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...data
        }
        TodolistApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                if (res.data.resultCode === ResultCode.OK) {
                    dispatch(changeTaskStatusAC({taskId, model, todolistId}))
                    dispatch(changeEntityStatus({todolistId, taskId, entityStatus: TaskEntityStatus.Prepared}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
                dispatch(changeEntityStatus({todolistId, taskId, entityStatus: TaskEntityStatus.Expectation}))
            })
    }
}

//types
export type TasksActionType =
    | ReturnType<typeof deleteTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeEntityStatus>
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistAT
    | SetErrorACType

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

