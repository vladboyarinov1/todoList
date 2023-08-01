import React, {useEffect, useState} from 'react';
import './App.css';
import '../fonts/Nunito/myfont.ttf'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from '@emotion/react';
import {createTheme} from '@mui/material/styles';
import {
    getTodolistTC
} from '../reducers/todolist-reducer/todolists-reducer';

import {AppDispatchType, useAppDispatch, useAppSelector} from '../store/store';
import {TaskType} from '../api/todolist-api';
import {RequestStatusType} from './app-reducer';
import {Box, CircularProgress} from '@mui/material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {TodolistsList} from '../components/TodolistsList/TodolistsList';
import {Error404} from '../components/ErrorPage/ErrorPage';

export type TasksStateType = { // стейт с тасками
    [todoListId: string]: TaskType[]
}

const App = (): JSX.Element => {

    let status = useAppSelector<RequestStatusType>(state => state.app.status)

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

    return (
        <>
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

                    {status === 'loading' ? <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            minHeight: `calc(100vh - ${customTheme.mixins.toolbar.minHeight}px)`,
                            alignItems: 'center'
                        }}>
                        <CircularProgress sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}/>
                    </Box> : <Container fixed>
                        <Routes>
                            <Route path={'/'} element={<TodolistsList/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                            <Route path={'/404'} element={<Error404/>}/>
                            <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                        </Routes>
                    </Container>
                    }
                    <ErrorSnackbar/>

                </div>
            </ThemeProvider>
        </>
    );
}

export default App;