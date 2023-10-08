import * as appSelectors from './selectors'
import {slice} from './app-reducer'

const appReducer = slice.reducer

export {
    appSelectors,
    appReducer
}