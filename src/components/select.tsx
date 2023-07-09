import { PropFunction, QwikChangeEvent, QwikFocusEvent, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { InputLabel } from "./input-label";
import { InputError } from "./input-error";

type SelectProps = {
    ref: PropFunction<(element: Element) => void>;
    name: string;
    value: string | string[] | null | undefined;
    onInput$: PropFunction<(event: Event, element: HTMLSelectElement) => void>;
    onChange$: PropFunction<
        (
            event: QwikChangeEvent<HTMLSelectElement>,
            element: HTMLSelectElement
        ) => void
    >;
    onBlur$: PropFunction<
        (
            event: QwikFocusEvent<HTMLSelectElement>,
            element: HTMLSelectElement
        ) => void
    >;
    options: { label: string; value: string }[];
    multiple?: boolean;
    size?: number;
    placeholder?: string;
    required?: boolean;
    class?: string;
    label?: string;
    error?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(
    ({ value, options, label, error, ...props }: SelectProps) => {
        const values = useSignal<string[]>();
        useTask$(({ track }) => {
            track(() => value);
            values.value = Array.isArray(value)
                ? value
                : value && typeof value === 'string'
                    ? [value]
                    : [];
        });
        return <div class={`relative mt-0 ${props.class ?? ""}`}>
            <InputLabel {...props} />
            <select
                {...props}
                id={props.name}
                placeholder={props.placeholder}
                class={`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            >
                <option value="" disabled hidden selected={!value}>
                    {props.placeholder}
                </option>
                {options.map(({ label, value }) => (
                    <option
                        key={`value-${value}`}
                        value={value}
                        selected={values.value?.includes(value)}
                    >
                        {label}
                    </option>
                ))}
            </select>
            <InputError {...props} error={error} />
        </div>
    })