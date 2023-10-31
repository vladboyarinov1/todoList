import React, { FC, memo, useCallback } from "react";
import { IconButton, ListItem } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { SuperCheckBox } from "common/components/SuperCheckBox/SuperCheckBox";
import s from "features/TodolistsList/ui/TodoList/Task/Task.module.css";
import { tasksActions } from "features/TodolistsList/index";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { useActions } from "common/hooks/useActions";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskEntityStatus, TaskStatuses } from "common/enums/enums";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi-types";

type TasksPropsType = {
    todolistId: string;
    task: TaskType;
    entityStatus: TaskEntityStatus;
};

export const Task: FC<TasksPropsType> = memo(({ todolistId, task, entityStatus }) => {
    const dispatch = useAppDispatch();

    const { updateTask, removeTask } = useActions(tasksActions);

    const changeTaskStatus = useCallback(
        (taskId: string, status: TaskStatuses) =>
            updateTask({
                todolistId,
                taskId,
                model: { status },
            }),
        [dispatch, todolistId],
    );

    const changeTaskTitle = useCallback(
        (title: string) => {
            updateTask({ todolistId, taskId: task.id, model: { title } });
        },
        [dispatch, task.id, todolistId],
    );

    const removeTaskHandler = useCallback(
        (todolistId: string, taskId: string) =>
            removeTask({
                todolistId,
                taskId,
            }),
        [dispatch, task.id, todolistId],
    );

    return (
        <ListItem
            className={entityStatus === TaskEntityStatus.Expectation ? s.disabledTask : ""}
            key={task.id}
            id={task.id}
            divider
            disablePadding
            secondaryAction={
                <IconButton onClick={() => removeTaskHandler(todolistId, task.id)} size={"small"}>
                    <ClearIcon />
                </IconButton>
            }
        >
            <SuperCheckBox
                callBack={(current) => changeTaskStatus(task.id, current)}
                checked={task.status === TaskStatuses.Completed}
            />

            <EditableSpan title={task.title} changeTitle={changeTaskTitle} />
        </ListItem>
    );
});
