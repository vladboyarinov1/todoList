import React, { memo, useCallback, useEffect, useState } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";
import { IconButton, Typography } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { FilterValue } from "features/TodolistsList/model/todolists/todolistsSlice";
import { ButtonWithMemo } from "common/components/ButtonWithMemo/ButtonWithMemo";
import { Task } from "features/TodolistsList/ui/TodoList/Tasks/Task/Task";
import { RequestStatus } from "features/Application/application-reducer";
import { tasksActions, todolistsActions } from "features/TodolistsList/index";
import { useActions } from "common/hooks/useActions";
import { TaskStatuses } from "common/enums/enums";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";
import { Tasks } from "features/TodolistsList/ui/TodoList/Tasks/Tasks";

type Props = {
    todolist: Todolist;
    entityStatus: RequestStatus;
};

export const TodoList = memo(({ todolist, entityStatus }: Props) => {
    const { id, title } = todolist;
    const [filter, setFilter] = useState<FilterValue>("all");

    let tasks = useAppSelector<TaskType[]>((state) => state.tasks[id]);

    const { fetchTasks, addTask, deleteTodolist, changeTodolistFilter, updateTodolist } = useActions({
        ...tasksActions,
        ...todolistsActions,
    });

    useEffect(() => {
        fetchTasks(id);
    }, []);

    const removeTodolist = () => deleteTodolist(id);

    const onClickChangeFilter = useCallback(
        (filter: FilterValue) => {
            changeTodolistFilter({ filter, id });
            setFilter(filter);
        },
        [id],
    );

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

    const renderFilterButton = (title: string, currenFilter: FilterValue) => {
        return (
            <ButtonWithMemo
                title={title}
                variant={"contained"}
                size={"small"}
                color={filter === currenFilter ? "secondary" : "primary"}
                onClick={() => onClickChangeFilter(currenFilter)}
            />
        );
    };
    let tasksForRender: TaskType[] = getFilterValues(tasks, filter);

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
                {/*{tasksList}*/}
                <Tasks tasks={tasksForRender} todolistId={todolist.id} />
            </div>

            <div className={s.btnFilterContainer}>
                {renderFilterButton("All", "all")}
                {renderFilterButton("Active", "active")}
                {renderFilterButton("Complete", "complete")}
            </div>
        </div>
    );
});
