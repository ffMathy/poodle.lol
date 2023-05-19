import { JSXNode, Slot, component$ } from "@builder.io/qwik";

export default component$((props: {
    label: string,
    class?: string,
    onClick$: () => void
}) => {
    return <button 
        aria-label={props.label}
        type="button" 
        onClick$={props.onClick$}
        class={`inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${props.class ?? ""}`}
    >
        <Slot name="icon" /> {props.label}
    </button>
});