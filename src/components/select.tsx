import { PropFunction, QwikChangeEvent, QwikFocusEvent, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { InputLabel } from "./input-label";
import { InputError } from "./input-error";
import { FieldPath, FieldPathValue, FieldValues, getError, getValue, setValue } from "@modular-forms/qwik";
import { ModularFormsComponentProps } from "~/utils/modular-forms";

type SelectProps<TFieldValues extends FieldValues, TFieldPath extends FieldPath<TFieldValues>> = ModularFormsComponentProps<TFieldValues, TFieldPath> & {
    options: { 
        label: string; 
        value: FieldPathValue<TFieldValues, TFieldPath> 
    }[];
    multiple?: boolean;
    size?: number;
    placeholder?: string;
    required?: boolean;
    class?: string;
    label?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(
    <TFieldValues extends FieldValues, TFieldPath extends FieldPath<TFieldValues>>
        ({ options, label, form, fieldPath, ...props }: SelectProps<TFieldValues, TFieldPath>) => {
        const value = getValue(form, fieldPath, { shouldActive: false });
        const stringValue = JSON.stringify(value);

        return <div class={`relative mt-0 ${props.class ?? ""}`}>
            <InputLabel label={label} name={fieldPath} />
            <select
                {...props}
                id={fieldPath}
                placeholder={props.placeholder}
                class={`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                value={stringValue}
                onChange$={(event: QwikChangeEvent<HTMLSelectElement>, element: HTMLSelectElement) => {
                    const value = options.find(x => JSON.stringify(x.value) === event.target.value)?.value;
                    if(!value)
                        throw new Error("Selected value could not be found.");

                    setValue(form, fieldPath, value);
                }}
            >
                <option value="" disabled hidden selected={!value}>
                    {props.placeholder}
                </option>
                {options.map(({ label, value }) => (
                    <option
                        key={`value-${value}`}
                        value={JSON.stringify(value)}
                        selected={JSON.stringify(value) === stringValue}
                    >
                        {label}
                    </option>
                ))}
            </select>
            <InputError {...props} error={getError(form, fieldPath)} />
        </div>
    })