import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {TasksActionType, tasksReducer} from '../reducers/tasks-reducer/tasks-reducer';
import {TodolistsActionType, todolistsReducer} from '../reducers/todolist-reducer/todolists-reducer';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppActionsType, appReducer} from '../App/app-reducer';
import {authReducer} from '../reducers/auth-reducer/auth-reducer';

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

//все типы
export type RootActionType = TodolistsActionType | TasksActionType | AppActionsType

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionType>

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))
// определить автоматически тип всего объекта состояния
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type AppRootStateType = ReturnType<typeof rootReducer>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
