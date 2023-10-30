import { Dispatch } from "redux";
import { appActions } from "features/CommonActions/App";

export const handleServerNetworkError = (
    error: { message: string },
    dispatch: Dispatch,
) => {
    dispatch(appActions.setError({ error: error.message || "Some error" }));
    dispatch(appActions.setLoadingStatus({ status: "failed" }));
};
