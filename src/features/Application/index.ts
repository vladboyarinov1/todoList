import { slice } from "features/Application/applicationSlice";
import * as appSelectors from "./selectors";

const appReducer = slice.reducer;
const actions = slice.actions;
const appActions = {
    ...actions,
};

export { appSelectors, appReducer, appActions };
