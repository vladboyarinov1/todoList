import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppDispatch } from "../../utils/redux-utils";
import { useAppSelector } from "../../utils/types";
import { appActions } from "../../features/CommonActions/App";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackbar = () => {
    let error = useAppSelector<null | string>((state) => state.app.error);
    const dispatch = useAppDispatch();
    const { setError } = appActions;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(setError({ error: null }));
    };
    return (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                {error}
            </Alert>
        </Snackbar>
    );
};
