import React, { memo, useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { RequestStatus } from "features/Application/application-reducer";
import { tasksActions, todolistsActions } from "features/TodolistsList/index";
import { useActions } from "common/hooks/useActions";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Tasks } from "features/TodolistsList/ui/TodoList/Tasks/Tasks";
import { FilterTasksButtons } from "features/TodolistsList/ui/TodoList/FilterTasksButtons/FilterTasksButtons";
import { TodolistTitle } from "features/TodolistsList/ui/TodoList/TodolistTitle/TodolistTitle";

type Props = {
    todolist: TodolistDomain;
    entityStatus: RequestStatus;
};

export const TodoList = memo(({ todolist, entityStatus }: Props) => {
    const { id } = todolist;

    let tasks = useAppSelector<TaskType[]>((state) => state.tasks[id]);

    const { fetchTasks, addTask } = useActions({
        ...tasksActions,
        ...todolistsActions,
    });

    useEffect(() => {
        fetchTasks(id);
    }, []);

    const addTaskCallback = useCallback(
        (title: string) => {
            addTask({ todolistId: id, title });
        },
        [id],
    );

    return (
        <div className={entityStatus === "loading" ? `${s.todolist} ${s.disabledTodos}` : s.todolist}>
            <TodolistTitle todolist={todolist} />
            <div className={s.addItemFormWrapper}>
                <AddItemForm addItem={addTaskCallback} label={"task name"} disabled={entityStatus === "loading"} />
            </div>
            <div className={s.tasksListContainer}>
                <Tasks tasks={tasks} todolist={todolist} />
            </div>
            <div className={s.btnFilterContainer}>
                <FilterTasksButtons todolist={todolist} />
            </div>
        </div>
    );
});
