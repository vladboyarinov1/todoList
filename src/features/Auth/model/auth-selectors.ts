import { AppRootState } from "common/types/commonTypes";

export const selectIsLoggedIn = (state: AppRootState) => state.auth.isLoggedIn;
