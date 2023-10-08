import {createAction} from '@reduxjs/toolkit'
import {RequestStatusType} from '../Application/application-reducer'


const setLoadingStatus = createAction<{status: RequestStatusType}>('appActions/setLoadingStatus')
const setError = createAction<{error: string | null}>('appActions/setError')
const setLinearProgress = createAction<{value: boolean | null}>('appActions/setLinearProgress')

export const appActions = {
    setLoadingStatus,
    setError,
    setLinearProgress
}
