import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
    TaskEntityStatus,
    TaskPriorities,
    TaskStatuses,
} from "common/enums/enums";
import { store } from "app/store";

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;
export type AppRootStateType = ReturnType<typeof store.getState>;

export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};

export type FieldErrorType = { field: string; error: string };

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

export type FlexType = {
    title?: string;
    description?: string;
    priority?: TaskPriorities;
    status?: TaskStatuses;
    startDate?: string;
    deadline?: string;
};
export type BaseResponseType<T = {}> = {
    resultCode: number;
    fieldsErrors?: FieldErrorType[];
    messages: string[];
    data: T;
    entityStatus: TaskEntityStatus;
};
