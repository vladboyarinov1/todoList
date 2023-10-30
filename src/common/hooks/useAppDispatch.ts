import { useDispatch } from "react-redux";

import { AppDispatchType } from "common/types/commonTypes";

export const useAppDispatch = () => useDispatch<AppDispatchType>();
