import {asyncActions as tasksAsyncActions} from './TodoList/Task/tasks-reducer/tasks-reducer'
import {asyncActions as todolistsAsyncActions} from './todolists-reducer/todolists-reducer'

import {slice} from './todolists-reducer/todolists-reducer'

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