import * as authSelectors from "features/Auth/model/auth-selectors";
import { Auth } from "features/Auth/ui/Auth";
import { asyncActions, slice } from "features/Auth/model/authSlice";

const authAction = {
    ...asyncActions,
    ...slice.actions,
};
const authReducer = slice.reducer;

export { authSelectors, authAction, Auth, authReducer };
