import axios, { AxiosResponse } from "axios";
import { FormValuesType } from "../features/Auth/Auth";
import { GetTypeResponse, TaskType, ResponseType, TodolistType, UpdateTaskModelType } from "./types";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
});

export const AuthApi = {
    login(data: FormValuesType) {
        return instance.post<
            { title: string },
            AxiosResponse<
                ResponseType<{
                    userId: number;
                }>
            >,
            FormValuesType
        >(`auth/login`, data);
    },
    me() {
        return instance.get(`auth/me`);
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`);
    },
};

export const TodolistApi = {
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
        return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, {
            title,
        });
    },
    getTasks(todolistId: string) {
        return instance.get<GetTypeResponse>(`/todo-lists/${todolistId}/tasks`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<
            ResponseType<{ item: TaskType }>,
            AxiosResponse<
                ResponseType<{
                    item: TaskType;
                }>
            >,
            { title: string }
        >(`/todo-lists/${todolistId}/tasks`, { title: title });
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
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
