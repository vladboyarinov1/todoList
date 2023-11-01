import { appActions } from "features/CommonActions/App";

import { BaseResponse } from "common/types/commonTypes";

type ThunkAPI = {
    dispatch: (action: any) => any;
    rejectWithValue: Function;
};

/**
 *
 * @param data
 * @param thunkAPI
 * @param showError
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, thunkAPI: ThunkAPI, showError: boolean = true) => {
    if (showError) {
        thunkAPI.dispatch(
            appActions.setError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }),
        );
    }
    thunkAPI.dispatch(appActions.setLoadingStatus({ status: "failed" }));
};
