import {TodolistType} from '../../../api/todolist-api';
import {RequestStatusType, SetLoadingStatusACType} from '../app-reducer/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistTC, deleteTodolistTC, fetchTodolists, updateTodolistTC} from './todolists-actions';

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
    | SetLoadingStatusACType
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof changeTodosEntityStatus>

export type FilterValueType = 'all' | 'active' | 'complete'

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
