import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import s from "features/TodolistsList/ui/TodoList/TodoList.module.css";
import { IconButton, Typography } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { FilterValue } from "features/TodolistsList/model/todolists/todolistsSlice";
import { ButtonWithMemo } from "common/components/ButtonWithMemo/ButtonWithMemo";
import { Task } from "features/TodolistsList/ui/TodoList/Task/Task";
import { RequestStatus } from "features/Application/application-reducer";
import { tasksActions, todolistsActions } from "features/TodolistsList/index";
import { useActions } from "common/hooks/useActions";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enums/enums";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";

type Props = {
    todolist: Todolist;
    entityStatus: RequestStatus;
};

export const TodoList: FC<Props> = memo(({ todolist, entityStatus }) => {
    const dispatch = useAppDispatch();
    const { id, title } = todolist;
    const [filter, setFilter] = useState<FilterValue>("all");

    let tasks = useAppSelector<TaskType[]>((state) => state.tasks[id]);

    const { fetchTasks } = useActions(tasksActions);

    const { deleteTodolistTC, changeTodolistFilter, updateTodolistTC } = useActions(todolistsActions);

    useEffect(() => {
        fetchTasks(id);
    }, []);

    const removeTodolist = () => deleteTodolistTC(id);

    const onClickChangeFilter = useCallback(
        (filter: FilterValue) => {
            changeTodolistFilter({ filter, id });
            setFilter(filter);
        },
        [dispatch, id],
    );

    const addTask = useCallback(
        async (title: string) => {
            let thunk = tasksActions.addTask({ todolistId: id, title });
            const resultActions = await dispatch(thunk);
            // addTaskTC({todolistId: id, title})
            if (tasksActions.addTask.rejected.match(resultActions)) {
                if (resultActions.payload?.errors?.length) {
                    const errorMessage = resultActions.payload?.errors[0];
                    throw new Error(errorMessage);
                } else {
                    throw new Error("Some error occured");
                }
            }
        },
        [id],
    );

    const changeTodoListTitle = useCallback(
        (title: string) => {
            updateTodolistTC({ id, title });
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
    const tasksList = tasksForRender?.length ? (
        tasksForRender?.map((t) => <Task key={t.id} todolistId={id} entityStatus={t.entityStatus} task={t} />)
    ) : (
        <div className={s.emptyTasksText}>Task list is empty</div>
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
                <EditableSpan title={title} changeTitle={changeTodoListTitle} />
                <IconButton onClick={removeTodolist} size={"small"}>
                    <RestoreFromTrashIcon />
                </IconButton>
            </Typography>
            <div className={s.addItemFormWrapper}>
                <AddItemForm addItem={addTask} label={"task name"} disabled={entityStatus === "loading"} />
            </div>

            <div className={s.tasksListContainer}>{tasksList}</div>

            <div className={s.btnFilterContainer}>
                {renderFilterButton("All", "all")}
                {renderFilterButton("Active", "active")}
                {renderFilterButton("Complete", "complete")}
            </div>
        </div>
    );
});
