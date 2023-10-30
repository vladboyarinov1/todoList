import { combineReducers } from "redux";
import { tasksReducer, todolistsReducer } from "features/TodolistsList";
import { appReducer } from "features/Application";
import { authReducer } from "features/Auth";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

// @ts-ignore
window.store = store;
