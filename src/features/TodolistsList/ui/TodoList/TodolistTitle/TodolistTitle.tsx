import { IconButton, Typography } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import React, { useCallback } from "react";
import { useActions } from "common/hooks/useActions";
import { todolistsActions } from "features/TodolistsList/index";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";

type Props = {
    todolist: TodolistDomain;
};
export const TodolistTitle = ({ todolist }: Props) => {
    const { id, title } = todolist;
    const { deleteTodolist, updateTodolist } = useActions({
        ...todolistsActions,
    });
    const changeTodoListTitleHandler = useCallback((title: string) => {
        updateTodolist({ id, title });
    }, []);
    const removeTodolist = () => deleteTodolist(id);
    return (
        <>
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
        </>
    );
};
