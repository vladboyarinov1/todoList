import {TodolistApi, TodolistType} from '../../../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setLoadingStatusAC, SetLoadingStatusACType} from '../app-reducer/app-reducer';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AppThunkType, RootActionType} from '../../store/store';


export const todolistsReducer = (todolists: TodolistDomainType[] = [], action: TodolistsActionType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoList: TodolistDomainType = {
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0,
                entityStatus: 'idle'
            }

            return [
                newTodoList,
                ...todolists
            ]
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLIST':
            return action.todos.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE-ENTITY-STATUS':
            return todolists.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return todolists
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (title: string, id: string) => ({type: 'ADD-TODOLIST', title, todolistId: id} as const)
export const changeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id
} as const)
export const changeTodolistFilterAC = (filter: FilterValueType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id
} as const)
export const setTodolistAC = (todos: TodolistType[]) => ({type: 'SET-TODOLIST', todos} as const)
export const changeTodosEntityStatus = (id: string, status: RequestStatusType) =>
    ({type: 'CHANGE-ENTITY-STATUS', id, status} as const)

// thunks
export const getTodolistTC = (): AppThunkType => async (dispatch: Dispatch<RootActionType>) => {
    dispatch(setLoadingStatusAC('loading'))
    try {
        const res = await TodolistApi.getTodolists()
        dispatch(setTodolistAC(res.data))
        dispatch(setLoadingStatusAC('succeeded'))
    } catch (e) {
        throw new Error('error in getTodolistTC')
    }
}
export const deleteTodolistTC = (id: string) => (dispatch: Dispatch<RootActionType>) => {
    dispatch(changeTodosEntityStatus(id, 'loading'))
    TodolistApi.deleteTodolist(id)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC(id))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodosEntityStatus(id, 'idle'))
        })
}
export const addTodolistTC = (title: string): AppThunkType => (dispatch: Dispatch<RootActionType>) => {
    TodolistApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistAC(res.data.data.item.title, res.data.data.item.id))
                // dispatch(setLoadingStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}
export const updateTodolistTC = (id: string, title: string) => (dispatch: Dispatch<RootActionType>) => {
    TodolistApi.updateTodolistTitle(id, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeTodoListTitleAC(title, id))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}

// types
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type  RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type SetTodolistAT = ReturnType<typeof setTodolistAC>

export  type TodolistsActionType =
    | RemoveTodolistAT
    | AddTodolistAT
    | SetTodolistAT
    | SetLoadingStatusACType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodosEntityStatus>


export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
