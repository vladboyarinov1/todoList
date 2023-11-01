import { AppRootState } from "common/types/commonTypes";

export const selectIsInitialized = (state: AppRootState) => state.app.isInitialized;
export const selectIsLinearProgress = (state: AppRootState) => state.app.isLinearProgress;
