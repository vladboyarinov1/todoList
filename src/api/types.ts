export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type FieldErrorType = { field: string, error: string };

//T - Type, прилетает динамически
export type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors?: FieldErrorType[]
    messages: string[],
    data: T
    entityStatus: TaskEntityStatus
}

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TaskEntityStatus {
    Prepared,
    Expectation,
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    entityStatus: TaskEntityStatus
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type GetTypeResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
