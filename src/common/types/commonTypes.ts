import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { TaskEntityStatus, TaskPriorities, TaskStatuses } from "common/enums/enums";
import { store } from "app/store";

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;
export type AppRootStateType = ReturnType<typeof store.getState>;

//task-reducer
export type FlexType = {
    title?: string;
    description?: string;
    priority?: TaskPriorities;
    status?: TaskStatuses;
    startDate?: string;
    deadline?: string;
};

//общие

export type FieldErrorType = { field: string; error: string };
export type BaseResponseType<T = {}> = {
    resultCode: number;
    fieldsErrors?: FieldErrorType[];
    messages: string[];
    data: T;
    entityStatus: TaskEntityStatus;
};
