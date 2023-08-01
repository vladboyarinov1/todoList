import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';
import {validate} from './validate';
import {Simulate} from 'react-dom/test-utils';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {AuthApi} from '../../api/todolist-api';
import {loginTC} from '../../reducers/auth-reducer/auth-reducer';
import {Navigate} from 'react-router-dom';

export type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    let isLogginIn = useAppSelector<any>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate,
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm();//отчищаем форму

        },
    });
    //flow
    //происходит ввод с помощью onChange={formik.handleChange} значение помещается в объект initialValues
    //нажимается кнопка submit вызывается onSubmit={formik.handleSubmit}
    //этот объект помещается в onSubmit в values
    //дальнейшая логика

    if (isLogginIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={'100vh'}
                 marginTop={'-64px'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email" margin="normal"
                                   helperText={formik.touched.email && formik.errors.email && formik.errors.email}
                                   {...formik.getFieldProps('email')}/>
                        <TextField type="password" label="Password"
                                   helperText={formik.touched.password && formik.errors.password && formik.errors.password}
                                   margin="normal"  {...formik.getFieldProps('password')}
                        />
                        <FormControlLabel label={'Remember me'} control={<Checkbox
                            checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}