import * as tasksActions from '../../state/reducers/tasks-reducer/tasks-actions'
import * as todolistsAsyncActions from '../../state/reducers/todolist-reducer/todolists-actions'
import {slice} from '../../state/reducers/todolist-reducer/todolists-reducer'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...slice.actions
}
export {
    tasksActions,
    todolistsActions
}