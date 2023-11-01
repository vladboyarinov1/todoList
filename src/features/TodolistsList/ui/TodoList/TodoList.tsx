import React, { memo, useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";
import { IconButton, Typography } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { RequestStatus } from "features/Application/application-reducer";
import { tasksActions, todolistsActions } from "features/TodolistsList/index";
import { useActions } from "common/hooks/useActions";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Tasks } from "features/TodolistsList/ui/TodoList/Tasks/Tasks";
import { FilterTasksButtons } from "features/TodolistsList/ui/TodoList/FilterTasksButtons/FilterTasksButtons";

type Props = {
    todolist: TodolistDomain;
    entityStatus: RequestStatus;
};

export const TodoList = memo(({ todolist, entityStatus }: Props) => {
    const { id, title } = todolist;

    let tasks = useAppSelector<TaskType[]>((state) => state.tasks[id]);

    const { fetchTasks, addTask, deleteTodolist, updateTodolist } = useActions({
        ...tasksActions,
        ...todolistsActions,
    });

    useEffect(() => {
        fetchTasks(id);
    }, []);

    const removeTodolist = () => deleteTodolist(id);

    const addTaskHandler = useCallback(
        (title: string) => {
            addTask({ todolistId: id, title });
        },
        [id],
    );

    const changeTodoListTitleHandler = useCallback(
        (title: string) => {
            updateTodolist({ id, title });
        },
        [id],
    );

    return (
        <div className={entityStatus === "loading" ? `${s.todolist} ${s.disabledTodos}` : s.todolist}>
            <Typography
                variant="h5"
                align="center"
                fontWeight="bold"
                padding="10px 0"
                style={{ width: "300px", wordWrap: "break-word" }}
            >
                <EditableSpan title={title} changeTitle={changeTodoListTitleHandler} />
                <IconButton onClick={removeTodolist} size={"small"}>
                    <RestoreFromTrashIcon />
                </IconButton>
            </Typography>
            <div className={s.addItemFormWrapper}>
                <AddItemForm addItem={addTaskHandler} label={"task name"} disabled={entityStatus === "loading"} />
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
