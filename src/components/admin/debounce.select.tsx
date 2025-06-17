import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';
import type { SelectProps } from 'antd/es/select';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, value, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    const handleOnFocus = () => {
        if (options && options.length > 0) {
            return;
        }
        fetchOptions('').then((newOptions) => {
            setOptions([...options, ...newOptions]);
        });
    };

    const handleOnBlur = () => {
        setOptions([]);
    };

    return (
        <Select
            value={value}
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
        />
    );
}
