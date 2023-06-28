import { component$ } from "@builder.io/qwik";

export default component$((props: {
    error?: string
  }) => {
    return <>
        {props.error && <p class="mt-2 text-sm text-red-600">{props.error}</p>}
    </>
  });