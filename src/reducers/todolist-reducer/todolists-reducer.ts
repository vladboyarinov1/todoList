import {v1} from 'uuid';
import {TodolistApi, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setStatusAC, SetStatusACType} from '../../App/app-reducer';
import {ActionType, ResultCode} from '../tasks-reducer/tasks-reducer';

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListTitleAT = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistAT = ReturnType<typeof setTodolistAC>
export type ChangeTodosEntityStatusAT = ReturnType<typeof changeTodosEntityStatus>

export  type TodolistActionType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodoListTitleAT
    | ChangeTodolistFilterAT
    | SetTodolistAT
    | SetStatusACType
    | ChangeTodosEntityStatusAT

// export type ActionType = Record<string, { type: string; id?: string; title?: string; filter?: FilterValueType }>
export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}

export const todolistsReducer = (todolists: TodolistDomainType[] = [], action: TodolistActionType): TodolistDomainType[] => {

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

export const getTodolistTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    TodolistApi.getTodolists()
        .then(res => {
            dispatch(setTodolistAC(res.data))
            dispatch(setStatusAC('succeeded'))
        })
}

export const deleteTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(changeTodosEntityStatus(id, 'loading'))
    TodolistApi.deleteTodolist(id)
        .then(() => {
            dispatch(removeTodolistAC(id))
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    TodolistApi.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item.title, res.data.data.item.id))
        })
}

export const updateTodolistTC = (id: string, title: string) => (dispatch: Dispatch) => {
    TodolistApi.updateTodolistTitle(id, title)
        .then(() => dispatch(changeTodoListTitleAC(title, id)))
}
