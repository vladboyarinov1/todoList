import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    AppDispatchType,
    AppRootStateType,
    FieldErrorType,
} from "common/types/commonTypes";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType;
    dispatch: AppDispatchType;
    rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] };
}>();
