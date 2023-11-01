import React from "react";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Task } from "features/TodolistsList/ui/TodoList/Tasks/Task/Task";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";

type Props = {
    tasks: TaskType[];
    todolistId: string;
};
export const Tasks = ({ tasks, todolistId }: Props) => {
    return (
        <div>
            {tasks?.length ? (
                tasks.map((t) => <Task key={t.id} todolistId={todolistId} entityStatus={t.entityStatus} task={t} />)
            ) : (
                <div className={s.emptyTasksText}>Task list is empty</div>
            )}
        </div>
    );
};
