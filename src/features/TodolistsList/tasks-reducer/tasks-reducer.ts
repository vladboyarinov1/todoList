import { TasksStateType } from "app/App";
import { asyncActions as asyncTodolistsActions } from "../todolists-reducer/todolists-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "../../CommonActions/App";
import {
    createAppAsyncThunk,
    handleServerAppError,
    handleServerNetworkError,
} from "common/utils";
import { todolistsAPI } from "features/TodolistsList/todolists-api";
import { ResultCode, TaskEntityStatus } from "common/enums/enums";
import {
    AppRootStateType,
    CreateTaskParam,
    FlexType,
    TaskType,
} from "common/types/commonTypes";

const { setLinearProgress } = appActions;

export const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        changeEntityStatus(
            state,
            action: PayloadAction<{
                todolistId: string;
                taskId: string;
                entityStatus: TaskEntityStatus;
            }>,
        ) {
            state[action.payload.todolistId] = state[
                action.payload.todolistId
            ].map((t) =>
                t.id === action.payload.taskId
                    ? { ...t, entityStatus: action.payload.entityStatus }
                    : t,
            );
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(
                    action.payload.task,
                );
            })
            .addCase(updateTask.fulfilled, (state, action: any) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(
                    (t) => t.id === action.payload.taskId,
                );
                tasks[index] = { ...tasks[index], ...action.payload.model };
            })
            .addCase(fetchTasks.fulfilled, (state, action: any) => {
                state[action.payload?.todolistId] = action.payload?.tasks;
            })
            .addCase(removeTask.fulfilled, (state, action: any) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(
                    (t) => t.id === action.payload.taskId,
                );
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
            })
            .addCase(
                asyncTodolistsActions.deleteTodolistTC.fulfilled,
                (state, action: any) => {
                    delete state[action.payload.id];
                },
            )
            .addCase(
                asyncTodolistsActions.addTodolistTC.fulfilled,
                (state, action) => {
                    if (action.payload) {
                        state[action.payload.todolist.id] = [];
                    }
                },
            );
    },
});

const fetchTasks = createAppAsyncThunk<
    void | { todolistId: string; tasks: TaskType[] },
    string
>(`${slice.name}/fetchTasks`, async (todolistId: string, { dispatch }) => {
    dispatch(setLinearProgress({ value: true }));
    try {
        let res = await todolistsAPI.getTasks(todolistId);
        dispatch(setLinearProgress({ value: false }));
        return { todolistId, tasks: res.data.items };
    } catch (e: any) {
        dispatch(setLinearProgress({ value: false }));
        return handleServerNetworkError(e, dispatch);
    }
});
export type UpdateTaskParam = {
    todolistId: string;
    taskId: string;
    model: FlexType;
};
const updateTask = createAsyncThunk<any, UpdateTaskParam>(
    `${slice.name}/updateTask`,
    async (param, thunkAPI) => {
        const { dispatch, getState, rejectWithValue } = thunkAPI;
        dispatch(setLinearProgress({ value: true }));
        const state = getState() as AppRootStateType;
        dispatch(
            changeEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: TaskEntityStatus.Expectation,
            }),
        );
        const task = state.tasks[param.todolistId].find(
            (t) => t.id === param.taskId,
        );

        if (!task) {
            return rejectWithValue("task not found in the state");
        }
        const apiModel = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...param.model,
        };
        const res = await todolistsAPI.updateTask(
            param.todolistId,
            param.taskId,
            apiModel,
        );
        try {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(
                    changeEntityStatus({
                        todolistId: task.todoListId,
                        taskId: task.id,
                        entityStatus: TaskEntityStatus.Prepared,
                    }),
                );
                dispatch(setLinearProgress({ value: false }));
                return param;
            } else {
                return handleServerAppError(res.data, thunkAPI);
            }
        } catch (error: any) {
            handleServerNetworkError(error, dispatch);
        }
    },
);
const removeTask = createAsyncThunk(
    `${slice.name}/removeTask`,
    async (param: { todolistId: string; taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(
            changeEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                entityStatus: TaskEntityStatus.Expectation,
            }),
        );
        thunkAPI.dispatch(setLinearProgress({ value: true }));
        try {
            let res = await todolistsAPI.deleteTask(
                param.todolistId,
                param.taskId,
            );
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setLinearProgress({ value: false }));
                return { taskId: param.taskId, todolistId: param.todolistId };
            } else {
                handleServerAppError(res.data, thunkAPI);
            }
        } catch (e: any) {
            handleServerNetworkError(e, thunkAPI.dispatch);
            thunkAPI.dispatch(
                changeEntityStatus({
                    todolistId: param.todolistId,
                    taskId: param.taskId,
                    entityStatus: TaskEntityStatus.Prepared,
                }),
            );
        }
    },
);
const addTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskParam>(
    `${slice.name}/addTask`,
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setLinearProgress({ value: true }));
        try {
            const res = await todolistsAPI.createTask(param);
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setLinearProgress({ value: false }));
                return { task: res.data.data.item };
            } else {
                handleServerAppError(res.data, thunkAPI);
                return thunkAPI.rejectWithValue({
                    errors: res.data.messages,
                    fieldsErrors: res.data.fieldsErrors,
                });
            }
        } catch (e: any) {
            handleServerNetworkError(e, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({
                errors: [e.errors],
                fieldsErrors: undefined,
            });
        } finally {
            thunkAPI.dispatch(setLinearProgress({ value: false }));
        }
    },
);

export const tasksReducer = slice.reducer;
export const { changeEntityStatus } = slice.actions;
export const asyncActions = { fetchTasks, updateTask, addTask, removeTask };
export type InitialStateType = ReturnType<typeof slice.getInitialState>;
