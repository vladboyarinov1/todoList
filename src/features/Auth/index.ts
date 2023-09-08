import * as authSelectors from './selectors'
import {Auth} from './Auth'
import {asyncActions, slice} from './auth-reducer/auth-reducer'


const authAction = {
    ...asyncActions,
    ...slice.actions
}
export {
    authSelectors,
    authAction,
    Auth
}
