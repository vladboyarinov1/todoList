import React, { FC, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TodoList } from "features/TodolistsList/ui/TodoList/TodoList";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { RequestStatus } from "features/Application/application-reducer";
import { authSelectors } from "features/Auth";
import { todoListsSelector } from "features/TodolistsList/model/todolists/todolistsSelectors";
import { todolistsActions } from "features/TodolistsList/index";
import { useActions } from "common/hooks/useActions";
import { AddItemForm } from "common/components";
import { useAppSelector } from "common/hooks/useAppSelector";

export const TodoListsList: FC = () => {
    const { fetchTodolists, addTodolistTC } = useActions(todolistsActions);
    let todoLists = useAppSelector<TodolistDomain[]>(todoListsSelector);
    let isLoggedIn = useAppSelector<any>(authSelectors.selectIsLoggedIn);
    let status = useAppSelector<RequestStatus>((state) => state.app.status);

    // const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isLoggedIn) return;
        fetchTodolists();
    }, []);

    // const addNewTodoList = useCallback(async (title: string) => {
    //     let thunk = addTodolistTC(title);
    //     const resultActions = await dispatch(thunk);
    //
    //     if (addTodolistTC.rejected.match(resultActions)) {
    //         if (resultActions.payload?.errors?.length) {
    //             const errorMessage = resultActions.payload?.errors[0];
    //             throw new Error(errorMessage);
    //         } else {
    //             throw new Error("Some error occured");
    //         }
    //     } else {
    //     }
    // }, []);
    const addNewTodoList = (title: string) => {
        addTodolistTC(title);
    };

    const todoListsComponents = todoLists.map((tl) => {
        return (
            <Grid key={tl.id} item>
                <Paper elevation={12}>
                    <TodoList todolist={tl} entityStatus={tl.entityStatus} />
                </Paper>
            </Grid>
        );
    });

    if (!isLoggedIn) {
        return <Navigate to={"/auth"} />;
    }

    return (
        <>
            {status === "loading" ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        minHeight: `calc(100vh - ${65}px)`,
                        alignItems: "center",
                    }}
                >
                    <CircularProgress
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    />
                </Box>
            ) : (
                <div style={{ paddingBottom: "20px" }}>
                    <Grid container sx={{ p: "15px 0" }} style={{ width: "300px" }}>
                        <AddItemForm addItem={addNewTodoList} label="todolist name" />
                    </Grid>
                    <Grid container spacing={4}>
                        {todoListsComponents}
                    </Grid>
                </div>
            )}
        </>
    );
};
