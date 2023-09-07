import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {ErrorMessage, FormikHelpers, useFormik} from 'formik';
import {validate} from './validate';
import {useAppDispatch, useAppSelector} from '../../state/store/store';
import {loginTC} from '../../state/reducers/auth-reducer/auth-reducer';
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
        onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(loginTC(values));
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error)
                }
            } else  {
                formik.resetForm();
            }

        },
    });

    //{status: boolean}, any , {rejectValue: {errors: string[], fieldsErrors?: FieldErrorType[]}
    //flow
    //происходит ввод с помощью onChange={formik.handleChange} значение помещается в объект initialValues
    //нажимается кнопка submit вызывается onSubmit={formik.handleSubmit}
    //этот объект помещается в onSubmit в values
    //дальнейшая логика
    if (isLogginIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Grid item justifyContent={'center'} paddingTop="100px">
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
                        <TextField label="email" margin="normal"
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