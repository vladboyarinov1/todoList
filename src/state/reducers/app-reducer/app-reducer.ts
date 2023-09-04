import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    error: null as string | null,// errorIsActive
    status: 'loading' as RequestStatusType,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setLoadingStatusAC(state, action: PayloadAction<{
            status: RequestStatusType
        }>) {
            state.status = action.payload.status
        },
        setErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer

export const {setLoadingStatusAC, setErrorAC, setIsInitializedAC} = slice.actions

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppActionsType =
    | SetLoadingStatusACType
    | ReturnType<typeof setErrorAC>

export type SetLoadingStatusACType = ReturnType<typeof setLoadingStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>


