import {TasksStateType} from '../../App/App';
import {v1} from 'uuid';
import {AddTodolistAT, RemoveTodolistAT, todoListId_1} from '../todolist-reducer/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';


export type RemoveTaskAT = ReturnType<typeof removeTaskAC>//верни нам тип, то что вернет функция removeTaskAC
export type AddTaskAT = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>


export type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | AddTodolistAT
    | RemoveTodolistAT

const initialState: TasksStateType = {
    [todoListId_1]: [{
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todoListId_1,
        description: '',

    },
        {
            id: v1(), title: 'JS', status: TaskStatuses.Completed, startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            todoListId: todoListId_1,
            description: '',

        },
        {
            id: v1(), title: 'React', status: TaskStatuses.New, startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            todoListId: todoListId_1,
            description: '',

        }]
}

export const tasksReducer = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {

        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.todolistId]: [{
                    id: v1(),
                    title: action.payload.title,
                    status: TaskStatuses.New,
                    startDate: '',
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: action.payload.todolistId,
                    description: '',

                }, ...state[action.payload.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':

            return {

                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    status: action.payload.status
                } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.title
                } : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        // const {[action.id]: [], ...rest} = state
        // return rest

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    payload: {taskId, todolistId}
} as const)

export const addTaskAC = (title: string, todolistId: string) => ({
    type: 'ADD-TASK',
    payload: {title, todolistId}
} as const)

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({
    type: 'CHANGE-TASK-STATUS', payload: {taskId, status, todolistId}
} as const)

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    payload: {taskId, title, todolistId}
} as const)

