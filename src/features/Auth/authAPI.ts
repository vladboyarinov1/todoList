import { LoginParams } from "features/Auth/Auth";
import { AxiosResponse } from "axios";
import { instance } from "api/instance";

import { ResponseType } from "common/types/commonTypes";

export const authAPI = {
    login(data: LoginParams) {
        return instance.post<
            { title: string },
            AxiosResponse<
                ResponseType<{
                    userId: number;
                }>
            >,
            LoginParams
        >(`auth/login`, data);
    },
    me() {
        return instance.get(`auth/me`);
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`);
    },
};
