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

//actions
export const setLoadingStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (value: string | null) => ({type: 'APP/SET-ERROR', value} as const)

//types
const initialState = {
    error: null as string | null,// errorIsActive
    status: 'loading' as RequestStatusType
}


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateType = typeof initialState
export type AppActionsType =
    | SetLoadingStatusACType
    | ReturnType<typeof setErrorAC>

export type SetLoadingStatusACType = ReturnType<typeof setLoadingStatusAC>
export type SetErrorACType = ReturnType<typeof setErrorAC>


