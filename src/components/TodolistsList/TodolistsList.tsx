import React, {FC, useCallback} from 'react';
import Grid from '@mui/material/Grid';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {TodoList} from '../TodoList/TodoList';
import {AppDispatchType, useAppDispatch, useAppSelector} from '../../store/store';
import {addTodolistTC, TodolistDomainType} from '../../reducers/todolist-reducer/todolists-reducer';
import {Navigate} from 'react-router-dom';

export const TodolistsList: FC = () => {

    let todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    let isLogginIn = useAppSelector<any>(state => state.auth.isLoggedIn)

    const dispatch: AppDispatchType = useAppDispatch()

    const addNewTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const todoListsComponents = todolists.map(tl => {
        return (
            <Grid key={tl.id} item>
                <Paper elevation={12}>
                    <TodoList todolist={tl} entityStatus={tl.entityStatus}/>
                </Paper>
            </Grid>
        )
    })

    if (!isLogginIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container sx={{p: '15px 0'}}>
                <AddItemForm addItem={addNewTodoList} label="todolist name"/>
            </Grid>
            <Grid container spacing={4}>{todoListsComponents}</Grid></>
    );
};