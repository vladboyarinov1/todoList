import { asyncActions, slice } from './application-reducer';
import * as appSelectors from './selectors';

const appReducer = slice.reducer;
const actions = slice.actions;
const appActions = {
    ...actions,
    ...asyncActions,
};

export { appSelectors, appReducer, appActions };