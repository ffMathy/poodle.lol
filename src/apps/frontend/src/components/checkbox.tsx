import { component$, useSignal } from "@builder.io/qwik";
import { nanoid } from "nanoid";

export default component$((props: {
    label: string,
    isChecked: boolean,
    onChange$: (isEnabled: boolean) => void
}) => {

    const buttonClass = props.isChecked ?
        "bg-indigo-600" :
        "bg-gray-200";

    const buttonTextClass = props.isChecked ?
        "translate-x-5" :
        "translate-x-0";

    const ariaChecked = props.isChecked ? "true" : "false";

    const ariaId = nanoid();

    return <div>
        <div class="flex items-center">
            <button
                type="button"
                class={`bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${buttonClass}`}
                role="switch"
                aria-checked={ariaChecked}
                aria-labelledby={ariaId}
                onClick$={() => props.onChange$(!props.isChecked)}
            >
                <span aria-hidden="true" class={`translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${buttonTextClass}`}></span>
            </button>
            <span class="ml-3 text-sm" id={ariaId}>
                <span class={`text-gray-900`}>{props.label}</span>
            </span>
        </div>
    </div>
})