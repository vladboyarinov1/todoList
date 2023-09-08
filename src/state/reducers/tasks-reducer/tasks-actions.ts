import {createAsyncThunk} from '@reduxjs/toolkit';
import {TaskEntityStatus, TodolistApi} from '../../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AppRootStateType} from '../../store/store';
import {changeEntityStatus, ResultCode} from './tasks-reducer';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string) => {
    let res = await TodolistApi.getTasks(todolistId);
    return {todolistId, tasks: res.data.items}
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    model: any
}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType
    dispatch(changeEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: TaskEntityStatus.Expectation
    }))
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (task) {
        const model = {
            title: task.title, // утверждаем что этот элемент точно будет
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...param.model
        }
        const res =
            await TodolistApi.updateTask(param.todolistId, param.taskId, model)
        try {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeEntityStatus({
                    todolistId: task.todoListId,
                    taskId: task.id,
                    entityStatus: TaskEntityStatus.Prepared
                }))
                return {taskId: task.id, model, todolistId: task.todoListId}

            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
            // dispatch(changeEntityStatus({param.todolistId, param.taskId, entityStatus: TaskEntityStatus.Expectation}))
        }
    } else {
        return rejectWithValue(null)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, {dispatch}) => {
        dispatch(changeEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: TaskEntityStatus.Expectation
        }))
        try {
            let res = await TodolistApi.deleteTask(param.todolistId, param.taskId);
            if (res.data.resultCode === ResultCode.OK) {
                return {taskId: param.taskId, todolistId: param.todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: TaskEntityStatus.Prepared
            }))
        }
    })
export const addTaskTC = createAsyncThunk('tasks/addTask',
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        const res = await TodolistApi.createTask(param.todolistId, param.title)
        try {
            if (res.data.resultCode === ResultCode.OK) {
                return {task: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })