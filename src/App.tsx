import React, {useState} from 'react';
import './App.css';
import {v1} from 'uuid';
import {TodoList} from './components/TodoList/TodoList';
import {AddItemForm} from './components/AddItemForm/AddItemForm';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Button, Checkbox,
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
import {blue, deepOrange, indigo, lightGreen} from '@mui/material/colors';
import {dark, light} from '@mui/material/styles/createPalette';
import {CheckBox} from '@mui/icons-material';


// CRUD operations
// create
// read
// update
// delete

//interface => GUI (graphics user interface)

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

const App = (): JSX.Element => {
    //BLL 
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [todoList, setTodoList] = useState<Array<TodoListType>>([
        {id: todoListId_1, title: 'What to learn', filter: 'all'},
        {id: todoListId_2, title: 'What to buy', filter: 'all'}
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todoListId_1]: [{id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false}],

        [todoListId_2]: [{id: v1(), title: 'Cottage cheese', isDone: true},
            {id: v1(), title: 'Yogurt', isDone: true},
            {id: v1(), title: 'Milk', isDone: false}]
    })

    const [isDark, setDarkMode] = useState<boolean>(false)
    //BLL
    //tasks
    const removeTask = (taskId: string, todoListId: string) => {
        setTasks({...tasks, [todoListId]: tasks[todoListId].filter(t => t.id !== taskId)})
    }
    const addTask = (title: string, todoListId: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false
        }
        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]})
    }
    const changeTaskStatus = (taskId: string, newIsDone: boolean, todoListId: string) => {
        setTasks({...tasks, [todoListId]: tasks[todoListId].map(t => t.id === taskId ? {...t, isDone: newIsDone} : t)})
    }
    const changeTasksTitle = (taskId: string, newTitle: string, todoListId: string) => {
        setTasks({
            ...tasks,
            [todoListId]: tasks[todoListId].map(tl => tl.id === taskId ? {...tl, title: newTitle} : tl)
        })
    }
    //todoLists
    const changeTodoListFilter = (filter: FilterValueType, todoListId: string) => {
        setTodoList(todoList.map(tl => tl.id === todoListId ? {...tl, filter: filter} : tl))
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
    const removeTodoList = (todoListId: string) => { // +
        setTodoList(todoList.filter(tl => tl.id !== todoListId))
        const copyTasks = {...tasks}
        delete copyTasks[todoListId]
        setTasks(copyTasks)// и удаляем таски от этого тудулиста
    }
    const addNewTodoList = (title: string) => { //+
        const todoListId = v1()
        const newTodoList: TodoListType = {
            id: todoListId,
            title: title,
            filter: 'all'
        }
        setTodoList([...todoList, newTodoList])// добавили лист в список
        setTasks({...tasks, [todoListId]: []})// сделали место для тасок(засетали путые)
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoList(todoList.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
    } // +


    const todoListsComponents = todoList.map(tl => {
        const tasksForRender: Array<TaskType> = getFilterValues(tasks[tl.id], tl.filter) // получаем фильтрованные таски
        return (
            <Grid item>
                <Paper elevation={12}>
                    <TodoList key={tl.id} todoListId={tl.id} title={tl.title} tasks={tasksForRender} filter={tl.filter}
                              removeTask={removeTask}
                              changeTodoListFilter={changeTodoListFilter} addTask={addTask}
                              changeTaskStatus={changeTaskStatus} removeTodoList={removeTodoList}
                              changeTasksTitle={changeTasksTitle} changeTodoListTitle={changeTodoListTitle}/>
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
                                control={<Switch  onChange={(e) => setDarkMode(e.currentTarget.checked)}/>}
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

export default App;
