import { TaskEntityStatus, TaskPriorities, TaskStatuses } from "common/enums/enums";

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
    entityStatus: TaskEntityStatus;
};
export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
};
export type GetTypeResponse = {
    error: string | null;
    totalCount: number;
    items: TaskType[];
};
export type CreateTaskParam = {
    todolistId: string;
    title: string;
};
