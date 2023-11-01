import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootState, FieldError } from "common/types/commonTypes";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootState;
    dispatch: AppDispatch;
    rejectValue: { errors: string[]; fieldsErrors?: FieldError[] };
}>();
