import React, { FC, memo } from "react";
import { IconButton, ListItem } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { SuperCheckBox } from "common/components/SuperCheckBox/SuperCheckBox";
import s from "features/TodolistsList/ui/TodoList/Task/Task.module.css";
import { tasksActions } from "features/TodolistsList/index";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { useActions } from "common/hooks/useActions";
import { TaskEntityStatus, TaskStatuses } from "common/enums/enums";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";

type Props = {
    todolistId: string;
    task: TaskType;
    entityStatus: TaskEntityStatus;
};

export const Task: FC<Props> = memo(({ todolistId, task, entityStatus }) => {
    const { updateTask, removeTask } = useActions(tasksActions);

    const changeTaskStatusHandler = (taskId: string, status: TaskStatuses) =>
        updateTask({
            todolistId,
            taskId,
            model: { status },
        });

    const changeTaskTitleHandler = (title: string) => {
        updateTask({ todolistId, taskId: task.id, model: { title } });
    };

    const removeTaskHandler = (todolistId: string, taskId: string) =>
        removeTask({
            todolistId,
            taskId,
        });

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
                callBack={(current) => changeTaskStatusHandler(task.id, current)}
                checked={task.status === TaskStatuses.Completed}
            />

            <EditableSpan title={task.title} changeTitle={changeTaskTitleHandler} />
        </ListItem>
    );
});
