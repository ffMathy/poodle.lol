import {
    component$,
    type PropFunction,
} from '@builder.io/qwik';
import { InputLabel } from './input-label';
import { InputError } from './input-error';
import { FieldElement } from '@modular-forms/qwik';

type TextInputProps = {
    name: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
    label?: string;
    class?: string;
    placeholder?: string;
    value: string | undefined;
    error: string;
    required?: boolean;
    ref: PropFunction<(element: FieldElement) => void>;
    onInput$: PropFunction<(event: Event, element: HTMLInputElement) => void>;
    onChange$: PropFunction<
        (
            event: Event,
            element: HTMLInputElement
        ) => void
    >;
    onBlur$: PropFunction<
        (event: Event, element: HTMLInputElement) => void
    >;
};

export const TextInput = component$(
    (props: TextInputProps) => {
        return (<>
            <InputLabel {...props} />
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                    {...props}
                    class={`block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${props.class ?? ""}`}
                    id={props.name}
                    aria-invalid={!!props.error}
                    aria-errormessage={`${props.name}-error`}
                />
            </div>
            <InputError {...props} />
        </>);
    }
);