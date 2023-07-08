import {TasksStateType} from '../../App/App';
import {v1} from 'uuid';
import {
    AddTodolistAT,
    RemoveTodolistAT,
    setTodolistAC,
    SetTodolistAT,
    todoListId_1
} from '../todolist-reducer/todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, TodolistApi} from '../../api/todolist-api';
import {Dispatch} from 'redux';


export type RemoveTaskAT = ReturnType<typeof deleteTaskAC>//верни нам тип, то что вернет функция removeTaskAC
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
    | SetTodolistAT
    | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {
    // [todoListId_1]: [{
    //     id: v1(),
    //     title: 'HTML&CSS',
    //     status: TaskStatuses.Completed,
    //     startDate: '',
    //     deadline: '',
    //     addedDate: '',
    //     order: 0,
    //     priority: TaskPriorities.Low,
    //     todoListId: todoListId_1,
    //     description: '',
    //
    // },
    //     {
    //         id: v1(), title: 'JS', status: TaskStatuses.Completed, startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low,
    //         todoListId: todoListId_1,
    //         description: '',
    //
    //     },
    //     {
    //         id: v1(), title: 'React', status: TaskStatuses.New, startDate: '',
    //         deadline: '',
    //         addedDate: '',
    //         order: 0,
    //         priority: TaskPriorities.Low,
    //         todoListId: todoListId_1,
    //         description: '',
    //
    //     }]
}

export const tasksReducer = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        case 'SET-TODOLIST': {
            const copyState = {...state}
            action.todos.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
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

export const deleteTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    payload: {taskId, todolistId}
} as const)

export const addTaskAC = (task: TaskType) => ({
    type: 'ADD-TASK',
    task
} as const)

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({
    type: 'CHANGE-TASK-STATUS', payload: {taskId, status, todolistId}
} as const)

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    payload: {taskId, title, todolistId}
} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todolistId, tasks} as const)

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    TodolistApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    TodolistApi.deleteTask(todolistId, taskId)
        .then(() => dispatch(deleteTaskAC(taskId, todolistId)))
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    TodolistApi.createTask(todolistId, title)
        .then((res) => dispatch(addTaskAC(res.data.data.item)))
}

