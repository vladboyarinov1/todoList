type FormikErrorType = {
    email?: string
    password?: string
}

export const validate = (values: any) => {
    const errors: FormikErrorType = {};
    //email
    // if (!values.email) {
    //     errors.email = 'Required';
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors.email = 'Invalid emailllll address';
    // }
    //password
    if (!values.password) {
        errors.password = 'Required';
    } else if (/\s/.test(values.password)) {
        errors.password = 'Password cannot contain spaces';
    } else if (values.password.length > 25) {
        errors.password = 'Password must be at most 25 characters long';
    } else if (!/^.{4,}$/.test(values.password)) {
        errors.password = 'Password must be at least 4 characters long';

    }
    return errors;
};