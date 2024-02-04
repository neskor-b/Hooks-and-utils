import { useState, ChangeEvent, useCallback } from 'react';
import { debounce } from 'lodash';

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  delay: number;
}

const useDebouncedInput = ({ value, onChange, delay }: DebouncedInputProps) => {
    const [inputValue, setInputValue] = useState(value);

    const debouncedCallback = useCallback(debounce((debouncedValue: string) => {
        onChange(debouncedValue);
    }, delay), []);

    const handleChange = (event: ChangeEvent<HTMLInputElement> | string) => {
        const newValue = typeof event === 'string' ? event : event.target.value;
        setInputValue(newValue);
        debouncedCallback.cancel();
        debouncedCallback(newValue);
    };

    return {
        inputProps: {
            value: inputValue,
            onChange: handleChange
        },
        clear: () => handleChange('')
    };
};

export default useDebouncedInput;