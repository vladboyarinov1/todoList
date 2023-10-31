import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { useAuth } from "features/Auth/lib/useAuth";

export const Auth = () => {
    const { formik, isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to={"/"} />;
    }

    return (
        <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Grid item justifyContent={"center"} paddingTop="100px">
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                                    {" "}
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                label="email"
                                margin="normal"
                                placeholder={"free@samuraijs.com"}
                                helperText={formik.touched.email && formik.errors.email && formik.errors.email}
                                {...formik.getFieldProps("email")}
                            />
                            <TextField
                                type="password"
                                label="Password"
                                helperText={formik.touched.password && formik.errors.password && formik.errors.password}
                                margin="normal"
                                {...formik.getFieldProps("password")}
                            />
                            <FormControlLabel
                                label={"Remember me"}
                                control={
                                    <Checkbox
                                        checked={formik.values.rememberMe}
                                        {...formik.getFieldProps("rememberMe")}
                                    />
                                }
                            />
                            <Button type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
