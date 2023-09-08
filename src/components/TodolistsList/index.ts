import {asyncActions as tasksAsyncActions} from '../../state/reducers/tasks-reducer/tasks-reducer'
import {asyncActions as todolistsAsyncActions} from '../../state/reducers/todolist-reducer/todolists-reducer'

import {slice} from '../../state/reducers/todolist-reducer/todolists-reducer'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...slice.actions
}
const tasksActions = {
    ...tasksAsyncActions,
}
export {
    tasksActions,
    todolistsActions
}