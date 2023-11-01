import { useDispatch } from "react-redux";

import { AppDispatch } from "common/types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
