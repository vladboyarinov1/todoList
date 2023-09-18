import {Dispatch} from 'redux'
import {
    setErrorAC,
    SetErrorACType,
    setLoadingStatusAC,
    SetLoadingStatusACType
} from '../App/app-reducer/app-reducer';
import {ResponseType} from '../api/todolist-api';

type ErrorUtilsDispatchType = Dispatch<SetErrorACType | SetLoadingStatusACType>
// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setLoadingStatusAC({status: 'failed'}))

}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC({error: error.message || 'Some error'}))
    dispatch(setLoadingStatusAC({status: 'failed'}))

}


