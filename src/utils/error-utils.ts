import {Dispatch} from 'redux'
import {setErrorAC, SetErrorACType, setLoadingStatusAC, SetLoadingStatusACType} from '../App/app-reducer';
import {ResponseType} from '../api/todolist-api';

type ErrorUtilsDispatchType = Dispatch<SetErrorACType | SetLoadingStatusACType>
// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error occurred'))
    }
    dispatch(setLoadingStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC(error.message))
    dispatch(setLoadingStatusAC('failed'))
}


