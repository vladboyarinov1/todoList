import {Dispatch} from 'redux'
import {SetErrorACType, setLoadingStatusAC} from '../../App/app-reducer';
import {RootActionType} from '../../store/store';
import {AuthApi} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {ResultCode} from '../tasks-reducer/tasks-reducer';

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}
type InitialStateType = typeof initialState


export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'login/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const setIsInitializedAC = (value: boolean) =>
    ({type: 'login/SET-IS-INITIALIZED', value} as const)


export const loginTC = (data: any) => (dispatch: Dispatch<ActionsType>) => {
    // dispatch(setLoadingStatusAC('loading'))
    AuthApi.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setLoadingStatusAC('succeeded'))

            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    AuthApi.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setIsInitializedAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((e) => handleServerNetworkError(e, dispatch))
        .finally(() => dispatch(setIsInitializedAC(true)))
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setLoadingStatusAC('loading'))
    AuthApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setLoadingStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
type ActionsType =
    ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsInitializedAC>
    | RootActionType
    | SetErrorACType
