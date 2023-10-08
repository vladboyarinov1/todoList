import * as authSelectors from './selectors'
import {Auth} from './Auth'
import {asyncActions, slice} from './auth-reducer'


const authAction = {
    ...asyncActions,
    ...slice.actions
}
const authReducer = slice.reducer

export {
    authSelectors,
    authAction,
    Auth,
    authReducer
}
