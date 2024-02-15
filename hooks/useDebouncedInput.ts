import { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';


type DebouncedInputProps = {
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  delay: number;
}
const useDebouncedInput = ({ value, delay, onChange }: DebouncedInputProps) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const debouncedCallback = useCallback(debounce((event: ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(event);
    }, delay), []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        debouncedCallback.cancel();
        debouncedCallback(event);
    };

    return {
        value: inputValue,
        onChange: handleChange,
    };
};
export default useDebouncedInput;