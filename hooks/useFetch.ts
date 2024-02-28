import { useEffect, useState } from 'react';
import { useStateToggleHandlers } from 'hooks';

type Props<R, P, M> = {
    apiCall: (params: P) => Promise<R>,
    onModifyResponse?: (data: R) => M,
    onSuccess?: () => void,
    onError?: () => void,
    params?: P,
    initData?: M,
}

const useFetch = <R, P, M = R>({
    apiCall,
    onModifyResponse,
    onError,
    onSuccess,
    params = {} as P,
    initData = {} as M,
}: Props<R, P, M>) => {
    const [isLoading, enableLoading, disableLoading] = useStateToggleHandlers();
    const [data, setData] = useState<M>(initData);
    const [error, setError] = useState({});

    const getData = async (_params: P) => {
        try {
            enableLoading();

            const result = await apiCall(_params);

            if (onModifyResponse) {
                setData(onModifyResponse(result));
            } else {
                setData(result as M);
            }
            onSuccess && onSuccess();
        } catch (e) {
            setError(e);
            window.console.error(e);
            onError && onError();
        } finally {
            disableLoading();
        }
    };

    useEffect(() => {
        typeof apiCall === 'function' && getData(params);
    }, [apiCall, JSON.stringify(params)]);

    return ({
        isLoading,
        data,
        error,
        getData,
    });
};

export default useFetch;

