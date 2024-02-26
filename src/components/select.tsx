import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { InputLabel } from "./input-label";
import { InputError } from "./input-error";
import { FieldPath, FieldPathValue, FieldValues, getError, getValue, setValue } from "@modular-forms/qwik";
import { ModularFormsComponentProps } from "~/utils/modular-forms";

type SelectProps<TValue> = {
    options: { 
        label: string; 
        value: TValue
    }[];
    name: string,
    value?: TValue,
    multiple?: boolean;
    size?: number;
    placeholder?: string;
    required?: boolean;
    class?: string;
    label?: string;
    error?: string;
    onChange$: (value: TValue) => void
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(
    <TValue extends unknown>({ value, options, label, error, name, ...props }: SelectProps<TValue>) => {
        console.log("current-value", value);
        return <div class={`relative mt-0 ${props.class ?? ""}`}>
            <InputLabel label={label} name={name} />
            <select
                {...props}
                name={name}
                aria-placeholder={props.placeholder}
                class={`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                value={JSON.stringify(value)}
                onChange$={(_event: Event, element: HTMLSelectElement) => {
                    const value = options.find(x => JSON.stringify(x.value) === element.value)?.value;
                    if(!value)
                        throw new Error("Selected value could not be found.");

                    console.log("new-value", value);
                    props.onChange$(value);
                }}
            >
                <option value="" disabled hidden selected={!value}>
                    {props.placeholder}
                </option>
                {options.map(({ label, value: optionValue }) => (
                    <option
                        key={`value-${JSON.stringify(optionValue)}`}
                        value={JSON.stringify(optionValue)}
                        selected={JSON.stringify(optionValue) === JSON.stringify(value)}
                    >
                        {label}
                    </option>
                ))}
            </select>
            <InputError {...props} error={error} />
        </div>
    })