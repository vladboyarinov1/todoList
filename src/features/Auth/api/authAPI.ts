import { LoginParams } from "features/Auth/ui/Auth";
import { AxiosResponse } from "axios";
import { instance } from "api/instance";

import { BaseResponseType } from "common/types/commonTypes";

export const authAPI = {
    login(data: LoginParams) {
        return instance.post<
            { title: string },
            AxiosResponse<
                BaseResponseType<{
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
        return instance.delete<BaseResponseType>(`auth/login`);
    },
};
