import { JSXNode, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { JSX } from "@builder.io/qwik/jsx-runtime";
import { FieldStore, FieldElementProps, FieldPath, FieldValues } from "@modular-forms/qwik";
import { defer } from "lodash";

export default component$(<TFieldValues extends {}>(props: {
    key?: string,
    placeholder?: string,
    class?: string,
    values: TFieldValues[],
    onRenderText$: (value: TFieldValues) => string,
    selectedValue?: TFieldValues,
    onChange$: (value: TFieldValues) => void
}) => {
    const valueString = useSignal("");

    useTask$(async () => {
        valueString.value = await props.onRenderText$(props.selectedValue || props.values[0]);
    });

    return <div class={`relative mt-0 ${props.class ?? ""}`}>
        <select
            placeholder={props.placeholder}
            class={`mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6`}
        >
            {props.values.map((value, index) =>
                <option 
                    key={`combobox-item-${props.key}-${index}-${props.onRenderText$(value)}`}
                    selected={props.selectedValue === value}
                >
                    {props.onRenderText$(value)}
                </option>
            )}
        </select>
    </div>
})