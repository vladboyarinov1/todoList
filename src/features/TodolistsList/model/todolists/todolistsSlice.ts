import { RequestStatus } from "features/Application/application-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { appActions } from "features/CommonActions/App";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { todolistsApi } from "features/TodolistsList/api/todolists/todolistsApi";
import { ResultCode } from "common/enums/enums";
import { FieldError } from "common/types/commonTypes";
import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";

const { setLoadingStatus, setLinearProgress } = appActions;

const fetchTodolists = createAsyncThunk("todolists/fetchTodolists", async (param, { dispatch }) => {
    dispatch(setLoadingStatus({ status: "loading" }));
    try {
        const res = await todolistsApi.getTodolists();
        dispatch(setLoadingStatus({ status: "succeeded" }));
        return { todos: res.data };
    } catch (e) {
        throw new Error("error in getTodolistTC");
    }
});

const addTodolist = createAsyncThunk<
    any,
    string,
    {
        rejectValue: { errors: string[]; fieldsErrors?: FieldError[] };
    }
>("todolists/addTodolist", async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setLinearProgress({ value: true }));
    try {
        const res = await todolistsApi.createTodolist(title);
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
const deleteTodolist = createAsyncThunk("todolists/deleteTodolist", async (id: string, thunkAPI) => {
    thunkAPI.dispatch(changeTodosEntityStatus({ id, status: "loading" }));
    thunkAPI.dispatch(setLinearProgress({ value: true }));
    try {
        const res = await todolistsApi.deleteTodolist(id);
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
const updateTodolist = createAsyncThunk(
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
            const res = await todolistsApi.updateTodolistTitle(param.id, param.title);
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
    addTodolist,
    deleteTodolist,
    updateTodolist,
};

export const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomain[],
    reducers: {
        changeTodolistFilter(
            state,
            action: PayloadAction<{
                filter: FilterValue;
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
                status: RequestStatus;
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
                return action.payload.todos.map((tl) => ({
                    ...tl,
                    filter: "all",
                    entityStatus: "idle",
                }));
            })
            .addCase(deleteTodolist.fulfilled, (state, action: any) => {
                // console.log(current(state));
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state.splice(index, 1);
                }
                return state;
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                if (action.payload) {
                    state.unshift({
                        ...action.payload.todolist,
                        filter: "all",
                        entityStatus: "idle",
                    });
                }
            })
            .addCase(updateTodolist.fulfilled, (state, action: any) => {
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

export type FilterValue = "all" | "active" | "complete";

export type TodolistDomain = Todolist & {
    filter: FilterValue;
    entityStatus: RequestStatus;
};
