import {AppRootStateType} from '../../state/store/store';

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;