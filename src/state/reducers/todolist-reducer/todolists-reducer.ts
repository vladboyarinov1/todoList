import {TodolistApi, TodolistType} from '../../../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setLoadingStatusAC, SetLoadingStatusACType} from '../app-reducer/app-reducer';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {RootActionType} from '../../store/store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (param, {dispatch}) => {
    dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        const res = await TodolistApi.getTodolists()
        dispatch(setLoadingStatusAC({status: 'succeeded'}))
        return {todos: res.data}
    } catch (e) {
        throw new Error('error in getTodolistTC')
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch}) => {
    try {
        const res = await TodolistApi.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            return {todolist: res.data.data.item}
            // return {title: res.data.data.item.title, todolistId: res.data.data.item.id}
            // dispatch(setLoadingStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
})

export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolist', async (id: string, {dispatch}) => {


    dispatch(changeTodosEntityStatus({id, status: 'loading'}))

    const res = await TodolistApi.deleteTodolist(id)
    try {
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(changeTodosEntityStatus({id, status: 'succeeded'}))
            return {id}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        dispatch(changeTodosEntityStatus({id, status: 'idle'}))
    }
})

export const updateTodolistTC = createAsyncThunk('todolists/updateTodolist', async (param: {
    id: string,
    title: string
}, {dispatch}) => {
    try {
        const res = await TodolistApi.updateTodolistTitle(param.id, param.title)
        if (res.data.resultCode === ResultCode.OK) {
            return {title: param.title, id: param.id}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
})

const initialState: TodolistDomainType[] = []
const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {

        changeTodolistFilterAC(state, action: PayloadAction<{
            filter: FilterValueType,
            id: string
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        // setTodolistAC(state, action: PayloadAction<{ todos: TodolistType[] }>) {
        //     return action.payload.todos.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}));
        // },
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
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todos.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}));
        });
        // removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
        //     // state.filter(tl => tl.id !== action.payload.id)
        //     const index = state.findIndex(tl => tl.id === action.payload.id);
        //     if (index !== -1) {
        //         state.splice(index, 1);
        //     }
        //
        //     return state;
        // },
        builder.addCase(deleteTodolistTC.fulfilled, (state, action: any) => {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            }
            return state;
        });

        //     addTodolistAC(state, action: PayloadAction<{ title: string, todolistId: string }>) {
        //         let newTodo: TodolistDomainType = {
        //             id: action.payload.todolistId,
        //             title: action.payload.title,
        //             filter: 'all',
        //             addedDate: '',
        //             order: 0,
        //             entityStatus: 'idle'
        //         }
        //         state.unshift(newTodo)
        //     },
        // }
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
            }
        });
        builder.addCase(updateTodolistTC.fulfilled, (state, action: any) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        });

        // changeTodoListTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     state[index].title = action.payload.title
        // },
    }
})

export const todolistsReducer = slice.reducer
export const {
    // changeTodoListTitleAC,
    changeTodolistFilterAC,
    changeTodosEntityStatus
} = slice.actions

// thunks


// types
// export type AddTodolistAT = ReturnType<typeof addTodolistAC>
// export type  RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type SetTodolistAT = ReturnType<typeof fetchTodolists.fulfilled>

export  type TodolistsActionType =
// | RemoveTodolistAT
// | AddTodolistAT
    | SetTodolistAT
    | SetLoadingStatusACType
    // | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodosEntityStatus>


export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
