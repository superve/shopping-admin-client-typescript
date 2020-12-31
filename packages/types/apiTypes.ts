import { AxiosRequestConfig, AxiosPromise, AxiosError, AxiosResponse  } from "axios";

export interface ApiRequestConfig<T> extends AxiosRequestConfig {
    data?: T
    params?: T
    token?: boolean
}
export type ApiConfig = Record<string, ApiRequestConfig<{}>>;

//export type ApiRequestConfig = AxiosRequestConfig;
export type ApiResponsePromise = AxiosPromise;
export type ApiResponseError = AxiosError;
export type ApiResponse =  AxiosResponse;
