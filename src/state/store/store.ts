import {AnyAction, combineReducers} from 'redux'
import {TasksActionType, tasksReducer} from '../reducers/tasks-reducer/tasks-reducer';
import {TodolistsActionType, todolistsReducer} from '../reducers/todolist-reducer/todolists-reducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppActionsType, appReducer} from '../reducers/app-reducer/app-reducer';
import {authReducer} from '../reducers/auth-reducer/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';


// объединяя reducer-ы с помощью combineReducers,
//типизировали хук диспатч, по сути сделали свой хук и лучше его вынести отдельно
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})


// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().prepend(thunk)
})

// определить автоматически тип всего объекта состояния
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store

//types
export type RootActionType = TodolistsActionType | TasksActionType | AppActionsType
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionType>
export type AppRootStateType = ReturnType<typeof rootReducer>
