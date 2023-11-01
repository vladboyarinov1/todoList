import { AxiosResponse } from "axios";
import { instance } from "api/instance";

import { BaseResponse } from "common/types/commonTypes";

export const authAPI = {
    login(data: LoginParams) {
        return instance.post<
            { title: string },
            AxiosResponse<
                BaseResponse<{
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
        return instance.delete<BaseResponse>(`auth/login`);
    },
};

export type LoginParams = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
};
