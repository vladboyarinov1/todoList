import React, {FC, useCallback, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {TodoList} from './TodoList/TodoList';
import {AppDispatchType, useAppDispatch, useAppSelector} from '../../state/store/store';
import {TodolistDomainType} from './todolists-reducer/todolists-reducer';
import {Navigate} from 'react-router-dom';
import {Box, CircularProgress} from '@mui/material';
import {RequestStatusType} from '../../App/app-reducer/app-reducer';
import {authSelectors} from '../../features/Auth';
import {todoListsSelector} from './selectors';
import {useActions} from '../../hooks/useActions/useActions';
import {todolistsActions} from './index';

export const TodoListsList: FC = () => {
    const {addTodolistTC, fetchTodolists} = useActions(todolistsActions)
    let todoLists = useAppSelector<TodolistDomainType[]>(todoListsSelector)
    let isLoggedIn = useAppSelector<any>(authSelectors.selectIsLoggedIn)
    let status = useAppSelector<RequestStatusType>(state => state.app.status)

    useEffect(() => {// диспатчим санку, она попадет в Redux
        if (!isLoggedIn) return
        fetchTodolists()
    }, [])

    const addNewTodoList = useCallback((title: string) => {
        addTodolistTC(title)
    }, [])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid key={tl.id} item >
                <Paper elevation={12}>
                    <TodoList todolist={tl} entityStatus={tl.entityStatus}/>
                </Paper>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <>
            {status === 'loading' ? <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: `calc(100vh - ${65}px)`,
                        alignItems: 'center',
                    }}>
                    <CircularProgress sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}/>
                </Box> :
                <div style={{paddingBottom: '20px'}}>
                    <Grid container sx={{p: '15px 0'}} style={{width: '300px'}} >
                        <AddItemForm addItem={addNewTodoList} label="todolist name"/>
                    </Grid>
                    <Grid container spacing={4}>{todoListsComponents}</Grid>
                </div>}
        </>
    );
};