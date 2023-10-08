import {TodolistApi} from '../../../api/todolist-api';
import {
    RequestStatusType,
} from '../../Application/application-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {FieldErrorType, TodolistType} from '../../../api/types';
import {appActions} from '../../CommonActions/App';

const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (param, {dispatch}) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const res = await TodolistApi.getTodolists()
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
        return {todos: res.data}
    } catch (e) {
        throw new Error('error in getTodolistTC')
    }
})

const addTodolistTC = createAsyncThunk<any, string, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('todolists/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(appActions.setLinearProgress({value: true}))
    try {
        const res = await TodolistApi.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(appActions.setLinearProgress({value: false}))
            return {todolist: res.data.data.item}
        } else {
            return handleServerAppError(res.data, thunkAPI)

        }
    } catch (e: any) {
        return handleServerNetworkError(e, thunkAPI.dispatch)
    } finally {
        thunkAPI.dispatch(appActions.setLinearProgress({value: false}))
    }
})
const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolist', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(changeTodosEntityStatus({id, status: 'loading'}))
    thunkAPI.dispatch(appActions.setLinearProgress({value: true}))
    try {
        const res = await TodolistApi.deleteTodolist(id)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(changeTodosEntityStatus({id, status: 'succeeded'}))
            thunkAPI.dispatch(appActions.setLinearProgress({value: false}))
            return {id}
        } else {
            handleServerAppError(res.data, thunkAPI)
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch)

    }
})
const updateTodolistTC = createAsyncThunk('todolists/updateTodolist', async (param: {
    id: string,
    title: string
}, thunkAPI) => {
    thunkAPI.dispatch(appActions.setLinearProgress({value: true}))
    try {
        const res = await TodolistApi.updateTodolistTitle(param.id, param.title)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(appActions.setLinearProgress({value: false}))
            return {title: param.title, id: param.id}
        } else {
            handleServerAppError(res.data, thunkAPI)
        }
    } catch (e: any) {
        thunkAPI.dispatch(appActions.setLinearProgress({value: false}))
        handleServerNetworkError(e, thunkAPI.dispatch)
    }
})

export const asyncActions = {
    fetchTodolists,
    addTodolistTC,
    deleteTodolistTC,
    updateTodolistTC
}

const initialState: TodolistDomainType[] = []
export const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{
            filter: FilterValueType,
            id: string
        }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
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
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todos.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}));
        });
        builder.addCase(deleteTodolistTC.fulfilled, (state, action: any) => {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            }
            return state;
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
            }
        });
        builder.addCase(updateTodolistTC.fulfilled, (state, action: any) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        });
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilter,
    changeTodosEntityStatus
} = slice.actions

// types
export type SetTodolistAT = ReturnType<typeof fetchTodolists.fulfilled>

export  type TodolistsActionType =
    | SetTodolistAT
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof changeTodosEntityStatus>

export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
