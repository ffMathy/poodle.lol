import { component$ } from "@builder.io/qwik";

export const InputError = component$((props: {
    error?: string
  }) => {
    return <>
        {props.error && <p class="mt-2 text-sm text-red-600 col-span-full">{props.error}</p>}
    </>
  });