import { TypedUseSelectorHook, useSelector } from "react-redux";

import { AppRootState } from "common/types/commonTypes";

export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
