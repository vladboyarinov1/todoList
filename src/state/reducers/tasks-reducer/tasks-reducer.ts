import {TasksStateType} from '../../../App/App';
import {AddTodolistAT, RemoveTodolistAT, SetTodolistAT,} from '../todolist-reducer/todolists-reducer';
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

export const tasksReducer = (state: TasksStateType = {}, action: TasksActionType): TasksStateType => {
    switch (action.type) {

        case 'SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        case 'SET-TODOLIST': {
            const copyState = {...state}
            action.todos.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    ...action.payload.model
                } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.title
                } : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        // const {[action.id]: [], ...rest} = state
        // return rest
        case 'TASKS/CHANGE-ENTITY-STATUS':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                        ...t,
                        entityStatus: action.payload.entityStatus
                    } : t
                )
            }
        default:
            return state
    }
}

//actions
export const deleteTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    payload: {taskId, todolistId}
} as const)
export const addTaskAC = (task: TaskType) => ({
    type: 'ADD-TASK',
    task
} as const)
export const changeTaskStatusAC = (taskId: string, model: FlexType, todolistId: string) => ({
    type: 'CHANGE-TASK-STATUS', payload: {taskId, model, todolistId}
} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    payload: {taskId, title, todolistId}
} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todolistId, tasks} as const)
export const changeEntityStatus = (todolistId: string, taskId: string, entityStatus: TaskEntityStatus) => ({
    type: 'TASKS/CHANGE-ENTITY-STATUS',
    payload: {taskId, entityStatus, todolistId}
} as const)

//thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<RootActionType>) => TodolistApi.getTasks(todolistId)
    .then((res) => {
        dispatch(setTasksAC(todolistId, res.data.items))
    })
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<RootActionType>) => {
    dispatch(changeEntityStatus(todolistId, taskId, TaskEntityStatus.Expectation))
    TodolistApi.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(deleteTaskAC(taskId, todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatus(todolistId, taskId, TaskEntityStatus.Prepared))
        })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<RootActionType>) => {
    TodolistApi.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTaskAC(res.data.data.item))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}
export const updateTaskTC = (todolistId: string, taskId: string, data: FlexType) => (dispatch: Dispatch<RootActionType>, getState: () => AppRootStateType) => {
    dispatch(changeEntityStatus(todolistId, taskId, TaskEntityStatus.Expectation))
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
                    dispatch(changeTaskStatusAC(taskId, model, todolistId))
                    dispatch(changeEntityStatus(todolistId, taskId, TaskEntityStatus.Prepared))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
                dispatch(changeEntityStatus(todolistId, taskId, TaskEntityStatus.Prepared))
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

