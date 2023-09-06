import {Dispatch} from 'redux'
import {setIsInitializedAC, setLoadingStatusAC} from '../app-reducer/app-reducer';
import {AuthApi} from '../../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {ResultCode} from '../tasks-reducer/tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

export const loginTC = createAsyncThunk('auth/login', async (param: any, thunkAPI) => {
    thunkAPI.dispatch(setLoadingStatusAC({status: 'loading'}))
    try {
        let res = await AuthApi.login(param)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setLoadingStatusAC({status: 'succeeded'}))
            return {value: true};

        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        handleServerNetworkError(e, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [e.errors], fieldsErrors: undefined})
    }

})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks

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