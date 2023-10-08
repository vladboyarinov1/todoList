// объединяя reducer-ы с помощью combineReducers,
//типизировали хук диспатч, по сути сделали свой хук и лучше его вынести отдельно
import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {rootReducer} from '../App/store';

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>


//types
// export type RootActionType = TodolistsActionType | TasksActionType | AppActionsType
// export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, RootActionType>
export type AppRootStateType = ReturnType<typeof rootReducer>

// определить автоматически тип всего объекта состояния
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

