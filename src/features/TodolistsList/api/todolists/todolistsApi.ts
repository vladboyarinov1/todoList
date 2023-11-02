import { AxiosResponse } from "axios";
import { instance } from "api/instance";
import { BaseResponse } from "common/types/commonTypes";
import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";

export const todolistsApi = {
    getTodolists() {
        return instance.get<Todolist[]>(`todo-lists`); // типизируем данные с бэка
    },
    createTodolist(title: string) {
        return instance.post<
            BaseResponse<{ item: Todolist }>,
            AxiosResponse<
                BaseResponse<{
                    item: Todolist;
                }>
            >,
            { title: string }
        >(`todo-lists`, { title });
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`todo-lists/${id}`);
    },
    updateTodolistTitle(id: string, title: string) {
        return instance.put<BaseResponse, AxiosResponse<BaseResponse>, { title: string }>(`todo-lists/${id}`, {
            title,
        });
    },
};
