import { component$ } from "@builder.io/qwik";

export default component$((props: {
    label: string,
    class?: string,
    onClick$: () => void
}) => {
    return <button 
        type="button" 
        onClick$={props.onClick$}
        class={`rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${props.class ?? ""}`}
    >
        {props.label}
    </button>
});