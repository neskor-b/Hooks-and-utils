import { useEffect, useRef } from 'react';

export const EVENT_NAMES = {
    UPDATE_STORAGE_EVENT: 'UPDATE_STORAGE_EVENT',
} as const;

export const dispatchCustomEvent = <T>(data: T, eventName = '' as keyof typeof EVENT_NAMES) => {
    const customEvent = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(customEvent);
};

const useCustomEvent = <T>(eventName: keyof typeof EVENT_NAMES, callback?: (data: T) => void) => {
    const callbackRef = useRef<((data: T) => void) | undefined>(undefined);

    useEffect(() => {
        if (callback) {
            callbackRef.current = callback;
        }
    }, [callback]);

    useEffect(() => {
        const eventHandler = (event: any) => {
            if (callbackRef.current) {
                callbackRef.current(event.detail);
            }
        };

        window.addEventListener(eventName, eventHandler);

        return () => {
            window.removeEventListener(eventName, eventHandler);
        };
    }, [eventName]);

    return dispatchCustomEvent;
};

export default useCustomEvent;
