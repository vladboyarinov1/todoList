import { combineReducers } from "redux";
import { tasksReducer, todolistsReducer } from "features/TodolistsList";
import thunk from "redux-thunk";
import { appReducer } from "features/Application";
import { authReducer } from "features/Auth";
import { configureStore } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

// @ts-ignore
window.store = store;
