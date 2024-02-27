import { useEffect, useState } from 'react';
import isArray from 'lodash/isArray';

type UseFetchParams<T, U = T> = {
    apiCall: (...args: any[]) => Promise<T>;
    onModifyResponse?: (response: T) => U;
    params?: any;
    initData?: U;
}

type UseFetchReturn<U> = {
    isLoading: boolean;
    data: U;
    error: Error | {};
}

const useFetch = <T, U = T>({
    apiCall,
    onModifyResponse,
    params = {},
    initData = {} as U,
}: UseFetchParams<T, U>): UseFetchReturn<U> => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<U>(initData);
    const [error, setError] = useState<Error | {}>({});

    const getData = async (_params: any) => {
        try {
            setIsLoading(true);
            const result = isArray(params) ? await apiCall(...(_params as any[])) : await apiCall(_params);

            const newData = onModifyResponse ? onModifyResponse(result) : result;
            setData(newData as U);
        } catch (e) {
            setError(e instanceof Error ? e : new Error('An error occurred'));
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typeof apiCall === 'function') getData(params);
    }, [apiCall, JSON.stringify(params)]);

    return ({
        isLoading,
        data,
        error,
    });
};

export default useFetch;
