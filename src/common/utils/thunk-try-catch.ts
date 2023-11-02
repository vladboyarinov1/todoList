import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatch, AppRootState } from "common/types";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { appActions } from "features/CommonActions/App";

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootState, unknown, AppDispatch, null | ResponseType>,
    logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setLinearProgress({ value: true }));
    try {
        return await logic();
    } catch (e: any) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(e.errors);
    } finally {
        dispatch(appActions.setLinearProgress({ value: false }));
    }
};
