import {createAsyncThunk} from '@reduxjs/toolkit';
import {TodolistApi} from '../../../api/todolist-api';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {changeTodosEntityStatus} from './todolists-reducer';
import {setLoadingStatusAC} from '../app-reducer/app-reducer';

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