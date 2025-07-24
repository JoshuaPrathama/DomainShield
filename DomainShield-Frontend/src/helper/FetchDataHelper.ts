import { AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";
import AxiosHelper from "./AxiosHelper";
import { ZodSchema } from "zod";
import ZodHelper from "./ZodHelper";

interface FetchDataHelperState<T> {
    data: T | null;
    errorResponse: Error | null;
    error: boolean;
    loading: boolean;
    success: boolean;
}

interface FetchDataHelperProps {
    url: string;
    method: "GET" | "POST" | "DELETE";
    schema: ZodSchema;
    axiosConfig?: AxiosRequestConfig;
}

export default function FetchDataHelper<T>() {
    const [state, setState] = useState<FetchDataHelperState<T>>({
        data: null,
        error: false,
        loading: false,
        success: false,
        errorResponse: null,
    });
    const fetchData = useCallback(
        ({
            url,
            method,
            schema,
            axiosConfig,
        }: FetchDataHelperProps) => {
            const axiosHelper = new AxiosHelper();
            setState((prevState) => ({
                ...prevState,
                loading: true,
            }));
            axiosHelper
                .getAxios()
                .request({
                    url,
                    method,
                    ...axiosConfig,
                })
                .then((response) => {
                    const result = ZodHelper(schema, response.data);
                    if (result.error) {
                        setState((prevState) => ({
                            ...prevState,
                            errorResponse: new Error("Invalid data"),
                            data: response.data,
                            loading: false,
                            error: true,
                            success: false,
                        }));
                        return;
                    }
                    setState((prevState) => ({
                        ...prevState,
                        data: response.data,
                        loading: false,
                        success: true,
                        error: false
                    }));
                    return;
                })
                .catch((error) => {
                    setState((prevState) => ({
                        ...prevState,
                        errorResponse: error,
                        loading: false,
                        error: true,
                    }));
                });
        },
        [],
    );
    return { ...state, fetchData };
}
