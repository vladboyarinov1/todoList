import {Dispatch} from 'redux'
import {setIsInitializedAC, setLoadingStatusAC} from '../app-reducer/app-reducer';
import {AuthApi} from '../../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks
export const loginTC = (data: any) => (dispatch: Dispatch) => {
    // dispatch(setLoadingStatusAC('loading'))
    AuthApi.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setLoadingStatusAC({status: 'succeeded'}))

            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => handleServerNetworkError(e, dispatch))
}
export const initializeAppTC = () => (dispatch: Dispatch) => {
    AuthApi.me().then(res => {
        if (res.data.resultCode === 0) {
            //значит залогинины
            dispatch(setIsLoggedInAC({value: true}));
            dispatch(setIsInitializedAC({isInitialized: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((e) => handleServerNetworkError(e, dispatch))
        .finally(() => dispatch(setIsInitializedAC({isInitialized: true})))
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setLoadingStatusAC({status: 'loading'}))
    AuthApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setLoadingStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}