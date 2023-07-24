export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// export type ErrorStatusType = 'errorIsActive' | 'nonError'

const initialState = {
    error: null as string | null,// errorIsActive
    status: 'loading' as RequestStatusType
}

type InitialStateType = typeof initialState
type AppActionsType = SetStatusACType
    | ReturnType<typeof setErrorAC>

export type SetStatusACType = ReturnType<typeof setStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.value}
        default:
            return state
    }
}

export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (value: string | null) => ({type: 'APP/SET-ERROR', value} as const)
