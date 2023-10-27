import { Dispatch } from "redux";
import { ResponseType } from "api/types";
import { appActions } from "features/CommonActions/App";

type ThunkAPIType = {
    dispatch: (action: any) => any;
    rejectWithValue: Function;
};
// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, thunkAPI: ThunkAPIType) => {
    if (data.messages.length) {
        thunkAPI.dispatch(appActions.setError({ error: data.messages[0] }));
    } else {
        thunkAPI.dispatch(appActions.setError({ error: "Some error occurred" }));
    }
    thunkAPI.dispatch(appActions.setLoadingStatus({ status: "failed" }));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(appActions.setError({ error: error.message || "Some error" }));
    dispatch(appActions.setLoadingStatus({ status: "failed" }));
};
