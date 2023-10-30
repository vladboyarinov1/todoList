import { AppRootStateType } from "common/types/commonTypes";

export const selectIsLoggedIn = (state: AppRootStateType) =>
    state.auth.isLoggedIn;
