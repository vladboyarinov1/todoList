import { TypedUseSelectorHook, useSelector } from "react-redux";

import { AppRootStateType } from "common/types/commonTypes";

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
    useSelector;
