import { useAppSelector } from "common/hooks/useAppSelector";
import { authAction, authSelectors } from "features/Auth/index";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useActions } from "common/hooks/useActions";
import { FormikHelpers, useFormik } from "formik";
import { validate } from "features/Auth/validate";
import { LoginParams } from "features/Auth/api/authAPI";

type Formik = Omit<LoginParams, "captcha">;

export const useAuth = () => {
    let isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const dispatch = useAppDispatch();
    const { login } = useActions(authAction);

    const formik = useFormik({
        initialValues: {
            email: "free@samuraijs.com",
            password: "free",
            rememberMe: false,
        },
        validate,
        onSubmit: async (values: Formik, formikHelpers: FormikHelpers<Formik>) => {
            const action = await dispatch(login(values));
            if (login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            } else {
                formik.resetForm();
            }
        },
    });
    return { formik, isLoggedIn };
};
