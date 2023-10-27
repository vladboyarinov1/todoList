import { TodolistApi } from "api/todolist-api";
import { RequestStatusType } from "../../Application/application-reducer";
import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ResultCode } from "../tasks-reducer/tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { FieldErrorType, TodolistType } from "api/types";
import { appActions } from "../../CommonActions/App";

const { setLoadingStatus, setLinearProgress } = appActions;

const fetchTodolists = createAsyncThunk("todolists/fetchTodolists", async (param, { dispatch }) => {
    dispatch(setLoadingStatus({ status: "loading" }));
    try {
        const res = await TodolistApi.getTodolists();
        dispatch(setLoadingStatus({ status: "succeeded" }));
        return { todos: res.data };
    } catch (e) {
        throw new Error("error in getTodolistTC");
    }
});

const addTodolistTC = createAsyncThunk<
    any,
    string,
    {
        rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] };
    }
>("todolists/addTodolist", async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setLinearProgress({ value: true }));
    try {
        const res = await TodolistApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setLinearProgress({ value: false }));
            return { todolist: res.data.data.item };
        } else {
            return handleServerAppError(res.data, thunkAPI);
        }
    } catch (e: any) {
        return handleServerNetworkError(e, thunkAPI.dispatch);
    } finally {
        thunkAPI.dispatch(setLinearProgress({ value: false }));
    }
});
const deleteTodolistTC = createAsyncThunk("todolists/deleteTodolist", async (id: string, thunkAPI) => {
    thunkAPI.dispatch(changeTodosEntityStatus({ id, status: "loading" }));
    thunkAPI.dispatch(setLinearProgress({ value: true }));
    try {
        const res = await TodolistApi.deleteTodolist(id);
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(changeTodosEntityStatus({ id, status: "succeeded" }));
            thunkAPI.dispatch(setLinearProgress({ value: false }));
            return { id };
        } else {
            handleServerAppError(res.data, thunkAPI);
        }
    } catch (e: any) {
        handleServerNetworkError(e, thunkAPI.dispatch);
    }
});
const updateTodolistTC = createAsyncThunk(
    "todolists/updateTodolist",
    async (
        param: {
            id: string;
            title: string;
        },
        thunkAPI,
    ) => {
        thunkAPI.dispatch(setLinearProgress({ value: true }));
        try {
            const res = await TodolistApi.updateTodolistTitle(param.id, param.title);
            if (res.data.resultCode === ResultCode.OK) {
                thunkAPI.dispatch(setLinearProgress({ value: false }));
                return { title: param.title, id: param.id };
            } else {
                handleServerAppError(res.data, thunkAPI);
            }
        } catch (e: any) {
            thunkAPI.dispatch(setLinearProgress({ value: false }));
            handleServerNetworkError(e, thunkAPI.dispatch);
        }
    },
);

export const asyncActions = {
    fetchTodolists,
    addTodolistTC,
    deleteTodolistTC,
    updateTodolistTC,
};

export const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(
            state,
            action: PayloadAction<{
                filter: FilterValueType;
                id: string;
            }>,
        ) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodosEntityStatus(
            state,
            action: PayloadAction<{
                id: string;
                status: RequestStatusType;
            }>,
        ) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            if (index !== -1) {
                state[index].entityStatus = action.payload.status;
            }
            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todos.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action: any) => {
                // console.log(current(state));
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state.splice(index, 1);
                }
                return state;
            })
            .addCase(addTodolistTC.fulfilled, (state, action) => {
                if (action.payload) {
                    state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
                }
            })
            .addCase(updateTodolistTC.fulfilled, (state, action: any) => {
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state[index].title = action.payload.title;
                }
            });
    },
});

export const todolistsReducer = slice.reducer;
export const { changeTodolistFilter, changeTodosEntityStatus } = slice.actions;

// types
export type SetTodolistAT = ReturnType<typeof fetchTodolists.fulfilled>;

export type FilterValueType = "all" | "active" | "complete";

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType;
    entityStatus: RequestStatusType;
};
