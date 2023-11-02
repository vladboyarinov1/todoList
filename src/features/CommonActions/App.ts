import { createAction } from "@reduxjs/toolkit";
import { RequestStatus } from "features/Application/applicationSlice";

const setLoadingStatus = createAction<{ status: RequestStatus }>("appActions/setLoadingStatus");
const setError = createAction<{ error: string | null }>("appActions/setError");
const setLinearProgress = createAction<{ value: boolean | null }>("appActions/setLinearProgress");

export const appActions = {
    setLoadingStatus,
    setError,
    setLinearProgress,
};
