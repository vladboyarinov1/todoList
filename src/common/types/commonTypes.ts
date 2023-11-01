import { TaskEntityStatus, TaskPriorities, TaskStatuses } from "common/enums/enums";
import { store } from "app/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootState, any, AnyAction>;

//task-reducer
export type Flex = {
    title?: string;
    description?: string;
    priority?: TaskPriorities;
    status?: TaskStatuses;
    startDate?: string;
    deadline?: string;
};

//общие
export type FieldError = { field: string; error: string };
export type BaseResponse<T = {}> = {
    resultCode: number;
    fieldsErrors?: FieldError[];
    messages: string[];
    data: T;
    entityStatus: TaskEntityStatus;
};
