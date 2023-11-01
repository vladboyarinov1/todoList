import { instance } from "api/instance";
import { BaseResponse } from "common/types";
import { AxiosResponse } from "axios";
import {
    CreateTaskParam,
    GetTypeResponse,
    TaskType,
    UpdateTaskModel,
} from "features/TodolistsList/api/tasks/tasksApi.types";

export const tasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTypeResponse>(`/todo-lists/${todolistId}/tasks`);
    },
    createTask(param: CreateTaskParam) {
        return instance.post<
            BaseResponse<{ item: TaskType }>,
            AxiosResponse<
                BaseResponse<{
                    item: TaskType;
                }>
            >,
            { title: string }
        >(`/todo-lists/${param.todolistId}/tasks`, { title: param.title });
    },
    deleteTask(param: { todolistId: string; taskId: string }) {
        return instance.delete<BaseResponse>(`/todo-lists/${param.todolistId}/tasks/${param.taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
        return instance.put<
            BaseResponse<{ item: TaskType }>,
            AxiosResponse<
                BaseResponse<{
                    item: TaskType;
                }>
            >,
            UpdateTaskModel
        >(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};
