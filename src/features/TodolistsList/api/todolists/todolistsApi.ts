import { AxiosResponse } from "axios";
import { instance } from "api/instance";
import { BaseResponseType } from "common/types/commonTypes";
import { TodolistType } from "features/TodolistsList/api/todolists/todolistsApi-types";

export const todolistsApi = {
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
        return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(`todo-lists/${id}`, {
            title,
        });
    },
};
