import {
    component$,
    type PropFunction,
    type QwikChangeEvent,
    type QwikFocusEvent,
} from '@builder.io/qwik';

export const InputLabel = component$(
    (props: {
        label?: string,
        name: string,
        required?: boolean
    }) => {
        if(!props.label)
            return null;

        return (
            <label 
                for={props.name} 
                class="block text-sm font-medium leading-6 text-gray-900 mb-2"
            >
                {props.label} {props.required && <span>*</span>}
            </label>
        );
    }
);