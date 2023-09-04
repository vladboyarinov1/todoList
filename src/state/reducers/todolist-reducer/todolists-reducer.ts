import {TodolistApi, TodolistType} from '../../../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setLoadingStatusAC, SetLoadingStatusACType} from '../app-reducer/app-reducer';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AppThunkType, RootActionType} from '../../store/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TodolistDomainType[] = []
const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            // state.filter(tl => tl.id !== action.payload.id)
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            }

            return state;
        },
        addTodolistAC(state, action: PayloadAction<{ title: string, todolistId: string }>) {
            let newTodo: TodolistDomainType = {
                id: action.payload.todolistId,
                title: action.payload.title,
                filter: 'all',
                addedDate: '',
                order: 0,
                entityStatus: 'idle'
            }
            state.unshift(newTodo)
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{
            filter: FilterValueType,
            id: string
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistAC(state, action: PayloadAction<{ todos: TodolistType[] }>) {
            return action.payload.todos.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}));
        },
        changeTodosEntityStatus(state, action: PayloadAction<{
            id: string,
            status: RequestStatusType
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index !== -1) {
                state[index].entityStatus = action.payload.status;
            }

            return state;
        }
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodoListTitleAC,
    changeTodolistFilterAC,
    setTodolistAC,
    changeTodosEntityStatus
} = slice.actions

// thunks
export const getTodolistTC = (): AppThunkType => async (dispatch: Dispatch<RootActionType>) => {
    dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        const res = await TodolistApi.getTodolists()
        dispatch(setTodolistAC({todos: res.data}))
        dispatch(setLoadingStatusAC({status: 'succeeded'}))
    } catch (e) {
        throw new Error('error in getTodolistTC')
    }
}
export const deleteTodolistTC = (id: string) => (dispatch: Dispatch<RootActionType>) => {

    dispatch(changeTodosEntityStatus({id, status: 'loading'}))
    TodolistApi.deleteTodolist(id)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC({id}))
                dispatch(changeTodosEntityStatus({id, status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodosEntityStatus({id, status: 'idle'}))
        })
}
export const addTodolistTC = (title: string): AppThunkType => (dispatch: Dispatch<RootActionType>) => {
    TodolistApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistAC({title: res.data.data.item.title, todolistId: res.data.data.item.id}))
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
                dispatch(changeTodoListTitleAC({title, id}))
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
