import { AxiosResponse } from "axios";
import { instance } from "api/instance";
import {
    CreateTaskParam,
    GetTypeResponse,
    ResponseType,
    TaskType,
    TodolistType,
    UpdateTaskModelType,
} from "common/types/commonTypes";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists`); // типизируем данные с бэка
    },
    createTodolist(title: string) {
        return instance.post<
            ResponseType<{ item: TodolistType }>,
            AxiosResponse<
                ResponseType<{
                    item: TodolistType;
                }>
            >,
            { title: string }
        >(`todo-lists`, { title });
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolistTitle(id: string, title: string) {
        return instance.put<
            ResponseType,
            AxiosResponse<ResponseType>,
            { title: string }
        >(`todo-lists/${id}`, {
            title,
        });
    },
    getTasks(todolistId: string) {
        return instance.get<GetTypeResponse>(`/todo-lists/${todolistId}/tasks`);
    },
    createTask(param: CreateTaskParam) {
        return instance.post<
            ResponseType<{ item: TaskType }>,
            AxiosResponse<
                ResponseType<{
                    item: TaskType;
                }>
            >,
            { title: string }
        >(`/todo-lists/${param.todolistId}/tasks`, { title: param.title });
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
        );
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<
            ResponseType<{ item: TaskType }>,
            AxiosResponse<
                ResponseType<{
                    item: TaskType;
                }>
            >,
            UpdateTaskModelType
        >(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};
