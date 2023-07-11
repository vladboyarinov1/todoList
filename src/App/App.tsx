import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import '../fonts/Nunito/myfont.ttf'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Button,
    Container,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper, Switch,
    Toolbar,
    Typography
} from '@mui/material';
import {ThemeProvider} from '@emotion/react';
import {createTheme} from '@mui/material/styles';
import {
    addTodolistAC, addTodolistTC, getTodolistTC, TodolistDomainType
} from '../reducers/todolist-reducer/todolists-reducer';

import {useSelector} from 'react-redux';
import {AppDispatchType, AppRootStateType, useAppDispatch, useAppSelector} from '../store/store';
import {TodoList} from '../components/TodoList/TodoList';
import {TaskType, TodolistType} from '../api/todolist-api';


export type TasksStateType = { // стейт с тасками
    [todoListId: string]: TaskType[]
}

const App = (): JSX.Element => {
    let todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const dispatch: AppDispatchType = useAppDispatch()

    useEffect(() => {// диспатчим санку, она попадет в Redux
        dispatch(getTodolistTC())
    }, [])


    const [isDark, setDarkMode] = useState<boolean>(false)

    const mode = isDark ? 'dark' : 'light'

    const customTheme = createTheme({
        typography: {
            fontFamily: 'Nunito'
        },
        palette: {
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#ef5350',
            },
            mode: mode,
        },
    })

    const addNewTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])


    const todoListsComponents = todolists.map(tl => {
        return (
            <Grid key={tl.id} item>
                <Paper elevation={12}>
                    <TodoList todolist={tl}/>
                </Paper>
            </Grid>
        )
    })

    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline/>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            TodoLists
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch onChange={(e) => setDarkMode(e.currentTarget.checked)}/>}
                                label={isDark ? 'dark mode' : 'light mode'}/>
                        </FormGroup>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <Container fixed>
                    <Grid container sx={{p: '15px 0'}}>
                        <AddItemForm addItem={addNewTodoList} label="todolist name"/>
                    </Grid>
                    <Grid container spacing={4}>{todoListsComponents}</Grid>
                </Container>
            </div>
        </ThemeProvider>

    );
}

export default App;
