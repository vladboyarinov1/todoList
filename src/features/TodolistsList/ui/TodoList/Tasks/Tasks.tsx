import React, { useCallback } from "react";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Task } from "features/TodolistsList/ui/TodoList/Tasks/Task/Task";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";
import { FilterValue, TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { TaskStatuses } from "common/enums/enums";

type Props = {
    tasks: TaskType[];
    todolist: TodolistDomain;
};
export const Tasks = ({ tasks, todolist }: Props) => {
    const getFilterValues = useCallback((tasksList: TaskType[], filterValue: FilterValue) => {
        switch (filterValue) {
            case "active":
                return tasksList?.filter((t) => t.status === TaskStatuses.New);
            case "complete":
                return tasksList?.filter((t) => t.status === TaskStatuses.Completed);
            default:
                return tasksList;
        }
    }, []);

    let filteredTasks = getFilterValues(tasks, todolist.filter);

    return (
        <div>
            {filteredTasks?.length ? (
                filteredTasks.map((t) => (
                    <Task key={t.id} todolistId={todolist.id} entityStatus={t.entityStatus} task={t} />
                ))
            ) : (
                <div className={s.emptyTasksText}>Task list is empty</div>
            )}
        </div>
    );
};
