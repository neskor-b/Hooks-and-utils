import { useEffect, useRef } from 'react';

export const EVENT_NAMES = {
    UPDATE_ORDER: 'UPDATE_ORDER',
} as const;

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

    const dispatchCustomEvent = (data: T) => {
        const customEvent = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(customEvent);
    };

    return dispatchCustomEvent;
};

export default useCustomEvent;