import { AxiosResponse } from "axios";
import { instance } from "api/instance";
import {
    CreateTaskParam,
    GetTypeResponse,
    BaseResponseType,
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
            BaseResponseType<{ item: TodolistType }>,
            AxiosResponse<
                BaseResponseType<{
                    item: TodolistType;
                }>
            >,
            { title: string }
        >(`todo-lists`, { title });
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${id}`);
    },
    updateTodolistTitle(id: string, title: string) {
        return instance.put<
            BaseResponseType,
            AxiosResponse<BaseResponseType>,
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
        return instance.delete<BaseResponseType>(
            `/todo-lists/${param.todolistId}/tasks/${param.taskId}`,
        );
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
