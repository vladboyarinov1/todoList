import {TodolistApi, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, SetErrorACType, setLoadingStatusAC, SetLoadingStatusACType} from '../../App/app-reducer';
import {TasksActionType, ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AppRootStateType, AppThunkType, RootActionType} from '../../store/store';
import {ThunkAction} from 'redux-thunk';


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

export const removeTodolistAC = (id: string) => {
    return {type: 'REMOVE-TODOLIST', id} as const
}
export const addTodolistAC = (title: string, id: string) => {
    return ({type: 'ADD-TODOLIST', title, todolistId: id} as const)
}
export const changeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id
} as const)
export const changeTodolistFilterAC = (filter: FilterValueType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id
} as const)
export const setTodolistAC = (todos: TodolistType[]) => ({type: 'SET-TODOLIST', todos} as const)
export const changeTodosEntityStatus = (id: string, status: RequestStatusType) => {
    return ({type: 'CHANGE-ENTITY-STATUS', id, status} as const)
}

// export const getTodolistTC = () => (dispatch: Dispatch<RootActionType>) => {
//     dispatch(setLoadingStatusAC('loading'))
//     TodolistApi.getTodolists()
//         .then(res => {
//             dispatch(setTodolistAC(res.data))
//             dispatch(setLoadingStatusAC('succeeded'))
//         })
// }

export const getTodolistTC = (): AppThunkType => async dispatch => {
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
    // dispatch(setStatusAC('loading'))
    TodolistApi.deleteTodolist(id)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC(id))
                dispatch(setLoadingStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}

export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
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
        .then(() => dispatch(changeTodoListTitleAC(title, id)))
}

//types
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListTitleAT = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistAT = ReturnType<typeof setTodolistAC>
export type ChangeTodosEntityStatusAT = ReturnType<typeof changeTodosEntityStatus>

export  type TodolistsActionType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodoListTitleAT
    | ChangeTodolistFilterAT
    | SetTodolistAT
    | ChangeTodosEntityStatusAT
    | SetLoadingStatusACType

// export type ActionType = Record<string, { type: string; id?: string; title?: string; filter?: FilterValueType }>
export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
