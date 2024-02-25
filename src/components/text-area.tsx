import {
    component$,
    type PropFunction,
    type QwikChangeEvent,
    type QwikFocusEvent,
  } from '@builder.io/qwik';
import { InputError } from './input-error';
import { InputLabel } from './input-label';
import { FieldElement } from '@modular-forms/qwik';
  
  type TextAreaProps = {
    name: string;
    label?: string;
    class?: string;
    placeholder?: string;
    value: string | undefined;
    error: string;
    required?: boolean;
    ref: PropFunction<(element: FieldElement) => void>;
    onInput$: PropFunction<(event: Event, element: HTMLTextAreaElement) => void>;
    onChange$: PropFunction<
      (
        event: Event,
        element: HTMLTextAreaElement
      ) => void
    >;
    onBlur$: PropFunction<
      (event: Event, element: HTMLTextAreaElement) => void
    >;
  };
  
  export const TextArea = component$(
    (props: TextAreaProps) => {
      return (<>
        <InputLabel {...props} />
        <div>
          <textarea
            {...props}
            class={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props.class ?? ""}`}
            id={props.name}
            aria-invalid={!!props.error}
            aria-errormessage={`${props.name}-error`}
          />
        </div>
        <InputError {...props} />
      </>);
    }
  );