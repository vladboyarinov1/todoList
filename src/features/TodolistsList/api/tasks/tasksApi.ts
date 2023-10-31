import { instance } from "api/instance";
import { BaseResponseType } from "common/types";
import { AxiosResponse } from "axios";
import {
    CreateTaskParam,
    GetTypeResponse,
    TaskType,
    UpdateTaskModelType,
} from "features/TodolistsList/api/tasks/tasksApi-types";

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTypeResponse>(`/todo-lists/${todolistId}/tasks`);
    },
    createTask(param: CreateTaskParam) {
        return instance.post<
            BaseResponseType<{ item: TaskType }>,
            AxiosResponse<
                BaseResponseType<{
                    item: TaskType;
                }>
            >,
            { title: string }
        >(`/todo-lists/${param.todolistId}/tasks`, { title: param.title });
    },
    deleteTask(param: { todolistId: string; taskId: string }) {
        return instance.delete<BaseResponseType>(`/todo-lists/${param.todolistId}/tasks/${param.taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<
            BaseResponseType<{ item: TaskType }>,
            AxiosResponse<
                BaseResponseType<{
                    item: TaskType;
                }>
            >,
            UpdateTaskModelType
        >(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};
