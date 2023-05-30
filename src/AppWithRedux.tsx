import React, {useState} from 'react';
import './App.css';
import {AddItemForm} from './components/AddItemForm/AddItemForm';

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
    addTodolistAC,
    changeTodolistFilterAC, changeTodoListTitleAC, removeTodolistAC,
} from './reducers/todolist-reducer/todolist-reducer';
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
} from './reducers/tasks-reducer/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './store';
import {TodoListWithRedux} from './components/TodoList/TodoListWithRedux';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValueType = 'all' | 'active' | 'complete'

export type TodoListType = { // описываем тип одного TodoList
    id: string
    title: string
    filter: FilterValueType
}

export type TasksStateType = { // стейт с тасками
    [todoListId: string]: Array<TaskType>
}

const AppWithRedux = (): JSX.Element => {
    //BLL
    let todolists = useSelector<AppRootStateType, TodoListType[]>(state => state.todolists)
    // let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const [isDark, setDarkMode] = useState<boolean>(false)
    //BLL
    //tasks
    const removeTask = (taskId: string, todoListId: string) => {
        dispatch(removeTaskAC(taskId, todoListId))
    }
    const addTask = (title: string, todoListId: string) => {
        dispatch(addTaskAC(title, todoListId))
    }
    const changeTaskStatus = (taskId: string, newIsDone: boolean, todoListId: string) => {
        dispatch(changeTaskStatusAC(taskId, newIsDone, todoListId))
    }
    const changeTasksTitle = (taskId: string, newTitle: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(taskId, newTitle, todoListId))
    }
    //todoLists
    const changeTodoListFilter = (filter: FilterValueType, todoListId: string) => {
        dispatch(changeTodolistFilterAC(filter, todoListId))
    }
    const getFilterValues = (tasksList: Array<TaskType>, filterValue: FilterValueType) => {
        switch (filterValue) {
            case 'active':
                return tasksList.filter(t => !t.isDone)
            case 'complete':
                return tasksList.filter(t => t.isDone)
            default:
                return tasksList
        }
    }
    const removeTodoList = (todoListId: string) => {
        dispatch(removeTodolistAC(todoListId))
    }
    const addNewTodoList = (title: string) => {
        dispatch(addTodolistAC(title))
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        dispatch(changeTodoListTitleAC(title, todoListId))
    }

    const todoListsComponents = todolists.map(tl => {

        return (
            <Grid key={tl.id} item>
                <Paper elevation={12}>
                    <TodoListWithRedux todolist={tl}/>
                </Paper>
            </Grid>
        )
    })

    const mode = isDark ? 'dark' : 'light'

    const customTheme = createTheme({
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
                        <AddItemForm addItem={addNewTodoList}/>
                    </Grid>
                    <Grid container spacing={4}>{todoListsComponents}</Grid>
                </Container>
            </div>
        </ThemeProvider>

    );
}

export default AppWithRedux;
